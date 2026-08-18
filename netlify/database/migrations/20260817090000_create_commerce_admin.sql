CREATE TABLE IF NOT EXISTS commerce_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  description TEXT,
  selling_price_cents INTEGER NOT NULL CHECK (selling_price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (char_length(currency) = 3),
  low_stock_threshold INTEGER CHECK (low_stock_threshold IS NULL OR low_stock_threshold >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commerce_suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT,
  website_url TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commerce_inventory_lots (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES commerce_products(id),
  supplier_id TEXT REFERENCES commerce_suppliers(id),
  reference TEXT,
  supplier_product_url TEXT,
  supplier_order_number TEXT,
  purchased_at TIMESTAMPTZ,
  quantity_purchased INTEGER CHECK (quantity_purchased IS NULL OR quantity_purchased > 0),
  expected_arrival_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL,
  quantity_received INTEGER NOT NULL CHECK (quantity_received > 0),
  quantity_remaining INTEGER NOT NULL CHECK (quantity_remaining >= 0),
  unit_purchase_cost_cents INTEGER NOT NULL CHECK (unit_purchase_cost_cents >= 0),
  inbound_shipping_cents INTEGER NOT NULL DEFAULT 0 CHECK (inbound_shipping_cents >= 0),
  duty_and_fees_cents INTEGER NOT NULL DEFAULT 0 CHECK (duty_and_fees_cents >= 0),
  other_landed_costs_cents INTEGER NOT NULL DEFAULT 0 CHECK (other_landed_costs_cents >= 0),
  landed_unit_cost_cents INTEGER NOT NULL CHECK (landed_unit_cost_cents >= 0),
  fulfillment_strategy TEXT NOT NULL DEFAULT 'stocked_local' CHECK (fulfillment_strategy IN ('stocked_local', 'dropship', 'third_party_fulfillment', 'other')),
  location TEXT NOT NULL DEFAULT 'Admiral inventory',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (quantity_remaining <= quantity_received)
);

CREATE TABLE IF NOT EXISTS commerce_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  source_channel TEXT NOT NULL CHECK (source_channel IN ('website', 'manual', 'facebook_marketplace', 'd2d_local', 'marketplace', 'wholesale', 'other')),
  acquisition_channel TEXT,
  payment_provider TEXT,
  external_order_id TEXT,
  external_payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'partially_refunded', 'refunded', 'failed', 'canceled')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'ready', 'shipped', 'delivered', 'canceled', 'returned')),
  fulfillment_method TEXT NOT NULL DEFAULT 'admiral_inventory' CHECK (fulfillment_method IN ('admiral_inventory', 'dropship', 'local_pickup', 'third_party_fulfillment')),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT NOT NULL DEFAULT 'US',
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (char_length(currency) = 3),
  subtotal_cents INTEGER NOT NULL DEFAULT 0 CHECK (subtotal_cents >= 0),
  discount_cents INTEGER NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  shipping_revenue_cents INTEGER NOT NULL DEFAULT 0 CHECK (shipping_revenue_cents >= 0),
  tax_cents INTEGER NOT NULL DEFAULT 0 CHECK (tax_cents >= 0),
  total_cents INTEGER NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  processor_fee_cents INTEGER NOT NULL DEFAULT 0 CHECK (processor_fee_cents >= 0),
  channel_fee_cents INTEGER NOT NULL DEFAULT 0 CHECK (channel_fee_cents >= 0),
  outbound_shipping_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (outbound_shipping_cost_cents >= 0),
  packaging_fulfillment_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (packaging_fulfillment_cost_cents >= 0),
  product_cogs_cents INTEGER NOT NULL DEFAULT 0 CHECK (product_cogs_cents >= 0),
  supplier_shipping_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (supplier_shipping_cost_cents >= 0),
  gross_profit_cents INTEGER NOT NULL DEFAULT 0,
  contribution_profit_cents INTEGER NOT NULL DEFAULT 0,
  refund_total_cents INTEGER NOT NULL DEFAULT 0 CHECK (refund_total_cents >= 0),
  cost_status TEXT NOT NULL DEFAULT 'complete' CHECK (cost_status IN ('complete', 'missing_cost')),
  supplier_id TEXT REFERENCES commerce_suppliers(id),
  supplier_order_reference TEXT,
  supplier_purchased_at TIMESTAMPTZ,
  supplier_tracking_number TEXT,
  carrier TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  fulfilled_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  delivery_notes TEXT,
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  landing_page TEXT,
  referrer TEXT,
  promo_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS commerce_orders_provider_external_order_unique
  ON commerce_orders(payment_provider, external_order_id)
  WHERE payment_provider IS NOT NULL AND external_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS commerce_orders_provider_external_payment_unique
  ON commerce_orders(payment_provider, external_payment_id)
  WHERE payment_provider IS NOT NULL AND external_payment_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS commerce_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES commerce_orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES commerce_products(id),
  external_line_item_id TEXT,
  external_product_id TEXT,
  external_sku TEXT,
  product_name TEXT NOT NULL,
  sku TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  discount_cents INTEGER NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  unit_cost_cents INTEGER CHECK (unit_cost_cents IS NULL OR unit_cost_cents >= 0),
  cogs_cents INTEGER CHECK (cogs_cents IS NULL OR cogs_cents >= 0),
  cost_status TEXT NOT NULL DEFAULT 'complete' CHECK (cost_status IN ('complete', 'missing_cost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commerce_order_item_lot_allocations (
  id TEXT PRIMARY KEY,
  order_item_id TEXT NOT NULL REFERENCES commerce_order_items(id) ON DELETE CASCADE,
  lot_id TEXT NOT NULL REFERENCES commerce_inventory_lots(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost_cents INTEGER NOT NULL CHECK (unit_cost_cents >= 0),
  cogs_cents INTEGER NOT NULL CHECK (cogs_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_item_id, lot_id)
);

CREATE TABLE IF NOT EXISTS commerce_inventory_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES commerce_products(id),
  lot_id TEXT REFERENCES commerce_inventory_lots(id),
  order_id TEXT REFERENCES commerce_orders(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('receipt', 'sale', 'adjustment', 'sample', 'demo', 'damaged', 'lost', 'return', 'restock', 'correction')),
  quantity_delta INTEGER NOT NULL CHECK (quantity_delta <> 0),
  reason TEXT,
  created_by TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commerce_external_transactions (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES commerce_orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('payment', 'refund', 'fee', 'adjustment')),
  external_id TEXT NOT NULL,
  parent_external_id TEXT,
  amount_cents INTEGER NOT NULL,
  fee_cents INTEGER NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,
  raw_summary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, external_id, transaction_type)
);

