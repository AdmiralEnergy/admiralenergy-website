import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

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
    default: "Admiral Energy — Portable Energy Autonomy & Home Resilience | North Carolina",
    template: "%s | Admiral Energy",
  },
  description:
    "Portable backup power, home resilience planning, and expert guidance for North Carolina homeowners. No pitch. Just math.",
  metadataBase: new URL("https://admiralenergy.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://admiralenergy.ai",
    siteName: "Admiral Energy",
    title: "Admiral Energy — Portable Energy Autonomy & Home Resilience",
    description:
      "Portable backup power, home resilience planning, and expert guidance for North Carolina homeowners.",
    images: [{ url: "/logos/admiral-energy-share.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admiral Energy — Portable Energy Autonomy",
    description: "Backup power & resilience for NC homeowners.",
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

        {/* Snipcart */}
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.css" />
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

        {/* Snipcart hidden div — replace API key with your live key */}
        <div
          hidden
          id="snipcart"
          data-api-key="YOUR_SNIPCART_PUBLIC_API_KEY"
          data-config-modal-style="side"
          data-config-add-product-behavior="none"
        ></div>
        <Script src="https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
