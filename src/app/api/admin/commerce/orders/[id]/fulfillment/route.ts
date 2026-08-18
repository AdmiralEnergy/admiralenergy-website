import { NextResponse } from "next/server";
import { getCommerceAdmin, isSameOriginRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { updateFulfillment } from "@/lib/commerce/repository";
import { fulfillmentSchema } from "@/lib/commerce/validation";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCommerceAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const { id } = await params;
  const form = await request.formData();
  const supplierPurchasedAt = String(form.get("supplierPurchasedAt") ?? "");
  const parsed = fulfillmentSchema.safeParse({
    ...Object.fromEntries(form),
    supplierPurchasedAt: /^\d{4}-\d{2}-\d{2}$/.test(supplierPurchasedAt)
      ? new Date(`${supplierPurchasedAt}T12:00:00.000Z`)
      : supplierPurchasedAt,
    returnDisposition: form.get("returnDisposition") || null,
  });
  if (!parsed.success) return NextResponse.redirect(requestSiteUrl(request, `/admin/commerce/orders/${id}?error=invalid`), 303);
  try {
    await updateFulfillment(id, parsed.data);
    return NextResponse.redirect(requestSiteUrl(request, `/admin/commerce/orders/${id}?updated=1`), 303);
  } catch {
    return NextResponse.redirect(requestSiteUrl(request, `/admin/commerce/orders/${id}?error=save`), 303);
  }
}
