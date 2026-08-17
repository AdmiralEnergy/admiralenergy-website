import { NextResponse } from "next/server";
import { getCommerceAdmin, isSameOriginRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { overrideOrderItemCost } from "@/lib/commerce/repository";
import { costAdjustmentSchema } from "@/lib/commerce/validation";

function dollarsToCents(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  if (!/^\d{1,9}(?:\.\d{1,2})?$/.test(normalized)) return Number.NaN;
  const [whole, fraction = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCommerceAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const { id } = await params;
  const form = await request.formData();
  const parsed = costAdjustmentSchema.safeParse({
    ...Object.fromEntries(form),
    cogsCents: dollarsToCents(form.get("cogs")),
  });
  if (!parsed.success) return NextResponse.redirect(requestSiteUrl(request, `/admin/commerce/orders/${id}?error=cost`), 303);
  try {
    await overrideOrderItemCost({ orderId: id, ...parsed.data, createdBy: admin.email });
    return NextResponse.redirect(requestSiteUrl(request, `/admin/commerce/orders/${id}?cost=updated`), 303);
  } catch (error) {
    console.error("[commerce] COGS correction failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.redirect(requestSiteUrl(request, `/admin/commerce/orders/${id}?error=cost`), 303);
  }
}
