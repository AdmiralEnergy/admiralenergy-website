import { NextResponse } from "next/server";
import { getCommerceAdmin, isSameOriginRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { createProduct } from "@/lib/commerce/repository";
import { productSchema } from "@/lib/commerce/validation";

function cents(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  if (!/^\d{1,9}(?:\.\d{1,2})?$/.test(normalized)) return Number.NaN;
  const [whole, fraction = ""] = normalized.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export async function POST(request: Request) {
  if (!(await getCommerceAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const form = await request.formData();
  const parsed = productSchema.safeParse({ ...Object.fromEntries(form), sellingPriceCents: cents(form.get("sellingPrice")) });
  if (!parsed.success) return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/products?error=invalid"), 303);
  try {
    await createProduct(parsed.data);
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/products?saved=1"), 303);
  } catch {
    return NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/products?error=save"), 303);
  }
}
