import { NextResponse } from "next/server";
import { getCommerceAdmin, isSameOriginRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { adjustInventory } from "@/lib/commerce/repository";
import { inventoryAdjustmentSchema } from "@/lib/commerce/validation";

export async function POST(request: Request) {
  const admin = await getCommerceAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const parsed = inventoryAdjustmentSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?error=invalid"), 303);
  try {
    await adjustInventory(parsed.data, admin.email);
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?saved=adjustment"), 303);
  } catch {
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?error=save"), 303);
  }
}
