import { randomUUID } from "node:crypto";
import { calculateLandedUnitCost, calculateOrderFinancials } from "./finance";
import { allocateFifo } from "./inventory";
import { getCommercePool, withTransaction, type CommerceQueryClient } from "./db";
import type {
  DashboardMetrics,
  InventoryLotInput,
  ManualOrderInput,
  OrderSummary,
  ProductRecord,
  StripeOrderInput,
} from "./types";

type UnknownRow = Record<string, unknown>;

function isoDate(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value);
}

export interface CommerceDateRange {
  from?: Date | null;
  to?: Date | null;
}

function rangeSql(range: CommerceDateRange, values: unknown[], column = "ordered_at") {
  const conditions: string[] = [];
  if (range.from) {
    values.push(range.from);
    conditions.push(`${column} >= $${values.length}`);
  }
  if (range.to) {
    values.push(range.to);
    conditions.push(`${column} < $${values.length}`);
  }
  return conditions;
}

export async function getDashboardMetrics(range: CommerceDateRange = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
}): Promise<DashboardMetrics> {
  const values: unknown[] = [];
  const conditions = [
    "payment_status IN ('paid', 'partially_refunded', 'refunded')",
    ...rangeSql(range, values),
  ];
  const result = await getCommercePool().query<DashboardMetrics>(
    `SELECT
      COALESCE(SUM(subtotal_cents), 0)::int AS gross_product_sales_cents,
      COALESCE(SUM(discount_cents), 0)::int AS discount_cents,
      COALESCE(SUM(total_cents), 0)::int AS gross_revenue_cents,
      COALESCE(SUM(GREATEST(0, subtotal_cents - discount_cents - refund_total_cents)), 0)::int AS net_revenue_cents,
      COALESCE(SUM(shipping_revenue_cents), 0)::int AS shipping_revenue_cents,
      COALESCE(SUM(tax_cents), 0)::int AS tax_cents,
      COUNT(*)::int AS order_count,
      COALESCE(SUM((SELECT COALESCE(SUM(quantity), 0) FROM commerce_order_items oi WHERE oi.order_id = o.id)), 0)::int AS units_sold,
      COALESCE(SUM(product_cogs_cents), 0)::int AS product_cogs_cents,
      COALESCE(SUM(gross_profit_cents), 0)::int AS gross_profit_cents,
      COALESCE(SUM(contribution_profit_cents), 0)::int AS contribution_profit_cents,
      COALESCE(SUM(refund_total_cents), 0)::int AS refund_total_cents,
      COALESCE(SUM(processor_fee_cents), 0)::int AS processor_fee_cents,
      COALESCE(SUM(channel_fee_cents), 0)::int AS channel_fee_cents,
      COALESCE(SUM(outbound_shipping_cost_cents + supplier_shipping_cost_cents), 0)::int AS shipping_cost_cents,
      COALESCE(SUM(packaging_fulfillment_cost_cents), 0)::int AS packaging_cost_cents,
      COUNT(DISTINCT LOWER(customer_email)) FILTER (WHERE customer_email IS NOT NULL)::int AS unique_customer_count,
      COUNT(*) FILTER (WHERE cost_status = 'missing_cost')::int AS missing_cost_order_count
    FROM commerce_orders o
    WHERE ${conditions.join(" AND ")}`,
    values,
  );
  return result.rows[0] ?? {
    gross_product_sales_cents: 0,
    discount_cents: 0,
    gross_revenue_cents: 0,
    net_revenue_cents: 0,
    shipping_revenue_cents: 0,
    tax_cents: 0,
    order_count: 0,
    units_sold: 0,
    product_cogs_cents: 0,
    gross_profit_cents: 0,
    contribution_profit_cents: 0,
    refund_total_cents: 0,
    processor_fee_cents: 0,
    channel_fee_cents: 0,
    shipping_cost_cents: 0,
    packaging_cost_cents: 0,
    unique_customer_count: 0,
    missing_cost_order_count: 0,
  };
}

export async function getDashboardTrend(range: CommerceDateRange) {
  const values: unknown[] = [];
  const conditions = [
    "payment_status IN ('paid', 'partially_refunded', 'refunded')",
    ...rangeSql(range, values),
  ];
  const result = await getCommercePool().query<{
    day: Date;
    net_sales_cents: number;
    contribution_profit_cents: number;
  }>(
    `SELECT date_trunc('day', ordered_at) AS day,
      COALESCE(SUM(GREATEST(0, subtotal_cents - discount_cents - refund_total_cents)), 0)::int AS net_sales_cents,
      COALESCE(SUM(contribution_profit_cents), 0)::int AS contribution_profit_cents
     FROM commerce_orders WHERE ${conditions.join(" AND ")}
     GROUP BY 1 ORDER BY 1`,
    values,
  );
  return result.rows.map((row) => ({ ...row, day: isoDate(row.day) }));
}

export async function getChannelPerformance(range: CommerceDateRange) {
  const values: unknown[] = [];
  const conditions = [
    "o.payment_status IN ('paid', 'partially_refunded', 'refunded')",
    ...rangeSql(range, values, "o.ordered_at"),
  ];
  const result = await getCommercePool().query<UnknownRow>(
    `SELECT o.source_channel,
      COUNT(*)::int AS orders,
      COALESCE(SUM((SELECT SUM(quantity) FROM commerce_order_items oi WHERE oi.order_id = o.id)), 0)::int AS units,
      COALESCE(SUM(o.subtotal_cents), 0)::int AS gross_sales_cents,
      COALESCE(SUM(GREATEST(0, o.subtotal_cents - o.discount_cents - o.refund_total_cents)), 0)::int AS net_sales_cents,
      COALESCE(SUM(o.product_cogs_cents), 0)::int AS cogs_cents,
      COALESCE(SUM(o.processor_fee_cents + o.channel_fee_cents), 0)::int AS fees_cents,
      COALESCE(SUM(o.contribution_profit_cents), 0)::int AS contribution_profit_cents
     FROM commerce_orders o WHERE ${conditions.join(" AND ")}
     GROUP BY o.source_channel ORDER BY contribution_profit_cents DESC`,
    values,
  );
  return result.rows;
}

export async function getDataQualityWarnings() {
  const result = await getCommercePool().query<{
    missing_cost_orders: number;
    unmatched_transactions: number;
    awaiting_fulfillment: number;
    low_stock_products: number;
  }>(
    `SELECT
      (SELECT COUNT(*) FROM commerce_orders WHERE cost_status = 'missing_cost')::int AS missing_cost_orders,
      (SELECT COUNT(*) FROM commerce_unmatched_transactions WHERE resolved_at IS NULL)::int AS unmatched_transactions,
      (SELECT COUNT(*) FROM commerce_orders WHERE fulfillment_status IN ('unfulfilled', 'ready') AND payment_status = 'paid')::int AS awaiting_fulfillment,
      (SELECT COUNT(*) FROM commerce_products p WHERE p.low_stock_threshold IS NOT NULL AND
        (SELECT COALESCE(SUM(quantity_delta), 0) FROM commerce_inventory_movements m WHERE m.product_id = p.id) <= p.low_stock_threshold)::int AS low_stock_products`,
  );
  return result.rows[0];
}

