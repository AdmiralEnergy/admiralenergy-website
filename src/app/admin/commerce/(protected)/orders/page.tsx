import Link from "next/link";
import { Card, DatabaseUnavailable, PageHeader, StatusBadge, buttonClass, fieldClass, secondaryButtonClass } from "@/components/commerce/AdminUI";
import { formatBusinessDate } from "@/lib/commerce/dates";
import { formatCurrency } from "@/lib/commerce/finance";
import { listOrders, listProducts } from "@/lib/commerce/repository";
import { orderFiltersSchema } from "@/lib/commerce/validation";

export const dynamic = "force-dynamic";

function pageUrl(params: Record<string, string | undefined>, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
  query.set("page", String(page));
  return `/admin/commerce/orders?${query}`;
}

export default async function OrdersPage({ searchParams }: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = orderFiltersSchema.safeParse(raw);
  const filters = parsed.success ? parsed.data : orderFiltersSchema.parse({});
  const data = await Promise.all([
      listOrders(filters),
      listProducts(),
    ]).catch(() => null);
  if (!data) return <><PageHeader title="Orders" /><DatabaseUnavailable /></>;
  const [{ orders, total, page, pageSize }, products] = data;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const exportQuery = new URLSearchParams();
    for (const [key, value] of Object.entries(raw)) if (value && key !== "page") exportQuery.set(key, value);
  return (
      <>
        <PageHeader title="Orders" description="All website, Marketplace, local, wholesale, and manually entered transactions in one operational view." actions={<><a href={`/api/admin/commerce/exports/orders?${exportQuery}`} className={secondaryButtonClass}>Export CSV</a><Link href="/admin/commerce/orders/new" className={buttonClass}>Add manual order</Link></>} />
        <Card className="mb-5 p-4">
          <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            <label className="text-xs font-bold uppercase text-slate-500 xl:col-span-2">Search<input name="q" defaultValue={filters.q} placeholder="Order, customer, Stripe ID" className={`${fieldClass} mt-1 normal-case`} /></label>
            <label className="text-xs font-bold uppercase text-slate-500">Source<select name="source" defaultValue={filters.source} className={`${fieldClass} mt-1 normal-case`}><option value="all">All sources</option><option value="website">Admiral website</option><option value="facebook_marketplace">Facebook Marketplace</option><option value="d2d_local">D2D / local</option><option value="manual">Manual</option><option value="wholesale">Wholesale</option><option value="other">Other</option></select></label>
            <label className="text-xs font-bold uppercase text-slate-500">Payment<select name="payment" defaultValue={filters.payment} className={`${fieldClass} mt-1 normal-case`}><option value="all">All</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="unpaid">Unpaid</option><option value="partially_refunded">Partially refunded</option><option value="refunded">Refunded</option><option value="failed">Failed</option><option value="canceled">Canceled</option></select></label>
            <label className="text-xs font-bold uppercase text-slate-500">Fulfillment<select name="fulfillment" defaultValue={filters.fulfillment} className={`${fieldClass} mt-1 normal-case`}><option value="all">All</option><option value="unfulfilled">Unfulfilled</option><option value="ready">Ready</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="returned">Returned</option><option value="canceled">Canceled</option></select></label>
            <label className="text-xs font-bold uppercase text-slate-500">Product<select name="product" defaultValue={filters.product} className={`${fieldClass} mt-1 normal-case`}><option value="all">All products</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
            <button className={`${buttonClass} self-end`}>Filter</button>
            <label className="text-xs font-bold uppercase text-slate-500">From<input type="date" name="from" defaultValue={filters.from} className={`${fieldClass} mt-1 normal-case`} /></label>
            <label className="text-xs font-bold uppercase text-slate-500">To<input type="date" name="to" defaultValue={filters.to} className={`${fieldClass} mt-1 normal-case`} /></label>
          </form>
        </Card>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Channel</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Fulfillment</th><th className="px-4 py-3">Contribution</th></tr></thead>
              <tbody>{orders.length ? orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-4 py-3"><Link href={`/admin/commerce/orders/${order.id}`} className="font-extrabold text-[#0c2f4a] underline">{order.order_number}</Link>{order.cost_status === "missing_cost" && <span className="ml-2 text-xs font-bold text-red-700">COGS?</span>}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatBusinessDate(order.ordered_at)}</td><td className="px-4 py-3">{order.customer_name || order.customer_email || "—"}</td><td className="px-4 py-3 capitalize">{order.source_channel.replaceAll("_", " ")}</td><td className="px-4 py-3">{order.products || "—"}</td><td className="px-4 py-3">{order.units ?? 0}</td><td className="px-4 py-3 font-bold">{formatCurrency(order.total_cents)}</td><td className="px-4 py-3"><StatusBadge value={order.payment_status} /></td><td className="px-4 py-3"><StatusBadge value={order.fulfillment_status} /></td><td className="px-4 py-3 font-bold">{formatCurrency(order.contribution_profit_cents)}</td>
                </tr>
              )) : <tr><td colSpan={10} className="px-4 py-14 text-center text-slate-500"><p className="font-bold text-slate-700">No matching orders</p><p className="mt-1">Adjust the filters, sync Stripe, or add a manual order.</p></td></tr>}</tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm"><p>{total} order(s) · Page {page} of {totalPages}</p><div className="flex gap-2">{page > 1 && <Link href={pageUrl(raw, page - 1)} className={secondaryButtonClass}>Previous</Link>}{page < totalPages && <Link href={pageUrl(raw, page + 1)} className={secondaryButtonClass}>Next</Link>}</div></div>
        </Card>
      </>
  );
}
