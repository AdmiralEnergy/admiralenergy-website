import { Alert, Card, DatabaseUnavailable, PageHeader, buttonClass, fieldClass } from "@/components/commerce/AdminUI";
import { listInventory, listSuppliers } from "@/lib/commerce/repository";

export const dynamic = "force-dynamic";

const today = new Date().toISOString().slice(0, 10);

export default async function NewManualOrderPage({ searchParams }: {
  searchParams: Promise<{
    error?: string;
    unmatchedId?: string;
    externalOrderId?: string;
    externalPaymentId?: string;
    customerEmail?: string;
  }>;
}) {
  const params = await searchParams;
  const data = await Promise.all([listInventory(), listSuppliers()]).catch(() => null);
  if (!data) return <><PageHeader title="Add manual order" /><DatabaseUnavailable /></>;
  const [{ products, lots }, suppliers] = data;
  return (
      <>
        <PageHeader title="Add manual order" description="Record Marketplace, local/D2D, cash, wholesale, or another owner-entered sale. Dollar fields are converted to integer cents on the server." />
        <div className="mb-5 space-y-3">{params.unmatchedId && <Alert tone="warning">You are assigning an unmatched Stripe payment. Choose the real product, quantity, source, and cost facts; the payment amount is intentionally not used to guess them.</Alert>}{params.error && <Alert tone="error">The order was not saved. Review required values and cost/fulfillment details, then try again.</Alert>}</div>
        <form action="/api/admin/commerce/orders" method="post" className="grid gap-6 xl:grid-cols-2">
          <input type="hidden" name="unmatchedTransactionId" value={params.unmatchedId ?? ""} />
          <Card className="p-5"><h2 className="text-lg font-extrabold text-[#0c2f4a]">Sale</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Sales source<select name="sourceChannel" className={`${fieldClass} mt-1`} required><option value="facebook_marketplace">Facebook Marketplace</option><option value="d2d_local">D2D / local</option><option value="manual">Manual</option><option value="wholesale">Wholesale</option><option value="marketplace">Other marketplace</option><option value="other">Other</option></select></label>
            <label className="text-sm font-bold">Sale date<input name="orderedAt" type="date" defaultValue={today} className={`${fieldClass} mt-1`} required /></label>
            <label className="text-sm font-bold">Product<select name="productId" className={`${fieldClass} mt-1`} required>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.sku}</option>)}</select></label>
            <label className="text-sm font-bold">Quantity<input name="quantity" type="number" min="1" max="10000" defaultValue="1" className={`${fieldClass} mt-1`} required /></label>
            <label className="text-sm font-bold">Unit sale price ($)<input name="unitPrice" inputMode="decimal" defaultValue={products[0] ? (products[0].selling_price_cents / 100).toFixed(2) : "0.00"} className={`${fieldClass} mt-1`} required /></label>
            <label className="text-sm font-bold">Discount ($)<input name="discount" inputMode="decimal" defaultValue="0.00" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Shipping charged ($)<input name="shippingRevenue" inputMode="decimal" defaultValue="0.00" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Sales tax ($)<input name="tax" inputMode="decimal" defaultValue="0.00" className={`${fieldClass} mt-1`} /></label>
          </div></Card>

          <Card className="p-5"><h2 className="text-lg font-extrabold text-[#0c2f4a]">Payment & source</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Payment status<select name="paymentStatus" className={`${fieldClass} mt-1`}><option value="paid">Paid</option><option value="pending">Pending</option><option value="unpaid">Unpaid</option></select></label>
            <label className="text-sm font-bold">Payment provider<select name="paymentProvider" defaultValue={params.unmatchedId ? "stripe" : "cash"} className={`${fieldClass} mt-1`}><option value="cash">Cash</option><option value="stripe">Stripe</option><option value="external_marketplace">External marketplace</option><option value="other">Other</option><option value="unpaid">Unpaid</option></select></label>
            <label className="text-sm font-bold">External order / session ID<input name="externalOrderId" defaultValue={params.externalOrderId ?? ""} className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">External payment ID<input name="externalPaymentId" defaultValue={params.externalPaymentId ?? ""} className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold sm:col-span-2">Acquisition source<input name="acquisitionChannel" placeholder="Example: Facebook group, referral, Google" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Processor fee ($)<input name="processorFee" inputMode="decimal" defaultValue="0.00" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Channel/platform fee ($)<input name="channelFee" inputMode="decimal" defaultValue="0.00" className={`${fieldClass} mt-1`} /></label>
          </div></Card>

          <Card className="p-5"><h2 className="text-lg font-extrabold text-[#0c2f4a]">Fulfillment & cost</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Fulfillment method<select name="fulfillmentMethod" className={`${fieldClass} mt-1`}><option value="admiral_inventory">Admiral inventory</option><option value="local_pickup">Local pickup</option><option value="dropship">Dropship</option><option value="third_party_fulfillment">Third-party fulfillment</option></select></label>
            <label className="text-sm font-bold">Inventory lot<select name="inventoryLotId" className={`${fieldClass} mt-1`}><option value="">Automatic FIFO</option>{lots.filter((lot) => Number(lot.quantity_remaining) > 0).map((lot) => <option key={String(lot.id)} value={String(lot.id)}>{String(lot.product_name)} · {String(lot.reference || lot.supplier_order_number || lot.id)} · {String(lot.quantity_remaining)} left</option>)}</select></label>
            <label className="text-sm font-bold">Supplier<select name="supplierId" className={`${fieldClass} mt-1`}><option value="">None / not recorded</option>{suppliers.map((supplier) => <option key={String(supplier.id)} value={String(supplier.id)}>{String(supplier.name)}</option>)}</select></label>
            <label className="text-sm font-bold">Supplier order reference<input name="supplierOrderReference" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Supplier purchase date<input name="supplierPurchasedAt" type="date" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Supplier tracking<input name="supplierTrackingNumber" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Dropship unit cost ($)<input name="supplierUnitCost" inputMode="decimal" placeholder="Required for dropship" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Supplier shipping ($)<input name="supplierShippingCost" inputMode="decimal" defaultValue="0.00" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Customer shipping expense ($)<input name="outboundShippingCost" inputMode="decimal" defaultValue="0.00" className={`${fieldClass} mt-1`} /></label>
            <label className="text-sm font-bold">Packaging / fulfillment ($)<input name="packagingFulfillmentCost" inputMode="decimal" defaultValue="0.00" className={`${fieldClass} mt-1`} /></label>
          </div><p className="mt-4 text-xs leading-5 text-slate-500">Stocked orders consume the selected lot or use FIFO. If stock cost is unavailable, the order is saved with a visible missing-COGS warning—no cost is invented.</p></Card>

          <Card className="p-5"><h2 className="text-lg font-extrabold text-[#0c2f4a]">Customer & shipping</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">Customer name<input name="customerName" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Email<input name="customerEmail" type="email" defaultValue={params.customerEmail ?? ""} className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Phone<input name="customerPhone" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Address line 1<input name="shippingAddressLine1" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Address line 2<input name="shippingAddressLine2" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">City<input name="shippingCity" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">State<input name="shippingState" maxLength={2} className={`${fieldClass} mt-1 uppercase`} /></label><label className="text-sm font-bold">ZIP code<input name="shippingPostalCode" inputMode="numeric" className={`${fieldClass} mt-1`} /></label><input type="hidden" name="shippingCountry" value="US" />
          </div></Card>

          <Card className="p-5 xl:col-span-2"><h2 className="text-lg font-extrabold text-[#0c2f4a]">Attribution & notes</h2><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><label className="text-sm font-bold">UTM source<input name="utmSource" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">UTM medium<input name="utmMedium" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">UTM campaign<input name="utmCampaign" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold">Promo code<input name="promoCode" className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold lg:col-span-4">Delivery notes<textarea name="deliveryNotes" rows={2} className={`${fieldClass} mt-1`} /></label><label className="text-sm font-bold lg:col-span-4">Order notes<textarea name="notes" rows={3} className={`${fieldClass} mt-1`} /></label></div></Card>
          <div className="xl:col-span-2"><button className={buttonClass} type="submit" disabled={!products.length}>Create manual order</button></div>
        </form>
      </>
  );
}
