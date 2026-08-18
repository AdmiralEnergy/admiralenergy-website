import Link from "next/link";
import BrandLockup from "@/components/BrandLockup";

const primaryLinks = [
  ["SideKick", "/sidekick"],
  ["Home Backup", "/home-backup"],
  ["About", "/about"],
  ["Resources", "/resources"],
];

const policyLinks = [
  ["Shipping", "/policies/shipping"],
  ["Returns", "/policies/returns"],
  ["Warranty", "/policies/warranty"],
  ["Privacy", "/policies/privacy"],
  ["Terms", "/policies/terms"],
];

export default function Footer() {
  return (
    <footer className="bg-[#071f31] py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.4fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <Link href="/" aria-label="Admiral Energy home" className="mb-5 inline-flex rounded-xl">
            <BrandLockup context="footer" />
          </Link>
          <p className="max-w-md leading-7 text-slate-300">A North Carolina home-energy resilience company. Start with portable personal power. Go further with an honest whole-home backup conversation.</p>
          <p className="mt-4 text-sm font-semibold text-admiral-gold">No pitch. No exaggerated claims. Clear next steps.</p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-admiral-gold">Explore</h2>
          <ul className="space-y-3 text-slate-300">
            {primaryLinks.map(([label, href]) => <li key={href}><Link href={href} className="transition hover:text-white">{label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-[0.16em] text-admiral-gold">Contact & policies</h2>
          <ul className="space-y-3 text-slate-300">
            <li><a href="tel:+19842384187" className="transition hover:text-white">(984) 238-4187</a></li>
            <li><a href="mailto:david@admiralenergy.ai" className="transition hover:text-white">david@admiralenergy.ai</a></li>
            {policyLinks.map(([label, href]) => <li key={href}><Link href={href} className="transition hover:text-white">{label}</Link></li>)}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-4 pt-7 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} Admiral Energy LLC. Kings Mountain, North Carolina.</p>
        <p>SideKick is not manufactured by Generac.</p>
      </div>
    </footer>
  );
}