export async function getRecentOrders(limit = 8): Promise<OrderSummary[]> {
  const result = await getCommercePool().query<OrderSummary>(
    `SELECT id, order_number, source_channel, acquisition_channel, payment_provider,
      external_order_id, payment_status, fulfillment_status, fulfillment_method,
      customer_name, customer_email, total_cents, refund_total_cents, gross_profit_cents,
      contribution_profit_cents, cost_status, ordered_at
    FROM commerce_orders
    ORDER BY ordered_at DESC, created_at DESC
    LIMIT $1`,
    [limit],
  );
  return result.rows.map((row) => ({ ...row, ordered_at: isoDate(row.ordered_at) }));
}

export interface OrderFilters {
  q?: string;
  source?: string;
  payment?: string;
  fulfillment?: string;
  product?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export async function listOrders(filters: OrderFilters = {}) {
  const values: unknown[] = [];
  const where: string[] = [];
  const add = (value: unknown) => {
    values.push(value);
    return `$${values.length}`;
  };

  if (filters.q) {
    const parameter = add(`%${filters.q}%`);
    where.push(`(order_number ILIKE ${parameter} OR COALESCE(customer_name, '') ILIKE ${parameter} OR COALESCE(customer_email, '') ILIKE ${parameter} OR COALESCE(external_order_id, '') ILIKE ${parameter})`);
  }
  if (filters.source && filters.source !== "all") where.push(`source_channel = ${add(filters.source)}`);
  if (filters.payment && filters.payment !== "all") where.push(`payment_status = ${add(filters.payment)}`);
  if (filters.fulfillment && filters.fulfillment !== "all") where.push(`fulfillment_status = ${add(filters.fulfillment)}`);
  if (filters.product && filters.product !== "all") {
    where.push(`EXISTS (SELECT 1 FROM commerce_order_items filter_item WHERE filter_item.order_id = commerce_orders.id AND filter_item.product_id = ${add(filters.product)})`);
  }
  if (filters.from) where.push(`ordered_at >= ${add(`${filters.from}T00:00:00.000Z`)}::timestamptz`);
  if (filters.to) where.push(`ordered_at < (${add(`${filters.to}T00:00:00.000Z`)}::timestamptz + INTERVAL '1 day')`);

  const predicate = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const countResult = await getCommercePool().query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM commerce_orders ${predicate}`,
    values,
  );
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(10, filters.pageSize ?? 25));
  const queryValues = [...values, pageSize, (page - 1) * pageSize];
  const result = await getCommercePool().query<OrderSummary>(
    `SELECT id, order_number, source_channel, acquisition_channel, payment_provider,
      external_order_id, payment_status, fulfillment_status, fulfillment_method,
      customer_name, customer_email, total_cents, refund_total_cents, gross_profit_cents,
      contribution_profit_cents, cost_status, ordered_at
      , (SELECT string_agg(DISTINCT product_name, ', ') FROM commerce_order_items oi WHERE oi.order_id = commerce_orders.id) AS products
      , (SELECT COALESCE(SUM(quantity), 0)::int FROM commerce_order_items oi WHERE oi.order_id = commerce_orders.id) AS units
    FROM commerce_orders ${predicate}
    ORDER BY ordered_at DESC, created_at DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    queryValues,
  );

  return {
    orders: result.rows.map((row) => ({ ...row, ordered_at: isoDate(row.ordered_at) })),
    total: countResult.rows[0]?.count ?? 0,
    page,
    pageSize,
  };
}

export async function getOrder(orderId: string) {
  const pool = getCommercePool();
  const [orderResult, itemsResult, transactionsResult, refundsResult, costAdjustmentsResult] = await Promise.all([
    pool.query<UnknownRow>(
      "SELECT o.*, s.name AS supplier_name FROM commerce_orders o LEFT JOIN commerce_suppliers s ON s.id = o.supplier_id WHERE o.id = $1",
      [orderId],
    ),
    pool.query<UnknownRow>(
      `SELECT oi.*,
        COALESCE(json_agg(json_build_object(
          'lot_id', a.lot_id,
          'lot_reference', COALESCE(l.reference, l.supplier_order_number, l.id),
          'quantity', a.quantity,
          'unit_cost_cents', a.unit_cost_cents,
          'cogs_cents', a.cogs_cents
        )) FILTER (WHERE a.id IS NOT NULL), '[]'::json) AS allocations
      FROM commerce_order_items oi
      LEFT JOIN commerce_order_item_lot_allocations a ON a.order_item_id = oi.id
      LEFT JOIN commerce_inventory_lots l ON l.id = a.lot_id
      WHERE oi.order_id = $1
      GROUP BY oi.id
      ORDER BY oi.created_at`,
      [orderId],
    ),
    pool.query<UnknownRow>(
      "SELECT * FROM commerce_external_transactions WHERE order_id = $1 ORDER BY occurred_at DESC",
      [orderId],
    ),
    pool.query<UnknownRow>("SELECT * FROM commerce_refunds WHERE order_id = $1 ORDER BY refunded_at DESC", [orderId]),
    pool.query<UnknownRow>("SELECT * FROM commerce_order_cost_adjustments WHERE order_id = $1 ORDER BY created_at DESC", [orderId]),
  ]);
  if (!orderResult.rows[0]) return null;
  return {
    order: orderResult.rows[0],
    items: itemsResult.rows,
    transactions: transactionsResult.rows,
    refunds: refundsResult.rows,
    costAdjustments: costAdjustmentsResult.rows,
  };
}

export async function listProducts(): Promise<ProductRecord[]> {
  const result = await getCommercePool().query<ProductRecord>(
    `SELECT p.*,
      COALESCE(SUM(m.quantity_delta), 0)::int AS inventory_on_hand,
      COALESCE((SELECT SUM(quantity_remaining * landed_unit_cost_cents) FROM commerce_inventory_lots l WHERE l.product_id = p.id), 0)::int AS inventory_value_cents
    FROM commerce_products p
    LEFT JOIN commerce_inventory_movements m ON m.product_id = p.id
    GROUP BY p.id
    ORDER BY p.name`,
  );
  return result.rows;
}

