import { NextResponse } from "next/server";
import { getCommerceAdmin, isSameOriginRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { createManualOrder } from "@/lib/commerce/repository";
import { manualOrderSchema } from "@/lib/commerce/validation";

function dollarsToCents(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "0").trim();
  if (!/^\d{1,9}(?:\.\d{1,2})?$/.test(normalized)) return Number.NaN;
  const [whole, fraction = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

function businessDate(value: FormDataEntryValue | null) {
  const date = String(value ?? "");
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00.000Z`) : value;
}

export async function POST(request: Request) {
  const admin = await getCommerceAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const form = await request.formData();
  const parsed = manualOrderSchema.safeParse({
    ...Object.fromEntries(form),
    orderedAt: businessDate(form.get("orderedAt")),
    supplierPurchasedAt: form.get("supplierPurchasedAt") ? businessDate(form.get("supplierPurchasedAt")) : "",
    unitPriceCents: dollarsToCents(form.get("unitPrice")),
    discountCents: dollarsToCents(form.get("discount")),
    shippingRevenueCents: dollarsToCents(form.get("shippingRevenue")),
    taxCents: dollarsToCents(form.get("tax")),
    processorFeeCents: dollarsToCents(form.get("processorFee")),
    channelFeeCents: dollarsToCents(form.get("channelFee")),
    outboundShippingCostCents: dollarsToCents(form.get("outboundShippingCost")),
    packagingFulfillmentCostCents: dollarsToCents(form.get("packagingFulfillmentCost")),
    supplierUnitCostCents: form.get("supplierUnitCost") ? dollarsToCents(form.get("supplierUnitCost")) : "",
    supplierShippingCostCents: dollarsToCents(form.get("supplierShippingCost")),
  });
  if (!parsed.success) return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/orders/new?error=invalid"), 303);
  try {
    const order = await createManualOrder(parsed.data, admin.email);
    return NextResponse.redirect(requestSiteUrl(request, `/admin/commerce/orders/${order.id}?created=1`), 303);
  } catch (error) {
    console.error("[commerce] Manual order creation failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/orders/new?error=save"), 303);
  }
}