CREATE TABLE IF NOT EXISTS commerce_refunds (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES commerce_orders(id) ON DELETE CASCADE,
  provider TEXT,
  external_refund_id TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'succeeded',
  refunded_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS commerce_refunds_provider_external_unique
  ON commerce_refunds(provider, external_refund_id)
  WHERE provider IS NOT NULL AND external_refund_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS commerce_processed_webhook_events (
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('processing', 'processed', 'failed')),
  error_message TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  PRIMARY KEY (provider, event_id)
);

CREATE TABLE IF NOT EXISTS commerce_channel_connections (
  id TEXT PRIMARY KEY,
  channel_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('connected', 'not_configured', 'error')),
  capabilities JSONB NOT NULL DEFAULT '{}'::JSONB,
  last_synced_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS commerce_stripe_sync_runs (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  imported_count INTEGER NOT NULL DEFAULT 0,
  skipped_count INTEGER NOT NULL DEFAULT 0,
  unmatched_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  initiated_by TEXT
);

CREATE TABLE IF NOT EXISTS commerce_unmatched_transactions (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  external_id TEXT NOT NULL,
  external_payment_id TEXT,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  customer_email TEXT,
  reason TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  raw_summary JSONB,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, external_id)
);

CREATE TABLE IF NOT EXISTS commerce_admin_login_attempts (
  attempt_key TEXT PRIMARY KEY,
  failed_count INTEGER NOT NULL DEFAULT 0,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commerce_orders_ordered_at_idx ON commerce_orders(ordered_at DESC);
CREATE INDEX IF NOT EXISTS commerce_orders_source_idx ON commerce_orders(source_channel);
CREATE INDEX IF NOT EXISTS commerce_orders_status_idx ON commerce_orders(payment_status, fulfillment_status);
CREATE INDEX IF NOT EXISTS commerce_order_items_order_idx ON commerce_order_items(order_id);
CREATE INDEX IF NOT EXISTS commerce_inventory_lots_fifo_idx ON commerce_inventory_lots(product_id, received_at, created_at) WHERE quantity_remaining > 0;
CREATE INDEX IF NOT EXISTS commerce_inventory_movements_product_idx ON commerce_inventory_movements(product_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS commerce_refunds_order_idx ON commerce_refunds(order_id);
CREATE INDEX IF NOT EXISTS commerce_unmatched_open_idx ON commerce_unmatched_transactions(provider, occurred_at DESC) WHERE resolved_at IS NULL;

INSERT INTO commerce_products (
  id,
  name,
  sku,
  slug,
  status,
  description,
  selling_price_cents,
  currency,
  active
) VALUES (
  'hs-43-solar-power-bank',
  'SideKick PowerBank',
  'AE-HS43-001',
  'sidekick',
  'active',
  'Portable solar power bank sold at AdmiralEnergy.ai/sidekick.',
  6999,
  'USD',
  TRUE
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  slug = EXCLUDED.slug,
  selling_price_cents = EXCLUDED.selling_price_cents,
  currency = EXCLUDED.currency,
  active = EXCLUDED.active,
  updated_at = NOW();

INSERT INTO commerce_channel_connections (id, channel_key, display_name, status, capabilities)
VALUES (
  'channel-stripe',
  'stripe',
  'Stripe',
  'not_configured',
  '{"payments": true, "refunds": true, "historical_sync": true}'::JSONB
) ON CONFLICT (channel_key) DO NOTHING;
