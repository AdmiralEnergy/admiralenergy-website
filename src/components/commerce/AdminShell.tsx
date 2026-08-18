import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import AdminNavigation from "./AdminNavigation";

export default function AdminShell({ children, email }: { children: ReactNode; email: string }) {
  return (
    <div className="commerce-admin-root min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-800 bg-[#081f32] text-white">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/admin/commerce" className="flex items-center gap-3 rounded-lg">
            <Image src="/logos/ae-logo-horiz-bg.png" alt="Admiral Energy" width={128} height={32} className="h-8 w-auto rounded" style={{ width: "auto" }} />
            <span className="hidden border-l border-white/20 pl-3 text-sm font-bold sm:inline">Commerce Operations</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-300 md:inline">{email}</span>
            <form action="/api/admin/commerce/logout" method="post">
              <button className="min-h-11 rounded-lg border border-white/25 px-3 font-semibold transition hover:bg-white/10" type="submit">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white lg:min-h-[calc(100vh-65px)] lg:border-b-0 lg:border-r">
          <AdminNavigation />
        </aside>
        <div className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
