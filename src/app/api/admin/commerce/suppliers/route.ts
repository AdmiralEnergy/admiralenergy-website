import { NextResponse } from "next/server";
import { getCommerceAdmin, isSameOriginRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { createSupplier } from "@/lib/commerce/repository";
import { supplierSchema } from "@/lib/commerce/validation";

export async function POST(request: Request) {
  if (!(await getCommerceAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const parsed = supplierSchema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?error=supplier"), 303);
  try {
    await createSupplier(parsed.data);
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?saved=supplier"), 303);
  } catch {
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/inventory?error=supplier"), 303);
  }
}
