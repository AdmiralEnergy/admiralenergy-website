CREATE TABLE IF NOT EXISTS commerce_order_cost_adjustments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES commerce_orders(id) ON DELETE CASCADE,
  order_item_id TEXT NOT NULL REFERENCES commerce_order_items(id) ON DELETE CASCADE,
  previous_cogs_cents INTEGER CHECK (previous_cogs_cents IS NULL OR previous_cogs_cents >= 0),
  new_cogs_cents INTEGER NOT NULL CHECK (new_cogs_cents >= 0),
  reason TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS commerce_order_cost_adjustments_order_idx
  ON commerce_order_cost_adjustments(order_id, created_at DESC);

ALTER TABLE commerce_orders
  ADD COLUMN IF NOT EXISTS return_disposition TEXT
  CHECK (return_disposition IS NULL OR return_disposition IN ('not_returned', 'restocked', 'damaged', 'lost'));
