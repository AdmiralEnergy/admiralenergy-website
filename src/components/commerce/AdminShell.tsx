import Image from "next/image";
import Link from "next/link";
import { Boxes, Cable, ClipboardList, Gauge, PackageSearch, PlusCircle } from "lucide-react";
import type { ReactNode } from "react";

const navigation = [
  { href: "/admin/commerce", label: "Overview", icon: Gauge },
  { href: "/admin/commerce/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/commerce/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/commerce/products", label: "Products", icon: PackageSearch },
  { href: "/admin/commerce/channels", label: "Channels", icon: Cable },
];

export default function AdminShell({ children, email }: { children: ReactNode; email: string }) {
  return (
    <div className="commerce-admin-root min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-800 bg-[#081f32] text-white">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/admin/commerce" className="flex items-center gap-3 rounded-lg">
            <Image src="/logos/ae-logo-horiz-bg.png" alt="Admiral Energy" width={128} height={32} className="h-8 w-auto rounded" />
            <span className="hidden border-l border-white/20 pl-3 text-sm font-bold sm:inline">Commerce Operations</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-300 md:inline">{email}</span>
            <form action="/api/admin/commerce/logout" method="post">
              <button className="min-h-10 rounded-lg border border-white/25 px-3 font-semibold transition hover:bg-white/10" type="submit">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-white lg:min-h-[calc(100vh-65px)] lg:border-b-0 lg:border-r">
          <nav aria-label="Commerce admin" className="flex gap-1 overflow-x-auto p-3 lg:grid lg:p-4">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-[#0c2f4a]">
                <Icon className="h-4 w-4" aria-hidden="true" /> {label}
              </Link>
            ))}
            <Link href="/admin/commerce/orders/new" className="mt-0 flex min-h-11 shrink-0 items-center gap-3 rounded-lg bg-[#c9a648] px-3 py-2 text-sm font-extrabold text-[#0c2f4a] transition hover:bg-[#d4b85c] lg:mt-3">
              <PlusCircle className="h-4 w-4" aria-hidden="true" /> New order
            </Link>
          </nav>
        </aside>
        <div className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
