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
    default: "RudraKart | Rudraksha and Puja Products",
    template: "%s | RudraKart",
  },
  description:
    "Browse Rudraksha beads, malas, and puja products in the RudraKart catalog.",
  openGraph: {
    type: "website",
    siteName: "RudraKart",
    title: "RudraKart | Rudraksha and Puja Products",
    description:
      "Browse Rudraksha beads, malas, and puja products in the RudraKart catalog.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RudraKart | Rudraksha and Puja Products",
    description:
      "Browse Rudraksha beads, malas, and puja products in the RudraKart catalog.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-saffron-200 selection:text-saffron-900">
        {children}
      </body>
    </html>
  );
}
