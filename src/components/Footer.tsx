import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logos/ae-logo-horiz-bg.png"
                alt="Admiral Energy"
                className="h-7 w-auto rounded-md p-0.5 shadow-sm ring-1 ring-black/5"
              />
              <span className="ml-3 text-xl font-bold">Admiral Energy</span>
            </div>
            <p className="text-gray-300 mb-4">
              Portable Energy Autonomy &amp; Home Resilience for North Carolina.
              No pitch. Just math. Be the Admiral of Your Energy.
            </p>
            <p className="text-sm text-gray-400">Kings Mountain, NC</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/shop" className="hover:text-admiral-gold transition-colors">Shop</Link></li>
              <li><Link href="/portable-power" className="hover:text-admiral-gold transition-colors">Portable Power</Link></li>
              <li><Link href="/home-resilience" className="hover:text-admiral-gold transition-colors">Home Resilience</Link></li>
              <li><Link href="/blog" className="hover:text-admiral-gold transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-admiral-gold transition-colors">About</Link></li>
              <li><Link href="/case-studies" className="hover:text-admiral-gold transition-colors">Resilience Stories</Link></li>
            </ul>
          </div>

          {/* Contact & Policies */}
          <div>
            <h3 className="font-semibold mb-4">Contact &amp; Policies</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/contact" className="hover:text-admiral-gold transition-colors">Contact Us</Link></li>
              <li><a href="mailto:david@admiralenergy.ai" className="hover:text-admiral-gold transition-colors">david@admiralenergy.ai</a></li>
              <li><Link href="/policies/shipping" className="hover:text-admiral-gold transition-colors">Shipping</Link></li>
              <li><Link href="/policies/returns" className="hover:text-admiral-gold transition-colors">Returns</Link></li>
              <li><Link href="/policies/warranty" className="hover:text-admiral-gold transition-colors">Warranty</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-admiral-gold transition-colors">Privacy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-admiral-gold transition-colors">Terms</Link></li>
              <li><Link href="/policies/affiliate-disclosure" className="hover:text-admiral-gold transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Admiral Energy LLC. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Kings Mountain, North Carolina</p>
        </div>
      </div>
    </footer>
  );
}