export async function getProduct(productId: string) {
  const pool = getCommercePool();
  const [product, lots, movements, performance, channelPerformance, recentOrders] = await Promise.all([
    pool.query<ProductRecord>(
      `SELECT p.*,
        COALESCE(SUM(m.quantity_delta), 0)::int AS inventory_on_hand,
        COALESCE((SELECT SUM(quantity_remaining * landed_unit_cost_cents) FROM commerce_inventory_lots l WHERE l.product_id = p.id), 0)::int AS inventory_value_cents
      FROM commerce_products p
      LEFT JOIN commerce_inventory_movements m ON m.product_id = p.id
      WHERE p.id = $1 GROUP BY p.id`,
      [productId],
    ),
    pool.query<UnknownRow>(
      `SELECT l.*, s.name AS supplier_name
       FROM commerce_inventory_lots l
       LEFT JOIN commerce_suppliers s ON s.id = l.supplier_id
       WHERE l.product_id = $1 ORDER BY l.received_at DESC, l.created_at DESC`,
      [productId],
    ),
    pool.query<UnknownRow>(
      `SELECT m.*, o.order_number
       FROM commerce_inventory_movements m
       LEFT JOIN commerce_orders o ON o.id = m.order_id
       WHERE m.product_id = $1 ORDER BY m.occurred_at DESC, m.created_at DESC LIMIT 100`,
      [productId],
    ),
    pool.query<UnknownRow>(
      `SELECT
        COALESCE(SUM(oi.quantity), 0)::int AS units_sold,
        COALESCE(SUM(oi.unit_price_cents * oi.quantity), 0)::int AS gross_sales_cents,
        COALESCE(SUM(oi.total_cents) - SUM(o.refund_total_cents), 0)::int AS net_sales_cents,
        COALESCE(SUM(oi.cogs_cents), 0)::int AS product_cogs_cents,
        COALESCE(SUM(o.gross_profit_cents), 0)::int AS gross_profit_cents,
        COALESCE(SUM(o.contribution_profit_cents), 0)::int AS contribution_profit_cents
       FROM commerce_order_items oi
       JOIN commerce_orders o ON o.id = oi.order_id
       WHERE oi.product_id = $1 AND o.payment_status IN ('paid', 'partially_refunded', 'refunded')`,
      [productId],
    ),
    pool.query<UnknownRow>(
      `SELECT o.source_channel, COUNT(DISTINCT o.id)::int AS orders,
        COALESCE(SUM(oi.quantity), 0)::int AS units,
        COALESCE(SUM(oi.total_cents), 0)::int AS sales_cents
       FROM commerce_order_items oi JOIN commerce_orders o ON o.id = oi.order_id
       WHERE oi.product_id = $1 GROUP BY o.source_channel ORDER BY sales_cents DESC`,
      [productId],
    ),
    pool.query<UnknownRow>(
      `SELECT DISTINCT o.id, o.order_number, o.ordered_at, o.source_channel, o.total_cents,
        o.payment_status, o.fulfillment_status, o.contribution_profit_cents
       FROM commerce_orders o JOIN commerce_order_items oi ON oi.order_id = o.id
       WHERE oi.product_id = $1 ORDER BY o.ordered_at DESC LIMIT 10`,
      [productId],
    ),
  ]);
  if (!product.rows[0]) return null;
  return {
    product: product.rows[0],
    lots: lots.rows,
    movements: movements.rows,
    performance: performance.rows[0],
    channelPerformance: channelPerformance.rows,
    recentOrders: recentOrders.rows,
  };
}

