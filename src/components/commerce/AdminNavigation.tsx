"use client";

import Link from "next/link";
import { Boxes, Cable, ClipboardList, Gauge, PackageSearch, PlusCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/admin/commerce", label: "Overview", icon: Gauge },
  { href: "/admin/commerce/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/commerce/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/commerce/products", label: "Products", icon: PackageSearch },
  { href: "/admin/commerce/channels", label: "Channels", icon: Cable },
  { href: "/admin/commerce/orders/new", label: "New order", icon: PlusCircle, emphasized: true },
];

function isActivePath(pathname: string, href: string) {
  if (pathname === "/admin/commerce/orders/new") return href === pathname;
  if (href === "/admin/commerce") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Commerce admin" className="grid grid-cols-3 gap-1 p-3 lg:grid-cols-1 lg:p-4">
      {navigation.map(({ href, label, icon: Icon, emphasized }) => {
        const active = isActivePath(pathname, href);
        const standard = active
          ? "bg-[#0c2f4a] text-white"
          : "text-slate-700 hover:bg-slate-100 hover:text-[#0c2f4a]";
        const callout = active
          ? "bg-[#0c2f4a] text-white"
          : "bg-[#c9a648] text-[#0c2f4a] hover:bg-[#d4b85c]";
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-14 min-w-0 items-center justify-center gap-1 rounded-lg px-2 py-2 text-center text-xs font-extrabold transition lg:min-h-11 lg:justify-start lg:gap-3 lg:px-3 lg:text-left lg:text-sm ${emphasized ? callout : standard} ${emphasized ? "lg:mt-3" : ""}`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate lg:overflow-visible">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
