import { compare } from "bcryptjs";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COMMERCE_SESSION_COOKIE,
  createSessionToken,
  verifySessionToken,
  type CommerceSession,
} from "./session";

function getAuthConfiguration() {
  const email = process.env.COMMERCE_ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.COMMERCE_ADMIN_PASSWORD_HASH?.trim();
  const sessionSecret = process.env.COMMERCE_SESSION_SECRET?.trim();
  if (!email || !passwordHash || !sessionSecret || sessionSecret.length < 32) return null;
  return { email, passwordHash, sessionSecret };
}

export function isCommerceAuthConfigured() {
  return getAuthConfiguration() !== null;
}

export async function authenticateCommerceAdmin(email: string, password: string) {
  const config = getAuthConfiguration();
  if (!config) return null;
  if (email.trim().toLowerCase() !== config.email) {
    await compare(password, "$2b$12$4t3G0zJwHYQ8bUcGDylYEe4j1nfdFwIlzB3wpQDhSW.zOzCfVQW8S");
    return null;
  }
  if (!(await compare(password, config.passwordHash))) return null;
  return { email: config.email, role: "commerce_admin" as const };
}

export async function issueCommerceSession(session: CommerceSession) {
  const config = getAuthConfiguration();
  if (!config) throw new Error("Commerce admin authentication is not configured.");
  return createSessionToken(session, config.sessionSecret);
}

export async function getCommerceAdmin(): Promise<CommerceSession | null> {
  const config = getAuthConfiguration();
  if (!config) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(COMMERCE_SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token, config.sessionSecret);
  if (session?.email.trim().toLowerCase() !== config.email) return null;
  return session;
}

export async function requireCommerceAdmin() {
  const session = await getCommerceAdmin();
  if (!session) redirect("/admin/commerce/login");
  return session;
}

export async function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    if (origin === "null") return request.headers.get("sec-fetch-site") === "same-origin";
    return new URL(origin).origin === requestSiteUrl(request).origin;
  } catch {
    return false;
  }
}

export function requestSiteUrl(request: Request, path = "/") {
  const current = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? current.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? current.protocol.replace(":", "");
  return new URL(path, `${protocol}://${host}`);
}

export function isSecureRequest(request: Request) {
  return requestSiteUrl(request).protocol === "https:";
}

export function loginAttemptKey(email: string, ipAddress: string) {
  const secret = process.env.COMMERCE_SESSION_SECRET ?? "unconfigured";
  return createHash("sha256")
    .update(`${email.trim().toLowerCase()}\0${ipAddress}\0${secret}`)
    .digest("hex");
}

export function safeReturnPath(value: string | null | undefined) {
  if (!value?.startsWith("/admin/commerce") || value.startsWith("//")) return "/admin/commerce";
  return value;
}
