import { getCommerceAdmin } from "@/lib/commerce/auth";
import { createCsv, csvResponse, decimalDollars } from "@/lib/commerce/csv";
import { getOrderExportRows } from "@/lib/commerce/repository";
import { orderFiltersSchema } from "@/lib/commerce/validation";

export async function GET(request: Request) {
  if (!(await getCommerceAdmin())) return new Response("Unauthorized", { status: 401 });
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = orderFiltersSchema.safeParse(params);
  const rows = await getOrderExportRows(parsed.success ? parsed.data : {});
  const money = (key: string) => (row: Record<string, unknown>) => decimalDollars(row[key]);
  const csv = createCsv([
    { header: "Order", value: (r) => r.order_number }, { header: "Order Date (UTC)", value: (r) => r.ordered_at },
    { header: "Sales Source", value: (r) => r.source_channel }, { header: "Acquisition Source", value: (r) => r.acquisition_channel },
    { header: "Payment Provider", value: (r) => r.payment_provider }, { header: "Payment Status", value: (r) => r.payment_status },
    { header: "Fulfillment Status", value: (r) => r.fulfillment_status }, { header: "Fulfillment Method", value: (r) => r.fulfillment_method },
    { header: "Customer Name", value: (r) => r.customer_name }, { header: "Customer Email", value: (r) => r.customer_email },
    { header: "Products", value: (r) => r.products }, { header: "SKUs", value: (r) => r.skus }, { header: "Units", value: (r) => r.units },
    { header: "Gross Product Sales USD", value: money("subtotal_cents") }, { header: "Discount USD", value: money("discount_cents") },
    { header: "Shipping Charged USD", value: money("shipping_revenue_cents") }, { header: "Sales Tax USD", value: money("tax_cents") },
    { header: "Total Charged USD", value: money("total_cents") }, { header: "Refunds USD", value: money("refund_total_cents") },
    { header: "Product COGS USD", value: money("product_cogs_cents") }, { header: "Processor Fee USD", value: money("processor_fee_cents") },
    { header: "Channel Fee USD", value: money("channel_fee_cents") }, { header: "Shipping Expense USD", value: (r) => decimalDollars(Number(r.outbound_shipping_cost_cents) + Number(r.supplier_shipping_cost_cents)) },
    { header: "Packaging/Fulfillment Expense USD", value: money("packaging_fulfillment_cost_cents") }, { header: "Gross Profit USD", value: money("gross_profit_cents") },
    { header: "Contribution Profit USD", value: money("contribution_profit_cents") }, { header: "Cost Status", value: (r) => r.cost_status },
    { header: "Stripe Checkout Session", value: (r) => r.external_order_id }, { header: "External Payment ID", value: (r) => r.external_payment_id },
    { header: "UTM Source", value: (r) => r.utm_source }, { header: "UTM Medium", value: (r) => r.utm_medium }, { header: "UTM Campaign", value: (r) => r.utm_campaign },
  ], rows);
  return csvResponse(`admiral-orders-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
