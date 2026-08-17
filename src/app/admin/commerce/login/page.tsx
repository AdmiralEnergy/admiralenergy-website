import Image from "next/image";
import { redirect } from "next/navigation";
import { Alert, buttonClass, fieldClass } from "@/components/commerce/AdminUI";
import { getCommerceAdmin, isCommerceAuthConfigured, safeReturnPath } from "@/lib/commerce/auth";

export const dynamic = "force-dynamic";

export default async function CommerceLoginPage({ searchParams }: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  if (await getCommerceAdmin()) redirect(safeReturnPath(params.next));
  const configured = isCommerceAuthConfigured();
  return (
    <div className="commerce-admin-root flex min-h-screen items-center justify-center bg-[#081f32] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
        <Image src="/logos/ae-logo-horiz-bg.png" alt="Admiral Energy" width={160} height={40} className="mb-8 h-10 w-auto rounded" priority />
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a6b19]">Internal access</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#0c2f4a]">Commerce Operations</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Sign in with the server-configured administrator account.</p>
        <div className="mt-6 space-y-4">
          {!configured && <Alert tone="error">Authentication is not configured. Add the required commerce admin environment variables before signing in.</Alert>}
          {params.error === "invalid" && <Alert tone="error">The email or password was not accepted.</Alert>}
          {params.error === "locked" && <Alert tone="warning">Too many unsuccessful attempts. Try again in 15 minutes.</Alert>}
          {params.error === "unavailable" && <Alert tone="error">Secure sign-in is temporarily unavailable. Try again shortly.</Alert>}
        </div>
        <form action="/api/admin/commerce/login" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="returnTo" value={safeReturnPath(params.next)} />
          <label className="block text-sm font-bold text-slate-800">Email
            <input className={`${fieldClass} mt-1`} type="email" name="email" autoComplete="username" required disabled={!configured} />
          </label>
          <label className="block text-sm font-bold text-slate-800">Password
            <input className={`${fieldClass} mt-1`} type="password" name="password" autoComplete="current-password" required disabled={!configured} />
          </label>
          <button type="submit" className={`${buttonClass} w-full`} disabled={!configured}>Sign in securely</button>
        </form>
        <p className="mt-6 text-xs leading-5 text-slate-500">Protected by an HTTP-only signed session. Credentials are never stored in browser storage.</p>
      </div>
    </div>
  );
}
