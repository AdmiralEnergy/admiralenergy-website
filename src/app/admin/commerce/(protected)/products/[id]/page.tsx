import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, DatabaseUnavailable, PageHeader, StatusBadge } from "@/components/commerce/AdminUI";
import { formatBusinessDate } from "@/lib/commerce/dates";
import { formatCurrency, marginPercent } from "@/lib/commerce/finance";
import { getProduct } from "@/lib/commerce/repository";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProduct(id).catch(() => undefined);
  if (data === undefined) return <><PageHeader title="Product detail" /><DatabaseUnavailable /></>;
  if (!data) notFound();
    const p = data.product;
    const performance = data.performance ?? {};
    const netSales = Number(performance.net_sales_cents ?? 0);
    const unitsSold = Number(performance.units_sold ?? 0);
    const margin = marginPercent(Number(performance.gross_profit_cents ?? 0), netSales);
    const suppliers = new Set(data.lots.map((lot) => String(lot.supplier_name || "")).filter(Boolean));
  return (
      <>
        <PageHeader eyebrow={p.sku} title={p.name} description={p.description ?? "Internal commerce performance and inventory."} actions={<StatusBadge value={p.status} />} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Selling price" value={formatCurrency(p.selling_price_cents, p.currency)} /><Metric label="Current / available stock" value={`${p.inventory_on_hand} / ${p.inventory_on_hand}`} /><Metric label="Inventory value" value={formatCurrency(p.inventory_value_cents)} /><Metric label="Units sold" value={String(unitsSold)} /><Metric label="Gross sales" value={formatCurrency(Number(performance.gross_sales_cents ?? 0))} /><Metric label="Net sales" value={formatCurrency(netSales)} /><Metric label="Average realized price" value={formatCurrency(unitsSold ? Math.round(netSales / unitsSold) : 0)} /><Metric label="Product COGS" value={formatCurrency(Number(performance.product_cogs_cents ?? 0))} /><Metric label="Gross profit" value={formatCurrency(Number(performance.gross_profit_cents ?? 0))} hint={margin === null ? "Margin unavailable" : `${margin.toFixed(1)}% margin`} /><Metric label="Contribution profit" value={formatCurrency(Number(performance.contribution_profit_cents ?? 0))} /><Metric label="Current suppliers" value={String(suppliers.size)} /></div>
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <Card className="overflow-hidden"><div className="border-b border-slate-200 p-5"><h2 className="font-extrabold text-[#0c2f4a]">Recent purchase lots</h2></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Lot</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Remaining</th><th className="px-4 py-3">Landed unit</th></tr></thead><tbody>{data.lots.length ? data.lots.slice(0, 10).map((lot) => <tr key={String(lot.id)} className="border-t border-slate-100"><td className="px-4 py-3">{String(lot.reference || lot.supplier_order_number || lot.id)}<br /><span className="text-xs text-slate-500">{formatBusinessDate(String(lot.received_at))}</span></td><td className="px-4 py-3">{String(lot.supplier_name || "Not recorded")}</td><td className="px-4 py-3 font-bold">{String(lot.quantity_remaining)}</td><td className="px-4 py-3">{formatCurrency(Number(lot.landed_unit_cost_cents))}</td></tr>) : <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">No purchase lots recorded.</td></tr>}</tbody></table></div></Card>
          <Card className="overflow-hidden"><div className="border-b border-slate-200 p-5"><h2 className="font-extrabold text-[#0c2f4a]">Channel breakdown</h2></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Source</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3">Units</th><th className="px-4 py-3">Sales</th></tr></thead><tbody>{data.channelPerformance.length ? data.channelPerformance.map((row) => <tr key={String(row.source_channel)} className="border-t border-slate-100"><td className="px-4 py-3 font-bold capitalize">{String(row.source_channel).replaceAll("_", " ")}</td><td className="px-4 py-3">{String(row.orders)}</td><td className="px-4 py-3">{String(row.units)}</td><td className="px-4 py-3">{formatCurrency(Number(row.sales_cents))}</td></tr>) : <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">No channel sales yet.</td></tr>}</tbody></table></div></Card>
        </div>
        <Card className="mt-6 overflow-hidden"><div className="border-b border-slate-200 p-5"><h2 className="font-extrabold text-[#0c2f4a]">Recent orders</h2></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Contribution</th></tr></thead><tbody>{data.recentOrders.length ? data.recentOrders.map((order) => <tr key={String(order.id)} className="border-t border-slate-100"><td className="px-4 py-3"><Link href={`/admin/commerce/orders/${String(order.id)}`} className="font-bold text-[#0c2f4a] underline">{String(order.order_number)}</Link></td><td className="px-4 py-3">{formatBusinessDate(String(order.ordered_at))}</td><td className="px-4 py-3 capitalize">{String(order.source_channel).replaceAll("_", " ")}</td><td className="px-4 py-3">{formatCurrency(Number(order.total_cents))}</td><td className="px-4 py-3">{formatCurrency(Number(order.contribution_profit_cents))}</td></tr>) : <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No orders yet.</td></tr>}</tbody></table></div></Card>
      </>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) { return <Card className="p-4"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-2 text-xl font-extrabold text-[#0c2f4a]">{value}</p>{hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}</Card>; }
