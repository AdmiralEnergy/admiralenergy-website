import { SignJWT, jwtVerify } from "jose";

export const COMMERCE_SESSION_COOKIE = "ae_commerce_session";
export const COMMERCE_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export interface CommerceSession {
  email: string;
  role: "commerce_admin";
}
function secretKey(secret: string) {
  if (secret.length < 32) {
    throw new Error("COMMERCE_SESSION_SECRET must contain at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: CommerceSession, secret: string) {
  return new SignJWT({ email: session.email, role: session.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(session.email)
    .setIssuedAt()
    .setExpirationTime(`${COMMERCE_SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey(secret));
}

export async function verifySessionToken(token: string, secret: string): Promise<CommerceSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(secret), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "commerce_admin" || typeof payload.email !== "string") return null;
    return { email: payload.email, role: "commerce_admin" };
  } catch {
    return null;
  }
}
