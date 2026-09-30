import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rudrakart.vercel.app",
  ),
  title: {
    default: "RudraKart | Certified Himalayan Rudraksha & Sacred Puja Items",
    template: "%s | RudraKart Nepal",
  },
  description:
    "Authentic consecrated Nepali Rudraksha (1–14 Mukhi), sacred Japa malas, and Vedic puja items with digital lab and X-ray certification.",
  keywords: [
    "Rudraksha",
    "Nepali Rudraksha",
    "1 to 14 Mukhi Rudraksha",
    "Gauri Shankar Rudraksha",
    "Authentic Himalayan Rudraksha",
    "Certified Rudraksha Nepal",
    "Puja Products Nepal",
    "Sacred Japa Mala",
    "Rudraksha Certificate Verification",
    "Sankhuwasabha Rudraksha",
    "Dingla Rudraksha",
    "Vedic Consecrated Beads",
  ],
  authors: [{ name: "RudraKart", url: "https://rudrakart.vercel.app" }],
  creator: "RudraKart",
  publisher: "RudraKart Himalayan Gem & Botanical Laboratory",
  category: "Religious & Spiritual Goods",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "RudraKart",
    title: "RudraKart | Certified Himalayan Rudraksha & Sacred Puja Items",
    description:
      "Authentic consecrated Nepali Rudraksha (1–14 Mukhi), sacred Japa malas, and Vedic puja items with digital lab and X-ray certification.",
    images: [
      {
        url: "/images/products/5 Mukhi Collector Grade Rudraksha (Nepal).jpg",
        width: 1200,
        height: 630,
        alt: "RudraKart Himalayan Rudraksha Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RudraKart | Certified Himalayan Rudraksha & Sacred Puja Items",
    description:
      "Authentic consecrated Nepali Rudraksha (1–14 Mukhi), sacred Japa malas, and Vedic puja items with digital lab and X-ray certification.",
    creator: "@RudraKart",
    images: ["/images/products/5 Mukhi Collector Grade Rudraksha (Nepal).jpg"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://rudrakart.vercel.app/#organization",
      name: "RudraKart",
      url: "https://rudrakart.vercel.app",
      logo: "https://rudrakart.vercel.app/icon.svg",
      description:
        "Authentic Himalayan Rudraksha beads, sacred Japa malas, and consecrated Vedic puja items with digital botanical certification.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "support@rudrakart.com",
        telephone: "+9779869624948",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://rudrakart.vercel.app/#website",
      url: "https://rudrakart.vercel.app",
      name: "RudraKart",
      publisher: {
        "@id": "https://rudrakart.vercel.app/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://rudrakart.vercel.app/products?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

import { DevSessionInit } from "@/components/common/DevSessionInit";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-saffron-200 selection:text-saffron-900">
        <AuthProvider>
          <DevSessionInit />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
