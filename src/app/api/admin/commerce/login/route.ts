import { NextResponse } from "next/server";
import {
  authenticateCommerceAdmin,
  isSameOriginRequest,
  issueCommerceSession,
  loginAttemptKey,
  isSecureRequest,
  requestSiteUrl,
  safeReturnPath,
} from "@/lib/commerce/auth";
import { COMMERCE_SESSION_COOKIE, COMMERCE_SESSION_MAX_AGE_SECONDS } from "@/lib/commerce/session";
import { checkLoginAllowed, clearFailedLogins, recordFailedLogin } from "@/lib/commerce/repository";
import { loginSchema } from "@/lib/commerce/validation";

export async function POST(request: Request) {
  if (!(await isSameOriginRequest(request))) return new NextResponse("Forbidden", { status: 403 });
  const formData = await request.formData();
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  const loginUrl = requestSiteUrl(request, "/admin/commerce/login");
  if (!parsed.success) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl, 303);
  }
  const returnTo = safeReturnPath(parsed.data.returnTo);
  loginUrl.searchParams.set("next", returnTo);
  const ip = request.headers.get("x-nf-client-connection-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
  const attemptKey = loginAttemptKey(parsed.data.email, ip);

  try {
    if (!(await checkLoginAllowed(attemptKey))) {
      loginUrl.searchParams.set("error", "locked");
      return NextResponse.redirect(loginUrl, 303);
    }
    const admin = await authenticateCommerceAdmin(parsed.data.email, parsed.data.password);
    if (!admin) {
      await recordFailedLogin(attemptKey);
      loginUrl.searchParams.set("error", "invalid");
      return NextResponse.redirect(loginUrl, 303);
    }
    await clearFailedLogins(attemptKey);
    const token = await issueCommerceSession(admin);
    const response = NextResponse.redirect(requestSiteUrl(request, returnTo), 303);
    response.cookies.set(COMMERCE_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: isSecureRequest(request),
      path: "/",
      maxAge: COMMERCE_SESSION_MAX_AGE_SECONDS,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    loginUrl.searchParams.set("error", "unavailable");
    return NextResponse.redirect(loginUrl, 303);
  }
}
