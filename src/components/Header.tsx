'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/blog', label: 'Home Resilience Blog' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/shop/sidekick') {
    return <SidekickHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />;
  }

  return (
    <nav className="bg-admiral-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logos/ae-logo-horiz-bg.png"
              alt="Admiral Energy"
              width={140}
              height={36}
              className="h-8 md:h-9 w-auto rounded-lg p-0.5 shadow-sm ring-1 ring-black/5"
            />
            <span className="text-xl font-bold hidden sm:inline">Admiral Energy</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-admiral-gold transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-admiral-gold text-admiral-navy px-4 py-2 rounded-md hover:bg-gold-light transition-colors font-semibold text-sm"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-admiral-navy border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 hover:bg-white/10 rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block px-3 py-2 bg-admiral-gold text-admiral-navy rounded-md font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function trackSidekickBuyClick(location: string) {
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push({
    event: 'sidekick_buy_click',
    cta_location: location,
  });
}

interface SidekickHeaderProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const sidekickLinks = [
  { href: '#overview', label: 'Overview' },
  { href: '#features', label: 'Features' },
  { href: '#field', label: 'In the Field' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
];

function SidekickHeader({ mobileOpen, setMobileOpen }: SidekickHeaderProps) {
  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="bg-admiral-gold text-admiral-navy">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 overflow-x-auto whitespace-nowrap px-4 py-2 text-[0.7rem] font-bold sm:text-xs">
          <span>FREE SHIPPING</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-admiral-navy/60" />
          <span>30-DAY RETURNS</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-admiral-navy/60" />
          <span>1-YEAR LIMITED WARRANTY</span>
        </div>
      </div>
      <nav className="bg-admiral-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <a href="#overview" className="flex min-w-0 items-center gap-3">
              <Image
                src="/logos/ae-logo-horiz-bg.png"
                alt="Admiral Energy"
                width={132}
                height={34}
                className="h-8 w-auto rounded-lg p-0.5 shadow-sm ring-1 ring-black/5"
                priority
              />
              <span className="hidden text-xs font-semibold uppercase text-admiral-gold sm:inline">
                SIDEKICK
              </span>
            </a>

            <div className="hidden items-center gap-6 lg:flex">
              {sidekickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/85 transition-colors hover:text-admiral-gold"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#buy"
                onClick={() => trackSidekickBuyClick('nav')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-admiral-gold px-3 py-2 text-sm font-bold text-admiral-navy transition-colors hover:bg-gold-light sm:px-4"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Get Sidekick - $69.99</span>
                <span className="sm:hidden">Buy $69.99</span>
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle Sidekick menu"
                className="lg:hidden"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 bg-admiral-navy lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {sidekickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-white/90 hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
