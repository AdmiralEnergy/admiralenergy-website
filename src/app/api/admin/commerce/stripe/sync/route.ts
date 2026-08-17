import { NextResponse } from "next/server";
import { getCommerceAdmin, isSameOriginRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { synchronizeStripeOrders } from "@/lib/commerce/stripe-sync";

export const maxDuration = 60;

export async function POST(request: Request) {
  const admin = await getCommerceAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const form = await request.formData();
  const value = String(form.get("days") ?? "90");
  const days = value === "all" ? "all" : value === "30" ? 30 : value === "365" ? 365 : 90;
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/channels?error=config"), 303);
  try {
    const result = await synchronizeStripeOrders({ initiatedBy: admin.email, days });
    const suffix = result.truncated ? "&truncated=1" : "";
    return NextResponse.redirect(requestSiteUrl(request, `/admin/commerce/channels?synced=1${suffix}`), 303);
  } catch {
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/channels?error=sync"), 303);
  }
}
