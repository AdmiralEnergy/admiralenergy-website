import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import { products } from "@/data/products";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Admiral Energy — Generac GB1000, 200W Solar Panels & Generator Installs | North Carolina",
    template: "%s | Admiral Energy",
  },
  description:
    "Shop the Generac GB1000 portable power station, Admiral 200W solar panels, and get Generac generator install quotes in Charlotte & Kings Mountain, NC. No pitch. Just math.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Admiral Energy",
    title: "Admiral Energy — Generac GB1000, Solar Panels & Generator Installs",
    description:
      "Shop portable backup power and get Generac install quotes for North Carolina homeowners.",
    images: [{ url: "/logos/admiral-energy-share.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admiral Energy — Generac GB1000 & Generator Installs",
    description: "Portable backup power & Generac installs for NC homeowners.",
    images: ["/logos/admiral-energy-share.png"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization JSON-LD
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Admiral Energy",
    url: SITE_URL,
    logo: `${SITE_URL}/logos/ae-logo-horiz-bg.png`,
    description: "Portable backup power, Generac home generators, and energy resilience for North Carolina homeowners.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kings Mountain",
      addressRegion: "NC",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-984-238-4187",
      contactType: "customer service",
      email: "info@admiralenergy.ai",
    },
  };

  // ItemList structured data for shop
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/shop/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N6HRP34Z');
        `}</Script>

        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-admiral-white text-gray-900`}>
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N6HRP34Z"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
