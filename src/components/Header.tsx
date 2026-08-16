"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/sidekick", label: "SideKick" },
  { href: "/home-backup", label: "Home Backup" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-admiral-navy text-white shadow-lg">
      <div className="bg-admiral-gold px-4 py-1.5 text-center text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-admiral-navy sm:text-xs">
        Veteran-owned • North Carolina • Practical power resilience
      </div>
      <nav aria-label="Primary navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setMobileOpen(false)}>
          <Image src="/logos/ae-logo-horiz-bg.png" alt="Admiral Energy home" width={138} height={34} priority className="h-8 w-auto rounded-md" />
          <span className="hidden text-lg font-bold xl:inline">Admiral Energy</span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`rounded px-1 py-2 text-sm font-semibold transition hover:text-admiral-gold ${active ? "text-admiral-gold" : "text-white/85"}`}>
                {link.label}
              </Link>
            );
          })}
          <Link href="/sidekick#buy" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-admiral-gold px-4 py-2 text-sm font-extrabold text-admiral-navy transition hover:bg-gold-light">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Get Your SideKick
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/sidekick#buy" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-admiral-gold px-3 py-2 text-xs font-extrabold text-admiral-navy sm:text-sm">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" /> $69.99
          </Link>
          <button type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-admiral-gold">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-white/10 bg-admiral-navy px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-3 font-semibold text-white/90 hover:bg-white/10 hover:text-admiral-gold">
                {link.label}
              </Link>
            ))}
            <Link href="/home-backup#assessment" onClick={() => setMobileOpen(false)} className="mt-2 rounded-lg border border-white/20 px-4 py-3 text-center font-semibold text-white">
              Explore Home Backup
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
