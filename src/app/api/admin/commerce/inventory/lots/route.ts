import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCommerceAdmin, isSameOriginRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { createInventoryLot } from "@/lib/commerce/repository";
import { inventoryLotSchema } from "@/lib/commerce/validation";

function cents(value: FormDataEntryValue | null) {
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
  const parsed = inventoryLotSchema.safeParse({
    ...Object.fromEntries(form),
    purchasedAt: form.get("purchasedAt") ? businessDate(form.get("purchasedAt")) : "",
    expectedArrivalAt: form.get("expectedArrivalAt") ? businessDate(form.get("expectedArrivalAt")) : "",
    receivedAt: businessDate(form.get("receivedAt")),
    unitPurchaseCostCents: cents(form.get("unitPurchaseCost")),
    inboundShippingCents: cents(form.get("inboundShipping")),
    dutyAndFeesCents: cents(form.get("dutyAndFees")),
    otherLandedCostsCents: cents(form.get("otherLandedCosts")),
  });
  if (!parsed.success) return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?error=invalid#add-lot"), 303);
  try {
    await createInventoryLot({ id: randomUUID(), ...parsed.data }, admin.email);
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?saved=lot"), 303);
  } catch {
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?error=save#add-lot"), 303);
  }
}
