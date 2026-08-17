import Link from "next/link";
import { Alert, Card, DatabaseUnavailable, PageHeader, StatusBadge, buttonClass, fieldClass, secondaryButtonClass } from "@/components/commerce/AdminUI";
import { channelCatalog } from "@/lib/commerce/channels";
import { formatBusinessDate } from "@/lib/commerce/dates";
import { formatCurrency } from "@/lib/commerce/finance";
import { listChannels } from "@/lib/commerce/repository";

export const dynamic = "force-dynamic";

export default async function ChannelsPage({ searchParams }: { searchParams: Promise<{ synced?: string; error?: string; truncated?: string }> }) {
  const notice = await searchParams;
  const data = await listChannels().catch(() => null);
  if (!data) return <><PageHeader title="Channels" /><DatabaseUnavailable /></>;
    const persistedStripe = data.channels.find((channel) => channel.channel_key === "stripe");
  return (
      <>
        <PageHeader title="Channels" description="Stripe and manual entry work today. Future commerce APIs plug into the shared adapter seam without changing the order model." />
        <div className="mb-5 space-y-3">{notice.synced && <Alert tone="success">Stripe reconciliation completed. Existing orders, fees, refunds, and new successful sessions were checked idempotently.</Alert>}{notice.truncated && <Alert tone="warning">The safety limit was reached. Run a narrower period or repeat the sync to continue reviewing historical sessions.</Alert>}{notice.error === "config" && <Alert tone="warning">Stripe is not configured in this environment. Existing commerce data remains accessible.</Alert>}{notice.error === "sync" && <Alert tone="error">Stripe sync is temporarily unavailable. Existing commerce data is still accessible.</Alert>}</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{channelCatalog.map((channel) => {
          const status = channel.key === "stripe" && persistedStripe?.status === "error" ? "error" : channel.status;
          return <Card key={channel.key} className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="font-extrabold text-[#0c2f4a]">{channel.label}</h2><StatusBadge value={status} /></div><p className="mt-3 text-sm leading-6 text-slate-600">{channel.message}</p>{channel.key === "stripe" && Boolean(persistedStripe?.last_synced_at) && <p className="mt-3 text-xs font-bold text-slate-500">Last synchronized {formatBusinessDate(String(persistedStripe?.last_synced_at), true)}</p>}</Card>;
        })}</div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-5"><h2 className="text-lg font-extrabold text-[#0c2f4a]">Sync Stripe</h2><p className="mt-2 text-sm leading-6 text-slate-600">Protected, on-demand reconciliation checks successful Checkout Sessions, real Stripe fees, and succeeded refunds. It never creates a test charge and never matches products by amount.</p><form action="/api/admin/commerce/stripe/sync" method="post" className="mt-5 space-y-4"><label className="block text-sm font-bold">Period<select name="days" defaultValue="90" className={`${fieldClass} mt-1`}><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last year</option><option value="all">All available history (max 500 per run)</option></select></label><button className={buttonClass}>Sync Stripe now</button></form><p className="mt-4 text-xs leading-5 text-slate-500">Webhook-first, manual reconciliation second. No continuous browser polling or speculative platform integration.</p></Card>
          <Card className="overflow-hidden"><div className="border-b border-slate-200 p-5"><h2 className="text-lg font-extrabold text-[#0c2f4a]">Transactions needing product assignment</h2><p className="mt-1 text-xs text-slate-500">An unmatched record is safer than assigning the wrong product or COGS.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Stripe session</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Action</th></tr></thead><tbody>{data.unmatched.length ? data.unmatched.map((row) => {
            const query = new URLSearchParams({ unmatchedId: String(row.id), externalOrderId: String(row.external_id) });
            if (row.external_payment_id) query.set("externalPaymentId", String(row.external_payment_id));
            if (row.customer_email) query.set("customerEmail", String(row.customer_email));
            return <tr key={String(row.id)} className="border-t border-slate-100"><td className="px-4 py-3 whitespace-nowrap">{formatBusinessDate(String(row.occurred_at))}</td><td className="max-w-48 break-all px-4 py-3 font-mono text-xs">{String(row.external_id)}</td><td className="px-4 py-3">{String(row.customer_email || "—")}</td><td className="px-4 py-3 font-bold">{formatCurrency(Number(row.amount_cents), String(row.currency))}</td><td className="px-4 py-3">{String(row.reason)}</td><td className="px-4 py-3"><Link href={`/admin/commerce/orders/new?${query}`} className={secondaryButtonClass}>Assign</Link></td></tr>;
          }) : <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">No unmatched Stripe transactions.</td></tr>}</tbody></table></div></Card>
        </div>

        <Card className="mt-6 overflow-hidden"><div className="border-b border-slate-200 p-5"><h2 className="font-extrabold text-[#0c2f4a]">Recent sync runs</h2></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Started</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Imported</th><th className="px-4 py-3">Already present / skipped</th><th className="px-4 py-3">Unmatched</th></tr></thead><tbody>{data.syncRuns.length ? data.syncRuns.map((run) => <tr key={String(run.id)} className="border-t border-slate-100"><td className="px-4 py-3">{formatBusinessDate(String(run.started_at), true)}</td><td className="px-4 py-3"><StatusBadge value={String(run.status)} /></td><td className="px-4 py-3">{String(run.imported_count)}</td><td className="px-4 py-3">{String(run.skipped_count)}</td><td className="px-4 py-3">{String(run.unmatched_count)}</td></tr>) : <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No manual sync has run yet.</td></tr>}</tbody></table></div></Card>
      </>
  );
}
