import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Admiral Energy | Portable & Whole-Home Backup Power", template: "%s | Admiral Energy" },
  description: "Admiral Energy helps North Carolina families build practical power resilience—from the SideKick PowerBank to professionally installed whole-home backup.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Admiral Energy",
    title: "Admiral Energy | Power Starts Small. Resilience Goes Further.",
    description: "Buy the SideKick PowerBank or explore whole-home backup with a North Carolina Generac Aligned Contractor.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Admiral Energy — Power Starts Small. Resilience Goes Further." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admiral Energy | Practical Home Energy Resilience",
    description: "SideKick portable power and whole-home backup guidance for North Carolina.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/logos/ae-favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/logos/ae-favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/logos/ae-apple-180.png",
  },
  manifest: "/logos/site.webmanifest",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Admiral Energy LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/logos/ae-logo-horiz-bg.png`,
  description: "A veteran-owned North Carolina home-energy resilience company offering portable power and whole-home backup guidance.",
  email: "david@admiralenergy.ai",
  telephone: "+1-984-238-4187",
  address: { "@type": "PostalAddress", addressLocality: "Kings Mountain", addressRegion: "NC", addressCountry: "US" },
  areaServed: { "@type": "State", name: "North Carolina" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N6HRP34Z');`}</Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-admiral-white text-slate-900 antialiased`}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N6HRP34Z" height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
        <Script src="/scripts/analytics-helper.js" strategy="afterInteractive" />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
