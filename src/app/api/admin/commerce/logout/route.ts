import { NextResponse } from "next/server";
import { isSameOriginRequest, isSecureRequest, requestSiteUrl } from "@/lib/commerce/auth";
import { COMMERCE_SESSION_COOKIE } from "@/lib/commerce/session";

export async function POST(request: Request) {
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const response = NextResponse.redirect(requestSiteUrl(request, "/admin/commerce/login"), 303);
  response.cookies.set(COMMERCE_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: isSecureRequest(request),
    path: "/",
    expires: new Date(0),
  });
  return response;
}
