import { getCommerceAdmin } from "@/lib/commerce/auth";
import { createCsv, csvResponse, decimalDollars } from "@/lib/commerce/csv";
import { getLotExportRows } from "@/lib/commerce/repository";

export async function GET() {
  if (!(await getCommerceAdmin())) return new Response("Unauthorized", { status: 401 });
  const rows = await getLotExportRows();
  return csvResponse(`admiral-purchase-lots-${new Date().toISOString().slice(0, 10)}.csv`, createCsv([
    { header: "Lot ID", value: (r) => r.id }, { header: "Reference", value: (r) => r.reference }, { header: "Product", value: (r) => r.product },
    { header: "SKU", value: (r) => r.sku }, { header: "Supplier", value: (r) => r.supplier }, { header: "Supplier Platform", value: (r) => r.supplier_platform },
    { header: "Supplier Order Number", value: (r) => r.supplier_order_number }, { header: "Purchase Date (UTC)", value: (r) => r.purchased_at },
    { header: "Received Date (UTC)", value: (r) => r.received_at }, { header: "Quantity Purchased", value: (r) => r.quantity_purchased },
    { header: "Quantity Received", value: (r) => r.quantity_received }, { header: "Quantity Remaining", value: (r) => r.quantity_remaining },
    { header: "Unit Purchase Price USD", value: (r) => decimalDollars(r.unit_purchase_cost_cents) }, { header: "Inbound Shipping USD", value: (r) => decimalDollars(r.inbound_shipping_cents) },
    { header: "Duties/Fees USD", value: (r) => decimalDollars(r.duty_and_fees_cents) }, { header: "Other Landed Costs USD", value: (r) => decimalDollars(r.other_landed_costs_cents) },
    { header: "Landed Unit Cost USD", value: (r) => decimalDollars(r.landed_unit_cost_cents) }, { header: "Fulfillment Strategy", value: (r) => r.fulfillment_strategy },
    { header: "Location", value: (r) => r.location }, { header: "Notes", value: (r) => r.notes },
  ], rows));
}
