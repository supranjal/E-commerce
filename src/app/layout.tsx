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
  title: "RudraKart | Certified & Authentic Sacred Rudraksha",
  description: "Direct Himalayan authentic Nepali Rudraksha with laboratory certification, X-ray transparency, and guaranteed botanical integrity.",
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
