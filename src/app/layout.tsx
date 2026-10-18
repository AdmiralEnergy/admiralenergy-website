import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AttributionTracker from "@/components/AttributionTracker";
import { BUSINESS } from "@/lib/business";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Admiral Energy | Backup Power in Kings Mountain, NC", template: "%s | Admiral Energy" },
  description: "Veteran-owned Admiral Energy in Kings Mountain offers SideKick personal power, practical backup education, and initial standby-generator consultations.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Admiral Energy",
    title: "Admiral Energy | Backup Power in Kings Mountain, NC",
    description: "Shop SideKick personal power or start a practical home-backup planning conversation with a veteran-owned Kings Mountain business.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Admiral Energy — Power Starts Small. Resilience Goes Further." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admiral Energy | Backup Power in Kings Mountain, NC",
    description: "SideKick personal power and transparent home-backup planning from Kings Mountain, North Carolina.",
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
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logos/ae-logo-horiz-bg.png`,
  },
  description: "A veteran-owned energy-resilience business based in Kings Mountain, North Carolina, offering personal power products and preliminary home-backup education.",
  email: BUSINESS.contact.email,
  telephone: BUSINESS.contact.phoneE164,
  address: {
    "@type": "PostalAddress",
    addressLocality: BUSINESS.base.locality,
    addressRegion: BUSINESS.base.region,
    addressCountry: BUSINESS.base.country,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: BUSINESS.contact.phoneE164,
    email: BUSINESS.contact.email,
    contactType: "customer service",
    availableLanguage: "English",
  },
  areaServed: { "@type": "City", name: "Kings Mountain, North Carolina" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N6HRP34Z');`}</Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-admiral-white text-slate-900 antialiased`}>
        <noscript><iframe title="Google Tag Manager" src="https://www.googletagmanager.com/ns.html?id=GTM-N6HRP34Z" height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>
        <AttributionTracker />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
