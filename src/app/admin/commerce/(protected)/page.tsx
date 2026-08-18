import Link from "next/link";
import { Alert, Card, DatabaseUnavailable, PageHeader, StatusBadge, secondaryButtonClass } from "@/components/commerce/AdminUI";
import { formatBusinessDate, resolveDashboardPeriod } from "@/lib/commerce/dates";
import { formatCurrency, marginPercent } from "@/lib/commerce/finance";
import {
  getChannelPerformance,
  getDashboardMetrics,
  getDashboardTrend,
  getDataQualityWarnings,
  getRecentOrders,
  listProducts,
} from "@/lib/commerce/repository";

export const dynamic = "force-dynamic";

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#0c2f4a]">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  );
}

export default async function CommerceOverviewPage({ searchParams }: {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}) {
  const period = resolveDashboardPeriod(await searchParams);
  const data = await Promise.all([
      getDashboardMetrics(period.range),
      getDashboardTrend(period.range),
      getChannelPerformance(period.range),
      getDataQualityWarnings(),
      getRecentOrders(),
      listProducts(),
    ]).catch(() => null);
  if (!data) return <><PageHeader title="Commerce overview" description="Internal sales, inventory, costs, and fulfillment." /><DatabaseUnavailable /></>;
  const [metrics, trend, channels, warnings, orders, products] = data;
    const grossMargin = marginPercent(metrics.gross_profit_cents, metrics.net_revenue_cents);
    const contributionMargin = marginPercent(metrics.contribution_profit_cents, metrics.net_revenue_cents + metrics.shipping_revenue_cents);
    const inventoryUnits = products.reduce((sum, product) => sum + product.inventory_on_hand, 0);
    const inventoryValue = products.reduce((sum, product) => sum + product.inventory_value_cents, 0);
    const maxTrend = Math.max(1, ...trend.map((point) => Math.max(point.net_sales_cents, 0)));
  return (
      <>
        <PageHeader
          eyebrow="Owner dashboard"
          title="Commerce overview"
          description={`${period.label}. Operational metrics only; taxes remain separate from revenue and this is not a substitute for bookkeeping.`}
          actions={<><Link href="/admin/commerce/orders/new" className={secondaryButtonClass}>Add manual order</Link><Link href="/admin/commerce/inventory#add-lot" className={secondaryButtonClass}>Add purchase lot</Link></>}
        />

        <form className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="text-sm font-bold text-slate-700">Period
            <select name="period" defaultValue={period.period} className="ml-2 min-h-11 rounded-lg border border-slate-300 bg-white px-3">
              <option value="today">Today</option><option value="7">7 days</option><option value="30">30 days</option><option value="ytd">Year to date</option><option value="all">All time</option><option value="custom">Custom</option>
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700">From <input type="date" name="from" defaultValue={period.from} className="ml-1 min-h-11 rounded-lg border border-slate-300 px-2" /></label>
          <label className="text-sm font-bold text-slate-700">To <input type="date" name="to" defaultValue={period.to} className="ml-1 min-h-11 rounded-lg border border-slate-300 px-2" /></label>
          <button className="min-h-11 rounded-lg bg-[#0c2f4a] px-4 text-sm font-bold text-white">Apply</button>
        </form>

        {(warnings.missing_cost_orders > 0 || warnings.unmatched_transactions > 0 || warnings.awaiting_fulfillment > 0 || warnings.low_stock_products > 0) && (
          <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {warnings.missing_cost_orders > 0 && <Alert tone="warning"><strong>{warnings.missing_cost_orders}</strong> order(s) missing COGS.</Alert>}
            {warnings.unmatched_transactions > 0 && <Alert tone="warning"><strong>{warnings.unmatched_transactions}</strong> Stripe transaction(s) need product assignment.</Alert>}
            {warnings.awaiting_fulfillment > 0 && <Alert tone="info"><strong>{warnings.awaiting_fulfillment}</strong> paid order(s) await fulfillment.</Alert>}
            {warnings.low_stock_products > 0 && <Alert tone="warning"><strong>{warnings.low_stock_products}</strong> product(s) at or below threshold.</Alert>}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Gross product sales" value={formatCurrency(metrics.gross_product_sales_cents)} hint="Before discounts and refunds; excludes tax and shipping." />
          <Metric label="Net product sales" value={formatCurrency(metrics.net_revenue_cents)} hint={`${formatCurrency(metrics.discount_cents)} discounts · ${formatCurrency(metrics.refund_total_cents)} refunds`} />
          <Metric label="Gross profit" value={formatCurrency(metrics.gross_profit_cents)} hint={grossMargin === null ? "Margin unavailable" : `${grossMargin.toFixed(1)}% gross margin`} />
          <Metric label="Contribution profit" value={formatCurrency(metrics.contribution_profit_cents)} hint={contributionMargin === null ? "Margin unavailable" : `${contributionMargin.toFixed(1)}% contribution margin`} />
          <Metric label="Customer payments" value={formatCurrency(metrics.gross_revenue_cents)} hint={`${formatCurrency(metrics.shipping_revenue_cents)} shipping · ${formatCurrency(metrics.tax_cents)} tax`} />
          <Metric label="Product COGS" value={formatCurrency(metrics.product_cogs_cents)} hint={`${metrics.missing_cost_order_count} order(s) incomplete`} />
          <Metric label="Fees & fulfillment" value={formatCurrency(metrics.processor_fee_cents + metrics.channel_fee_cents + metrics.shipping_cost_cents + metrics.packaging_cost_cents)} hint="Payment, channel, outbound shipping, and packaging." />
          <Metric label="Orders / units" value={`${metrics.order_count} / ${metrics.units_sold}`} hint={`${metrics.unique_customer_count} unique customer email(s)`} />
          <Metric label="Inventory on hand" value={`${inventoryUnits} units`} hint={`${formatCurrency(inventoryValue)} value from costed lots`} />
          <Metric label="Average order value" value={formatCurrency(metrics.order_count ? Math.round(metrics.gross_revenue_cents / metrics.order_count) : 0)} hint="Total customer payments divided by orders." />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <Card className="p-5">
            <h2 className="font-extrabold text-[#0c2f4a]">Net sales trend</h2>
            {trend.length === 0 ? <p className="mt-4 text-sm text-slate-500">No paid sales in this period.</p> : (
              <div className="mt-5 flex h-48 items-end gap-1 border-b border-slate-200" role="img" aria-label="Net product sales by day">
                {trend.map((point) => (
                  <div key={point.day} className="group relative flex min-w-1 flex-1 items-end" style={{ height: "100%" }} title={`${formatBusinessDate(point.day)}: ${formatCurrency(point.net_sales_cents)} net sales; ${formatCurrency(point.contribution_profit_cents)} contribution profit`}>
                    <div className="w-full rounded-t bg-[#0c2f4a]" style={{ height: `${Math.max(3, (point.net_sales_cents / maxTrend) * 100)}%` }} />
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 p-5"><h2 className="font-extrabold text-[#0c2f4a]">Channel performance</h2><p className="mt-1 text-xs text-slate-500">Compare contribution, not revenue alone.</p></div>
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Source</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3">Net sales</th><th className="px-4 py-3">Contribution</th></tr></thead><tbody>
              {channels.length ? channels.map((channel) => <tr key={String(channel.source_channel)} className="border-t border-slate-100"><td className="px-4 py-3 font-bold capitalize">{String(channel.source_channel).replaceAll("_", " ")}</td><td className="px-4 py-3">{String(channel.orders)}</td><td className="px-4 py-3">{formatCurrency(Number(channel.net_sales_cents))}</td><td className="px-4 py-3 font-bold">{formatCurrency(Number(channel.contribution_profit_cents))}</td></tr>) : <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Channel results appear after the first paid order.</td></tr>}
            </tbody></table></div>
          </Card>
        </div>

        <Card className="mt-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 p-5"><h2 className="font-extrabold text-[#0c2f4a]">Recent orders</h2><Link href="/admin/commerce/orders" className="text-sm font-bold text-[#0c2f4a] underline">View all</Link></div>
          <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Source</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Fulfillment</th></tr></thead><tbody>
            {orders.length ? orders.map((order) => <tr key={order.id} className="border-t border-slate-100"><td className="px-4 py-3"><Link href={`/admin/commerce/orders/${order.id}`} className="font-bold text-[#0c2f4a] underline">{order.order_number}</Link></td><td className="whitespace-nowrap px-4 py-3">{formatBusinessDate(order.ordered_at)}</td><td className="px-4 py-3">{order.customer_name || order.customer_email || "—"}</td><td className="px-4 py-3 capitalize">{order.source_channel.replaceAll("_", " ")}</td><td className="px-4 py-3 font-bold">{formatCurrency(order.total_cents)}</td><td className="px-4 py-3"><StatusBadge value={order.payment_status} /></td><td className="px-4 py-3"><StatusBadge value={order.fulfillment_status} /></td></tr>) : <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No orders yet. Sync Stripe or add a manual order.</td></tr>}
          </tbody></table></div>
        </Card>
      </>
  );
}