export async function createProduct(input: {
  id: string;
  name: string;
  sku: string;
  slug: string;
  description?: string | null;
  sellingPriceCents: number;
  currency: string;
  lowStockThreshold?: number | null;
  status: "active" | "draft" | "archived";
}) {
  const result = await getCommercePool().query<{ id: string }>(
    `INSERT INTO commerce_products (
      id, name, sku, slug, status, description, selling_price_cents, currency,
      low_stock_threshold, active
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
    [
      input.id, input.name, input.sku, input.slug, input.status, input.description ?? null,
      input.sellingPriceCents, input.currency, input.lowStockThreshold ?? null,
      input.status === "active",
    ],
  );
  return result.rows[0];
}

export async function listSuppliers() {
  return (await getCommercePool().query<UnknownRow>(
    `SELECT s.*, COUNT(l.id)::int AS lot_count
     FROM commerce_suppliers s LEFT JOIN commerce_inventory_lots l ON l.supplier_id = s.id
     GROUP BY s.id ORDER BY s.name`,
  )).rows;
}

export async function createSupplier(input: {
  name: string;
  platform?: string | null;
  websiteUrl?: string | null;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
}) {
  const id = randomUUID();
  await getCommercePool().query(
    `INSERT INTO commerce_suppliers
     (id, name, platform, website_url, contact_name, email, phone, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [id, input.name, input.platform ?? null, input.websiteUrl ?? null, input.contactName ?? null, input.email ?? null, input.phone ?? null, input.notes ?? null],
  );
  return { id };
}

export async function listInventory() {
  const pool = getCommercePool();
  const [products, lots, movements] = await Promise.all([
    listProducts(),
    pool.query<UnknownRow>(
      `SELECT l.*, p.name AS product_name, p.sku, s.name AS supplier_name
       FROM commerce_inventory_lots l
       JOIN commerce_products p ON p.id = l.product_id
       LEFT JOIN commerce_suppliers s ON s.id = l.supplier_id
       ORDER BY l.received_at DESC, l.created_at DESC`,
    ),
    pool.query<UnknownRow>(
      `SELECT m.*, p.name AS product_name, p.sku,
              l.reference AS lot_reference, l.supplier_order_number,
              o.order_number
       FROM commerce_inventory_movements m
       JOIN commerce_products p ON p.id = m.product_id
       LEFT JOIN commerce_inventory_lots l ON l.id = m.lot_id
       LEFT JOIN commerce_orders o ON o.id = m.order_id
       ORDER BY m.occurred_at DESC, m.created_at DESC
       LIMIT 100`,
    ),
  ]);
  return { products, lots: lots.rows, movements: movements.rows };
}

export async function createInventoryLot(input: InventoryLotInput, createdBy: string) {
  const landedUnitCostCents = calculateLandedUnitCost({
    quantity: input.quantityReceived,
    unitPurchaseCostCents: input.unitPurchaseCostCents,
    inboundShippingCents: input.inboundShippingCents,
    dutyAndFeesCents: input.dutyAndFeesCents,
    otherLandedCostsCents: input.otherLandedCostsCents,
  });

  return withTransaction(async (client) => {
    const product = await client.query("SELECT id FROM commerce_products WHERE id = $1 FOR UPDATE", [input.productId]);
    if (!product.rows[0]) throw new Error("Product not found.");
    await client.query(
      `INSERT INTO commerce_inventory_lots (
        id, product_id, supplier_id, reference, supplier_product_url, supplier_order_number,
        purchased_at, quantity_purchased, expected_arrival_at, received_at, quantity_received,
        quantity_remaining, unit_purchase_cost_cents, inbound_shipping_cents,
        duty_and_fees_cents, other_landed_costs_cents, landed_unit_cost_cents,
        fulfillment_strategy, location, notes
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [
        input.id,
        input.productId,
        input.supplierId ?? null,
        input.reference ?? null,
        input.supplierProductUrl ?? null,
        input.supplierOrderNumber ?? null,
        input.purchasedAt ?? null,
        input.quantityPurchased ?? input.quantityReceived,
        input.expectedArrivalAt ?? null,
        input.receivedAt,
        input.quantityReceived,
        input.unitPurchaseCostCents,
        input.inboundShippingCents,
        input.dutyAndFeesCents,
        input.otherLandedCostsCents,
        landedUnitCostCents,
        input.fulfillmentStrategy ?? "stocked_local",
        input.location ?? "Admiral inventory",
        input.notes ?? null,
      ],
    );
    await client.query(
      `INSERT INTO commerce_inventory_movements
       (id, product_id, lot_id, movement_type, quantity_delta, reason, created_by, occurred_at)
       VALUES ($1,$2,$3,'receipt',$4,$5,$6,$7)`,
      [randomUUID(), input.productId, input.id, input.quantityReceived, input.reference ?? "Inventory lot receipt", createdBy, input.receivedAt],
    );
    return { id: input.id, landedUnitCostCents };
  });
}

export async function adjustInventory(input: {
  productId: string;
  quantityDelta: number;
  reason: string;
}, createdBy: string) {
  return withTransaction(async (client) => {
    const product = await client.query("SELECT id FROM commerce_products WHERE id = $1 FOR UPDATE", [input.productId]);
    if (!product.rows[0]) throw new Error("Product not found.");
    const movementId = randomUUID();
    if (input.quantityDelta > 0) {
      await client.query(
        `INSERT INTO commerce_inventory_movements
         (id, product_id, movement_type, quantity_delta, reason, created_by)
         VALUES ($1,$2,'adjustment',$3,$4,$5)`,
        [movementId, input.productId, input.quantityDelta, input.reason, createdBy],
      );
      return { id: movementId };
    }

    const fifo = allocateFifo(await getFifoLots(client, input.productId), Math.abs(input.quantityDelta));
    let firstMovement = true;
    for (const allocation of fifo.allocations) {
      await client.query(
        "UPDATE commerce_inventory_lots SET quantity_remaining = quantity_remaining - $1, updated_at = NOW() WHERE id = $2",
        [allocation.quantity, allocation.lotId],
      );
      await client.query(
        `INSERT INTO commerce_inventory_movements
         (id, product_id, lot_id, movement_type, quantity_delta, reason, created_by)
         VALUES ($1,$2,$3,'adjustment',$4,$5,$6)`,
        [firstMovement ? movementId : randomUUID(), input.productId, allocation.lotId, -allocation.quantity, input.reason, createdBy],
      );
      firstMovement = false;
    }
    if (fifo.missingQuantity > 0) {
      await client.query(
        `INSERT INTO commerce_inventory_movements
         (id, product_id, movement_type, quantity_delta, reason, created_by)
         VALUES ($1,$2,'adjustment',$3,$4,$5)`,
        [firstMovement ? movementId : randomUUID(), input.productId, -fifo.missingQuantity, `${input.reason} (uncosted quantity)`, createdBy],
      );
    }
    return { id: movementId };
  });
}

function createOrderNumber(date = new Date()) {
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  return `AE-${stamp}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

async function getFifoLots(client: CommerceQueryClient, productId: string) {
  const result = await client.query<{
    id: string;
    quantity_remaining: number;
    landed_unit_cost_cents: number;
    received_at: Date;
  }>(
    `SELECT id, quantity_remaining, landed_unit_cost_cents, received_at
     FROM commerce_inventory_lots
     WHERE product_id = $1 AND quantity_remaining > 0
     ORDER BY received_at, created_at, id
     FOR UPDATE`,
    [productId],
  );
  return result.rows.map((lot) => ({
    id: lot.id,
    quantityRemaining: lot.quantity_remaining,
    landedUnitCostCents: lot.landed_unit_cost_cents,
    receivedAt: lot.received_at,
  }));
}

export async function createManualOrder(input: ManualOrderInput, createdBy: string) {
  return withTransaction(async (client) => {
    let paymentProvider = input.paymentProvider ?? null;
    let externalOrderId = input.externalOrderId ?? null;
    let externalPaymentId = input.externalPaymentId ?? null;
    if (input.unmatchedTransactionId) {
      const unmatchedResult = await client.query<{
        provider: string;
        external_id: string;
        external_payment_id: string | null;
      }>(
        "SELECT provider, external_id, external_payment_id FROM commerce_unmatched_transactions WHERE id = $1 AND resolved_at IS NULL FOR UPDATE",
        [input.unmatchedTransactionId],
      );
      const unmatched = unmatchedResult.rows[0];
      if (!unmatched) throw new Error("Unmatched transaction is unavailable or already resolved.");
      paymentProvider = unmatched.provider;
      externalOrderId = unmatched.external_id;
      externalPaymentId = unmatched.external_payment_id;
    }
    const productResult = await client.query<{
      id: string;
      name: string;
      sku: string;
      currency: string;
    }>("SELECT id, name, sku, currency FROM commerce_products WHERE id = $1 FOR UPDATE", [input.productId]);
    const product = productResult.rows[0];
    if (!product) throw new Error("Product not found.");

    let productCogsCents = 0;
    let costStatus: "complete" | "missing_cost" = "complete";
    let fifo = null as ReturnType<typeof allocateFifo> | null;
    if (input.fulfillmentMethod === "dropship") {
      if (input.supplierUnitCostCents === null || input.supplierUnitCostCents === undefined) {
        throw new Error("Dropship supplier cost is required.");
      }
      productCogsCents = input.supplierUnitCostCents * input.quantity;
    } else {
      const availableLots = await getFifoLots(client, input.productId);
      const selectedLots = input.inventoryLotId
        ? availableLots.filter((lot) => lot.id === input.inventoryLotId)
        : availableLots;
      if (input.inventoryLotId && selectedLots.length === 0) {
        throw new Error("The selected inventory lot is unavailable for this product.");
      }
      fifo = allocateFifo(selectedLots, input.quantity);
      productCogsCents = fifo.cogsCents;
      if (fifo.missingQuantity > 0) costStatus = "missing_cost";
    }

    const subtotalCents = input.unitPriceCents * input.quantity;
    const financials = calculateOrderFinancials({
      subtotalCents,
      discountCents: input.discountCents,
      shippingRevenueCents: input.shippingRevenueCents,
      taxCents: input.taxCents,
      productCogsCents,
      processorFeeCents: input.processorFeeCents,
      channelFeeCents: input.channelFeeCents,
      outboundShippingCostCents: input.outboundShippingCostCents,
      supplierShippingCostCents: input.supplierShippingCostCents,
      packagingFulfillmentCostCents: input.packagingFulfillmentCostCents,
    });
    const orderId = randomUUID();
    const itemId = randomUUID();
    const orderNumber = createOrderNumber(input.orderedAt);
    await client.query(
      `INSERT INTO commerce_orders (
        id, order_number, source_channel, acquisition_channel, payment_provider, external_order_id,
        external_payment_id, payment_status,
        fulfillment_method, customer_name, customer_email, customer_phone,
        shipping_address_line1, shipping_address_line2, shipping_city, shipping_state,
        shipping_postal_code, shipping_country, currency, subtotal_cents, discount_cents,
        shipping_revenue_cents, tax_cents, total_cents, processor_fee_cents, channel_fee_cents,
        outbound_shipping_cost_cents, packaging_fulfillment_cost_cents, product_cogs_cents, supplier_shipping_cost_cents,
        gross_profit_cents, contribution_profit_cents, cost_status, supplier_id,
        supplier_order_reference, supplier_purchased_at, supplier_tracking_number, delivery_notes,
        ordered_at, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        landing_page, referrer, promo_code, notes
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
        $41,$42,$43,$44,$45,$46,$47,$48
      )`,
      [
        orderId, orderNumber, input.sourceChannel, input.acquisitionChannel ?? null,
        paymentProvider, externalOrderId, externalPaymentId, input.paymentStatus,
        input.fulfillmentMethod, input.customerName ?? null,
        input.customerEmail ?? null, input.customerPhone ?? null,
        input.shippingAddressLine1 ?? null, input.shippingAddressLine2 ?? null,
        input.shippingCity ?? null, input.shippingState ?? null, input.shippingPostalCode ?? null,
        input.shippingCountry, product.currency, subtotalCents, input.discountCents,
        input.shippingRevenueCents, input.taxCents, financials.grossRevenueCents,
        input.processorFeeCents, input.channelFeeCents, input.outboundShippingCostCents,
        input.packagingFulfillmentCostCents, productCogsCents, input.supplierShippingCostCents,
        financials.grossProfitCents,
        financials.contributionProfitCents, costStatus, input.supplierId ?? null,
        input.supplierOrderReference ?? null, input.supplierPurchasedAt ?? null,
        input.supplierTrackingNumber ?? null, input.deliveryNotes ?? null,
        input.orderedAt, input.utmSource ?? null, input.utmMedium ?? null,
        input.utmCampaign ?? null, input.utmTerm ?? null, input.utmContent ?? null,
        input.landingPage ?? null, input.referrer ?? null, input.promoCode ?? null,
        input.notes ?? null,
      ],
    );
    await client.query(
      `INSERT INTO commerce_order_items (
        id, order_id, product_id, product_name, sku, quantity, unit_price_cents,
        discount_cents, total_cents, unit_cost_cents, cogs_cents, cost_status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        itemId, orderId, product.id, product.name, product.sku, input.quantity,
        input.unitPriceCents, input.discountCents,
        Math.max(0, subtotalCents - input.discountCents),
        costStatus === "complete" ? Math.round(productCogsCents / input.quantity) : null,
        costStatus === "complete" ? productCogsCents : null,
        costStatus,
      ],
    );

    if (fifo) {
      for (const allocation of fifo.allocations) {
        await client.query(
          "UPDATE commerce_inventory_lots SET quantity_remaining = quantity_remaining - $1, updated_at = NOW() WHERE id = $2",
          [allocation.quantity, allocation.lotId],
        );
        await client.query(
          `INSERT INTO commerce_order_item_lot_allocations
           (id, order_item_id, lot_id, quantity, unit_cost_cents, cogs_cents)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [randomUUID(), itemId, allocation.lotId, allocation.quantity, allocation.unitCostCents, allocation.cogsCents],
        );
        await client.query(
          `INSERT INTO commerce_inventory_movements
           (id, product_id, lot_id, order_id, movement_type, quantity_delta, reason, created_by, occurred_at)
           VALUES ($1,$2,$3,$4,'sale',$5,$6,$7,$8)`,
          [randomUUID(), product.id, allocation.lotId, orderId, -allocation.quantity, orderNumber, createdBy, input.orderedAt],
        );
      }
      if (fifo.missingQuantity > 0) {
        await client.query(
          `INSERT INTO commerce_inventory_movements
           (id, product_id, order_id, movement_type, quantity_delta, reason, created_by, occurred_at)
           VALUES ($1,$2,$3,'sale',$4,$5,$6,$7)`,
          [randomUUID(), product.id, orderId, -fifo.missingQuantity, `${orderNumber}: insufficient costed inventory`, createdBy, input.orderedAt],
        );
      }
    }
    if (externalPaymentId && paymentProvider) {
      await client.query(
        `INSERT INTO commerce_external_transactions (
          id, order_id, provider, transaction_type, external_id, amount_cents,
          fee_cents, currency, status, occurred_at
        ) VALUES ($1,$2,$3,'payment',$4,$5,$6,$7,$8,$9)
        ON CONFLICT (provider, external_id, transaction_type) DO NOTHING`,
        [
          randomUUID(), orderId, paymentProvider, externalPaymentId,
          financials.grossRevenueCents, input.processorFeeCents, product.currency,
          input.paymentStatus, input.orderedAt,
        ],
      );
    }
    if (input.unmatchedTransactionId) {
      await client.query(
        "UPDATE commerce_unmatched_transactions SET resolved_at = NOW() WHERE id = $1",
        [input.unmatchedTransactionId],
      );
    }
    return { id: orderId, orderNumber, costStatus };
  });
}

export async function updateFulfillment(orderId: string, input: {
  fulfillmentStatus: "unfulfilled" | "ready" | "shipped" | "delivered" | "canceled" | "returned";
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  supplierPurchasedAt?: Date | null;
  supplierTrackingNumber?: string | null;
  deliveryNotes?: string | null;
  returnDisposition?: "not_returned" | "restocked" | "damaged" | "lost" | null;
}) {
  const result = await getCommercePool().query<{ id: string }>(
    `UPDATE commerce_orders SET
      fulfillment_status = $2,
      carrier = $3,
      tracking_number = $4,
      tracking_url = $5,
      supplier_purchased_at = $6,
      supplier_tracking_number = $7,
      delivery_notes = $8,
      return_disposition = CASE WHEN $2 = 'returned' THEN $9 ELSE NULL END,
      fulfilled_at = CASE WHEN $2 IN ('shipped', 'delivered') THEN COALESCE(fulfilled_at, NOW()) ELSE fulfilled_at END,
      shipped_at = CASE WHEN $2 IN ('shipped', 'delivered') THEN COALESCE(shipped_at, NOW()) ELSE shipped_at END,
      delivered_at = CASE WHEN $2 = 'delivered' THEN COALESCE(delivered_at, NOW()) ELSE delivered_at END,
      updated_at = NOW()
     WHERE id = $1 RETURNING id`,
    [
      orderId, input.fulfillmentStatus, input.carrier ?? null, input.trackingNumber ?? null,
      input.trackingUrl ?? null, input.supplierPurchasedAt ?? null,
      input.supplierTrackingNumber ?? null, input.deliveryNotes ?? null,
      input.returnDisposition ?? null,
    ],
  );
  if (!result.rows[0]) throw new Error("Order not found.");
  return result.rows[0];
}

export async function overrideOrderItemCost(input: {
  orderId: string;
  orderItemId: string;
  cogsCents: number;
  reason: string;
  createdBy: string;
}) {
  return withTransaction(async (client) => {
    const itemResult = await client.query<{
      id: string;
      quantity: number;
      cogs_cents: number | null;
    }>(
      "SELECT id, quantity, cogs_cents FROM commerce_order_items WHERE id = $1 AND order_id = $2 FOR UPDATE",
      [input.orderItemId, input.orderId],
    );
    const item = itemResult.rows[0];
    if (!item) throw new Error("Order item not found.");
    await client.query(
      `UPDATE commerce_order_items SET cogs_cents = $3::integer,
        unit_cost_cents = ROUND($3::integer::numeric / quantity)::int,
        cost_status = 'complete'
       WHERE id = $1 AND order_id = $2`,
      [input.orderItemId, input.orderId, input.cogsCents],
    );
    await client.query(
      `INSERT INTO commerce_order_cost_adjustments
       (id, order_id, order_item_id, previous_cogs_cents, new_cogs_cents, reason, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [randomUUID(), input.orderId, input.orderItemId, item.cogs_cents, input.cogsCents, input.reason, input.createdBy],
    );
    const totals = await client.query<{
      product_cogs_cents: number;
      missing_items: number;
    }>(
      `SELECT COALESCE(SUM(cogs_cents), 0)::int AS product_cogs_cents,
        COUNT(*) FILTER (WHERE cogs_cents IS NULL)::int AS missing_items
       FROM commerce_order_items WHERE order_id = $1`,
      [input.orderId],
    );
    const orderResult = await client.query<{
      subtotal_cents: number;
      discount_cents: number;
      shipping_revenue_cents: number;
      tax_cents: number;
      refund_total_cents: number;
      processor_fee_cents: number;
      channel_fee_cents: number;
      outbound_shipping_cost_cents: number;
      supplier_shipping_cost_cents: number;
      packaging_fulfillment_cost_cents: number;
    }>(
      `SELECT subtotal_cents, discount_cents, shipping_revenue_cents, tax_cents,
        refund_total_cents, processor_fee_cents, channel_fee_cents,
        outbound_shipping_cost_cents, supplier_shipping_cost_cents,
        packaging_fulfillment_cost_cents
       FROM commerce_orders WHERE id = $1 FOR UPDATE`,
      [input.orderId],
    );
    const order = orderResult.rows[0];
    const cost = totals.rows[0];
    if (!order || !cost) throw new Error("Order not found.");
    const financials = calculateOrderFinancials({
      subtotalCents: order.subtotal_cents,
      discountCents: order.discount_cents,
      shippingRevenueCents: order.shipping_revenue_cents,
      taxCents: order.tax_cents,
      refundTotalCents: order.refund_total_cents,
      productCogsCents: cost.product_cogs_cents,
      processorFeeCents: order.processor_fee_cents,
      channelFeeCents: order.channel_fee_cents,
      outboundShippingCostCents: order.outbound_shipping_cost_cents,
      supplierShippingCostCents: order.supplier_shipping_cost_cents,
      packagingFulfillmentCostCents: order.packaging_fulfillment_cost_cents,
    });
    await client.query(
      `UPDATE commerce_orders SET product_cogs_cents = $2, cost_status = $3,
        gross_profit_cents = $4, contribution_profit_cents = $5, updated_at = NOW()
       WHERE id = $1`,
      [
        input.orderId,
        cost.product_cogs_cents,
        cost.missing_items > 0 ? "missing_cost" : "complete",
        financials.grossProfitCents,
        financials.contributionProfitCents,
      ],
    );
  });
}

export async function listChannels() {
  const [channels, unmatched, lastSync] = await Promise.all([
    getCommercePool().query<UnknownRow>("SELECT * FROM commerce_channel_connections ORDER BY display_name"),
    getCommercePool().query<UnknownRow>(
      "SELECT * FROM commerce_unmatched_transactions WHERE resolved_at IS NULL ORDER BY occurred_at DESC LIMIT 100",
    ),
    getCommercePool().query<UnknownRow>(
      "SELECT * FROM commerce_stripe_sync_runs ORDER BY started_at DESC LIMIT 10",
    ),
  ]);
  return { channels: channels.rows, unmatched: unmatched.rows, syncRuns: lastSync.rows };
}

export async function getOrderExportRows(filters: OrderFilters = {}) {
  const values: unknown[] = [];
  const where: string[] = [];
  const add = (value: unknown) => { values.push(value); return `$${values.length}`; };
  if (filters.q) {
    const parameter = add(`%${filters.q}%`);
    where.push(`(o.order_number ILIKE ${parameter} OR COALESCE(o.customer_name, '') ILIKE ${parameter} OR COALESCE(o.customer_email, '') ILIKE ${parameter} OR COALESCE(o.external_order_id, '') ILIKE ${parameter})`);
  }
  if (filters.source && filters.source !== "all") where.push(`o.source_channel = ${add(filters.source)}`);
  if (filters.payment && filters.payment !== "all") where.push(`o.payment_status = ${add(filters.payment)}`);
  if (filters.fulfillment && filters.fulfillment !== "all") where.push(`o.fulfillment_status = ${add(filters.fulfillment)}`);
  if (filters.product && filters.product !== "all") where.push(`EXISTS (SELECT 1 FROM commerce_order_items pf WHERE pf.order_id = o.id AND pf.product_id = ${add(filters.product)})`);
  if (filters.from) where.push(`o.ordered_at >= ${add(`${filters.from}T00:00:00.000Z`)}::timestamptz`);
  if (filters.to) where.push(`o.ordered_at < (${add(`${filters.to}T00:00:00.000Z`)}::timestamptz + INTERVAL '1 day')`);
  const predicate = where.length ? `WHERE ${where.join(" AND ")}` : "";
  return (await getCommercePool().query<UnknownRow>(
    `SELECT o.*,
      (SELECT string_agg(DISTINCT product_name, ', ') FROM commerce_order_items oi WHERE oi.order_id = o.id) AS products,
      (SELECT string_agg(DISTINCT COALESCE(sku, ''), ', ') FROM commerce_order_items oi WHERE oi.order_id = o.id) AS skus,
      (SELECT COALESCE(SUM(quantity), 0)::int FROM commerce_order_items oi WHERE oi.order_id = o.id) AS units
     FROM commerce_orders o ${predicate}
     ORDER BY o.ordered_at DESC LIMIT 10000`,
    values,
  )).rows;
}

export async function getInventoryExportRows() {
  return (await getCommercePool().query<UnknownRow>(
    `SELECT p.name AS product, p.sku, p.status, p.selling_price_cents,
      COALESCE(SUM(m.quantity_delta), 0)::int AS on_hand,
      COALESCE(SUM(m.quantity_delta), 0)::int AS available,
      p.low_stock_threshold,
      COALESCE((SELECT SUM(quantity_remaining * landed_unit_cost_cents) FROM commerce_inventory_lots l WHERE l.product_id = p.id), 0)::int AS inventory_value_cents
     FROM commerce_products p LEFT JOIN commerce_inventory_movements m ON m.product_id = p.id
     GROUP BY p.id ORDER BY p.name`,
  )).rows;
}

export async function getLotExportRows() {
  return (await getCommercePool().query<UnknownRow>(
    `SELECT l.*, p.name AS product, p.sku, s.name AS supplier, s.platform AS supplier_platform
     FROM commerce_inventory_lots l JOIN commerce_products p ON p.id = l.product_id
     LEFT JOIN commerce_suppliers s ON s.id = l.supplier_id
     ORDER BY l.received_at DESC LIMIT 10000`,
  )).rows;
}

export async function checkLoginAllowed(attemptKey: string) {
  const result = await getCommercePool().query<{ locked_until: Date | null }>(
    "SELECT locked_until FROM commerce_admin_login_attempts WHERE attempt_key = $1",
    [attemptKey],
  );
  const lockedUntil = result.rows[0]?.locked_until;
  return !lockedUntil || lockedUntil.getTime() <= Date.now();
}

export async function recordFailedLogin(attemptKey: string) {
  await getCommercePool().query(
    `INSERT INTO commerce_admin_login_attempts (attempt_key, failed_count)
     VALUES ($1, 1)
     ON CONFLICT (attempt_key) DO UPDATE SET
       failed_count = CASE
         WHEN commerce_admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1
         ELSE commerce_admin_login_attempts.failed_count + 1
       END,
       window_started_at = CASE
         WHEN commerce_admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN NOW()
         ELSE commerce_admin_login_attempts.window_started_at
       END,
       locked_until = CASE
         WHEN (CASE
           WHEN commerce_admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1
           ELSE commerce_admin_login_attempts.failed_count + 1
         END) >= 5 THEN NOW() + INTERVAL '15 minutes'
         ELSE NULL
       END,
       updated_at = NOW()`,
    [attemptKey],
  );
}

export async function clearFailedLogins(attemptKey: string) {
  await getCommercePool().query("DELETE FROM commerce_admin_login_attempts WHERE attempt_key = $1", [attemptKey]);
}

export async function beginWebhookEvent(provider: string, eventId: string, eventType: string) {
  const result = await getCommercePool().query<{ event_id: string }>(
    `INSERT INTO commerce_processed_webhook_events (provider, event_id, event_type, status)
     VALUES ($1,$2,$3,'processing')
     ON CONFLICT (provider, event_id) DO UPDATE SET
       event_type = EXCLUDED.event_type,
       status = 'processing',
       error_message = NULL,
       received_at = NOW(),
       processed_at = NULL
     WHERE commerce_processed_webhook_events.status = 'failed'
       OR (commerce_processed_webhook_events.status = 'processing'
         AND commerce_processed_webhook_events.received_at < NOW() - INTERVAL '10 minutes')
     RETURNING event_id`,
    [provider, eventId, eventType],
  );
  return Boolean(result.rows[0]);
}

export async function beginStripeSync(initiatedBy: string) {
  const id = randomUUID();
  await getCommercePool().query(
    `INSERT INTO commerce_stripe_sync_runs (id, status, initiated_by)
     VALUES ($1, 'running', $2)`,
    [id, initiatedBy],
  );
  return id;
}

export async function completeStripeSync(id: string, counts: {
  imported: number;
  skipped: number;
  unmatched: number;
}) {
  await getCommercePool().query(
    `UPDATE commerce_stripe_sync_runs SET status = 'completed', completed_at = NOW(),
      imported_count = $2, skipped_count = $3, unmatched_count = $4
     WHERE id = $1`,
    [id, counts.imported, counts.skipped, counts.unmatched],
  );
  await getCommercePool().query(
    `UPDATE commerce_channel_connections SET status = 'connected', last_synced_at = NOW(),
      last_error = NULL, updated_at = NOW() WHERE channel_key = 'stripe'`,
  );
}

export async function failStripeSync(id: string, error: unknown) {
  const message = error instanceof Error ? error.message.slice(0, 1000) : "Stripe synchronization failed";
  await getCommercePool().query(
    `UPDATE commerce_stripe_sync_runs SET status = 'failed', completed_at = NOW(), error_message = $2 WHERE id = $1`,
    [id, message],
  );
  await getCommercePool().query(
    `UPDATE commerce_channel_connections SET status = 'error', last_error = $1, updated_at = NOW()
     WHERE channel_key = 'stripe'`,
    [message],
  );
}

export async function completeWebhookEvent(provider: string, eventId: string) {
  await getCommercePool().query(
    `UPDATE commerce_processed_webhook_events SET status = 'processed', processed_at = NOW(), error_message = NULL
     WHERE provider = $1 AND event_id = $2`,
    [provider, eventId],
  );
}

export async function failWebhookEvent(provider: string, eventId: string, error: unknown) {
  const message = error instanceof Error ? error.message.slice(0, 1000) : "Unknown webhook error";
  await getCommercePool().query(
    `UPDATE commerce_processed_webhook_events SET status = 'failed', error_message = $3
     WHERE provider = $1 AND event_id = $2`,
    [provider, eventId, message],
  );
}

export async function resetFailedWebhookEvent(provider: string, eventId: string) {
  const result = await getCommercePool().query<{ event_id: string }>(
    `UPDATE commerce_processed_webhook_events
     SET status = 'processing', error_message = NULL, received_at = NOW()
     WHERE provider = $1 AND event_id = $2 AND status = 'failed'
     RETURNING event_id`,
    [provider, eventId],
  );
  return Boolean(result.rows[0]);
}

export async function upsertStripeOrder(input: StripeOrderInput) {
  return withTransaction(async (client) => {
    const existing = await client.query<{
      id: string;
      order_number: string;
      subtotal_cents: number;
      discount_cents: number;
      shipping_revenue_cents: number;
      tax_cents: number;
      refund_total_cents: number;
      product_cogs_cents: number;
      channel_fee_cents: number;
      outbound_shipping_cost_cents: number;
      supplier_shipping_cost_cents: number;
      packaging_fulfillment_cost_cents: number;
    }>(
      `SELECT id, order_number, subtotal_cents, discount_cents, shipping_revenue_cents,
        tax_cents, refund_total_cents, product_cogs_cents, channel_fee_cents,
        outbound_shipping_cost_cents, supplier_shipping_cost_cents, packaging_fulfillment_cost_cents
       FROM commerce_orders WHERE payment_provider = 'stripe' AND external_order_id = $1 FOR UPDATE`,
      [input.externalOrderId],
    );
    if (existing.rows[0]) {
      const order = existing.rows[0];
      const financials = calculateOrderFinancials({
        subtotalCents: order.subtotal_cents,
        discountCents: order.discount_cents,
        shippingRevenueCents: order.shipping_revenue_cents,
        taxCents: order.tax_cents,
        refundTotalCents: order.refund_total_cents,
        productCogsCents: order.product_cogs_cents,
        processorFeeCents: input.processorFeeCents,
        channelFeeCents: order.channel_fee_cents,
        outboundShippingCostCents: order.outbound_shipping_cost_cents,
        supplierShippingCostCents: order.supplier_shipping_cost_cents,
        packagingFulfillmentCostCents: order.packaging_fulfillment_cost_cents,
      });
      await client.query(
        `UPDATE commerce_orders SET payment_status = $2, processor_fee_cents = $3,
          gross_profit_cents = $4, contribution_profit_cents = $5, updated_at = NOW()
         WHERE id = $1`,
        [order.id, input.paymentStatus, input.processorFeeCents, financials.grossProfitCents, financials.contributionProfitCents],
      );
      if (input.externalPaymentId) {
        await client.query(
          `INSERT INTO commerce_external_transactions (
            id, order_id, provider, transaction_type, external_id, amount_cents,
            fee_cents, currency, status, occurred_at, raw_summary
          ) VALUES ($1,$2,'stripe','payment',$3,$4,$5,$6,$7,$8,$9)
          ON CONFLICT (provider, external_id, transaction_type) DO UPDATE SET
            fee_cents = EXCLUDED.fee_cents, status = EXCLUDED.status, raw_summary = EXCLUDED.raw_summary`,
          [randomUUID(), order.id, input.externalPaymentId, input.totalCents, input.processorFeeCents, input.currency, input.paymentStatus, input.orderedAt, input.rawSummary ?? null],
        );
      }
      return { id: order.id, order_number: order.order_number, created: false };
    }

    if (!input.items.length || input.items.some((item) => !item.productId)) {
      await client.query(
        `INSERT INTO commerce_unmatched_transactions (
          id, provider, external_id, external_payment_id, amount_cents, currency,
          customer_email, reason, occurred_at, raw_summary
        ) VALUES ($1,'stripe',$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (provider, external_id) DO UPDATE SET
          external_payment_id = EXCLUDED.external_payment_id,
          amount_cents = EXCLUDED.amount_cents,
          customer_email = EXCLUDED.customer_email,
          reason = EXCLUDED.reason,
          raw_summary = EXCLUDED.raw_summary`,
        [
          randomUUID(), input.externalOrderId, input.externalPaymentId, input.totalCents,
          input.currency, input.customerEmail, "Product metadata did not match a known catalog item.",
          input.orderedAt, input.rawSummary ?? null,
        ],
      );
      return { id: null, order_number: null, created: false, unmatched: true };
    }

    const orderId = randomUUID();
    const orderNumber = createOrderNumber(input.orderedAt);
    const preparedItems = [];
    let productCogsCents = 0;
    let costStatus: "complete" | "missing_cost" = "complete";
    for (const item of input.items) {
      const itemId = randomUUID();
      const fifo = allocateFifo(await getFifoLots(client, item.productId as string), item.quantity);
      if (fifo.missingQuantity > 0) costStatus = "missing_cost";
      productCogsCents += fifo.cogsCents;
      preparedItems.push({ item, itemId, fifo });
    }
    const financials = calculateOrderFinancials({
      subtotalCents: input.subtotalCents,
      discountCents: input.discountCents,
      shippingRevenueCents: input.shippingRevenueCents,
      taxCents: input.taxCents,
      productCogsCents,
      processorFeeCents: input.processorFeeCents,
    });
    await client.query(
      `INSERT INTO commerce_orders (
        id, order_number, source_channel, acquisition_channel, payment_provider,
        external_order_id, external_payment_id, payment_status, fulfillment_method,
        customer_name, customer_email, customer_phone, shipping_address_line1,
        shipping_address_line2, shipping_city, shipping_state, shipping_postal_code,
        shipping_country, currency, subtotal_cents, discount_cents, shipping_revenue_cents,
        tax_cents, total_cents, processor_fee_cents, product_cogs_cents, gross_profit_cents,
        contribution_profit_cents, cost_status, ordered_at, utm_source, utm_medium,
        utm_campaign, utm_term, utm_content, landing_page, referrer, promo_code
      ) VALUES (
        $1,$2,'website',$3,'stripe',$4,$5,$6,'admiral_inventory',$7,$8,$9,$10,$11,$12,$13,$14,
        $15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35
      )`,
      [
        orderId, orderNumber, input.acquisitionChannel ?? null, input.externalOrderId,
        input.externalPaymentId, input.paymentStatus, input.customerName, input.customerEmail,
        input.customerPhone, input.shippingAddressLine1, input.shippingAddressLine2,
        input.shippingCity, input.shippingState, input.shippingPostalCode, input.shippingCountry,
        input.currency, input.subtotalCents, input.discountCents, input.shippingRevenueCents,
        input.taxCents, input.totalCents, input.processorFeeCents, productCogsCents,
        financials.grossProfitCents, financials.contributionProfitCents, costStatus,
        input.orderedAt, input.utmSource ?? null,
        input.utmMedium ?? null, input.utmCampaign ?? null, input.utmTerm ?? null,
        input.utmContent ?? null, input.landingPage ?? null, input.referrer ?? null,
        input.promoCode ?? null,
      ],
    );
    for (const { item, itemId, fifo } of preparedItems) {
      await client.query(
        `INSERT INTO commerce_order_items (
          id, order_id, product_id, external_line_item_id, product_name, sku,
          quantity, unit_price_cents, discount_cents, total_cents, unit_cost_cents,
          cogs_cents, cost_status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          itemId, orderId, item.productId, item.externalLineItemId, item.productName,
          item.sku, item.quantity, item.unitPriceCents, item.discountCents, item.totalCents,
          fifo.missingQuantity === 0 ? Math.round(fifo.cogsCents / item.quantity) : null,
          fifo.missingQuantity === 0 ? fifo.cogsCents : null,
          fifo.missingQuantity === 0 ? "complete" : "missing_cost",
        ],
      );
      for (const allocation of fifo.allocations) {
        await client.query(
          "UPDATE commerce_inventory_lots SET quantity_remaining = quantity_remaining - $1, updated_at = NOW() WHERE id = $2",
          [allocation.quantity, allocation.lotId],
        );
        await client.query(
          `INSERT INTO commerce_order_item_lot_allocations
           (id, order_item_id, lot_id, quantity, unit_cost_cents, cogs_cents)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [randomUUID(), itemId, allocation.lotId, allocation.quantity, allocation.unitCostCents, allocation.cogsCents],
        );
        await client.query(
          `INSERT INTO commerce_inventory_movements
           (id, product_id, lot_id, order_id, movement_type, quantity_delta, reason, created_by, occurred_at)
           VALUES ($1,$2,$3,$4,'sale',$5,$6,'stripe',$7)`,
          [randomUUID(), item.productId, allocation.lotId, orderId, -allocation.quantity, orderNumber, input.orderedAt],
        );
      }
      if (fifo.missingQuantity > 0) {
        await client.query(
          `INSERT INTO commerce_inventory_movements
           (id, product_id, order_id, movement_type, quantity_delta, reason, created_by, occurred_at)
           VALUES ($1,$2,$3,'sale',$4,$5,'stripe',$6)`,
          [randomUUID(), item.productId, orderId, -fifo.missingQuantity, `${orderNumber}: insufficient costed inventory`, input.orderedAt],
        );
      }
    }
    if (input.externalPaymentId) {
      await client.query(
        `INSERT INTO commerce_external_transactions (
          id, order_id, provider, transaction_type, external_id, amount_cents,
          fee_cents, currency, status, occurred_at, raw_summary
        ) VALUES ($1,$2,'stripe','payment',$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (provider, external_id, transaction_type) DO NOTHING`,
        [
          randomUUID(), orderId, input.externalPaymentId, input.totalCents,
          input.processorFeeCents, input.currency, input.paymentStatus, input.orderedAt,
          input.rawSummary ?? null,
        ],
      );
    }
    return { id: orderId, order_number: orderNumber, created: true };
  });
}

export async function recordStripeRefund(input: {
  externalPaymentId: string;
  externalRefundId: string;
  amountCents: number;
  currency: string;
  reason: string | null;
  status: string;
  refundedAt: Date;
}) {
  return withTransaction(async (client) => {
    const orderResult = await client.query<{
      id: string;
      total_cents: number;
      subtotal_cents: number;
      discount_cents: number;
      shipping_revenue_cents: number;
      refund_total_cents: number;
      tax_cents: number;
      product_cogs_cents: number;
      supplier_shipping_cost_cents: number;
      processor_fee_cents: number;
      channel_fee_cents: number;
      outbound_shipping_cost_cents: number;
      packaging_fulfillment_cost_cents: number;
    }>(
      "SELECT id, total_cents, subtotal_cents, discount_cents, shipping_revenue_cents, refund_total_cents, tax_cents, product_cogs_cents, supplier_shipping_cost_cents, processor_fee_cents, channel_fee_cents, outbound_shipping_cost_cents, packaging_fulfillment_cost_cents FROM commerce_orders WHERE payment_provider = 'stripe' AND external_payment_id = $1 FOR UPDATE",
      [input.externalPaymentId],
    );
    const order = orderResult.rows[0];
    if (!order) return { matched: false };
    const inserted = await client.query<{ id: string }>(
      `INSERT INTO commerce_refunds (
        id, order_id, provider, external_refund_id, amount_cents, reason, status, refunded_at
      ) VALUES ($1,$2,'stripe',$3,$4,$5,$6,$7)
      ON CONFLICT (provider, external_refund_id) DO NOTHING RETURNING id`,
      [randomUUID(), order.id, input.externalRefundId, input.amountCents, input.reason, input.status, input.refundedAt],
    );
    if (!inserted.rows[0]) return { matched: true, created: false };
    const totalRefunds = order.refund_total_cents + input.amountCents;
    const status = totalRefunds >= order.total_cents ? "refunded" : "partially_refunded";
    const financials = calculateOrderFinancials({
      subtotalCents: order.subtotal_cents,
      discountCents: order.discount_cents,
      shippingRevenueCents: order.shipping_revenue_cents,
      taxCents: order.tax_cents,
      refundTotalCents: totalRefunds,
      productCogsCents: order.product_cogs_cents,
      supplierShippingCostCents: order.supplier_shipping_cost_cents,
      processorFeeCents: order.processor_fee_cents,
      channelFeeCents: order.channel_fee_cents,
      outboundShippingCostCents: order.outbound_shipping_cost_cents,
      packagingFulfillmentCostCents: order.packaging_fulfillment_cost_cents,
    });
    await client.query(
      `UPDATE commerce_orders SET refund_total_cents = $2, payment_status = $3,
        gross_profit_cents = $4, contribution_profit_cents = $5, updated_at = NOW()
       WHERE id = $1`,
      [order.id, totalRefunds, status, financials.grossProfitCents, financials.contributionProfitCents],
    );
    await client.query(
      `INSERT INTO commerce_external_transactions (
        id, order_id, provider, transaction_type, external_id, parent_external_id,
        amount_cents, currency, status, occurred_at
      ) VALUES ($1,$2,'stripe','refund',$3,$4,$5,$6,$7,$8)
      ON CONFLICT (provider, external_id, transaction_type) DO NOTHING`,
      [randomUUID(), order.id, input.externalRefundId, input.externalPaymentId, -input.amountCents, input.currency, input.status, input.refundedAt],
    );
    return { matched: true, created: true };
  });
}
