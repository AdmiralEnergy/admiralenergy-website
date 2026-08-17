import Link from "next/link";
import { Alert, Card, DatabaseUnavailable, PageHeader, StatusBadge, buttonClass, fieldClass } from "@/components/commerce/AdminUI";
import { formatCurrency } from "@/lib/commerce/finance";
import { listProducts } from "@/lib/commerce/repository";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const notice = await searchParams;
  const products = await listProducts().catch(() => null);
  if (!products) return <><PageHeader title="Products" /><DatabaseUnavailable /></>;
  return (
      <>
        <PageHeader title="Products" description="Internal commerce products share one extensible operational model. Adding a record here does not publish a public storefront page or Product schema." />
        <div className="mb-5 space-y-3">{notice.saved && <Alert tone="success">Internal product created.</Alert>}{notice.error && <Alert tone="error">The product was not created. Confirm that the ID, slug, and SKU are unique.</Alert>}</div>
        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">On hand</th><th className="px-4 py-3">Value</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t border-slate-100"><td className="px-4 py-3"><Link href={`/admin/commerce/products/${product.id}`} className="font-extrabold text-[#0c2f4a] underline">{product.name}</Link><p className="mt-1 text-xs text-slate-500">{product.slug}</p></td><td className="px-4 py-3 font-mono text-xs">{product.sku}</td><td className="px-4 py-3 font-bold">{formatCurrency(product.selling_price_cents, product.currency)}</td><td className="px-4 py-3"><StatusBadge value={product.status} /></td><td className="px-4 py-3">{product.inventory_on_hand}</td><td className="px-4 py-3">{formatCurrency(product.inventory_value_cents)}</td></tr>)}</tbody></table></div></Card>
          <Card className="p-5"><h2 className="text-lg font-extrabold text-[#0c2f4a]">Add internal product</h2><p className="mt-1 text-sm leading-6 text-slate-600">Use only when a real product exists. New records default to an internal draft and never alter the public catalog automatically.</p><form action="/api/admin/commerce/products" method="post" className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold sm:col-span-2">Name<input name="name" className={`${fieldClass} mt-1`} required /></label><label className="text-sm font-bold">Internal ID<input name="id" placeholder="lowercase-id" className={`${fieldClass} mt-1`} required /></label><label className="text-sm font-bold">SKU<input name="sku" className={`${fieldClass} mt-1`} required /></label><label className="text-sm font-bold">Slug<input name="slug" placeholder="internal-slug" className={`${fieldClass} mt-1`} required /></label><label className="text-sm font-bold">Selling price ($)<input name="sellingPrice" inputMode="decimal" className={`${fieldClass} mt-1`} required /></label><label className="text-sm font-bold">Low-stock threshold<input name="lowStockThreshold" type="number" min="0" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Status<select name="status" defaultValue="draft" className={`${fieldClass} mt-1`}><option value="draft">Draft</option><option value="active">Active internally</option><option value="archived">Archived</option></select></label><input type="hidden" name="currency" value="USD" /><label className="text-sm font-bold sm:col-span-2">Description<textarea name="description" rows={3} className={`${fieldClass} mt-1`} /></label><div className="sm:col-span-2"><button className={buttonClass}>Create internal product</button></div></form></Card>
        </div>
      </>
  );
}
