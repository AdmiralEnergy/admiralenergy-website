import { getCommerceAdmin } from "@/lib/commerce/auth";
import { createCsv, csvResponse, decimalDollars } from "@/lib/commerce/csv";
import { getInventoryExportRows } from "@/lib/commerce/repository";

export async function GET() {
  if (!(await getCommerceAdmin())) return new Response("Unauthorized", { status: 401 });
  const rows = await getInventoryExportRows();
  return csvResponse(`admiral-inventory-${new Date().toISOString().slice(0, 10)}.csv`, createCsv([
    { header: "Product", value: (r) => r.product }, { header: "SKU", value: (r) => r.sku }, { header: "Status", value: (r) => r.status },
    { header: "Selling Price USD", value: (r) => decimalDollars(r.selling_price_cents) }, { header: "On Hand", value: (r) => r.on_hand },
    { header: "Available", value: (r) => r.available }, { header: "Low Stock Threshold", value: (r) => r.low_stock_threshold },
    { header: "Inventory Value USD", value: (r) => decimalDollars(r.inventory_value_cents) },
  ], rows));
}
