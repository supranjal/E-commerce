import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, BookOpen, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Rudraksha Information and Sample Data Notice",
  description:
    "Learn what RudraKart's academic sample catalog and certificate records do and do not establish.",
  alternates: { canonical: "/authenticity" },
};

export default function AuthenticityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="space-y-3 border-b border-sacred-200 pb-6">
        <p className="text-xs font-semibold uppercase text-saffron-800">
          Academic Project Information
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sacred-950">
          Rudraksha information and sample data
        </h1>
        <p className="text-sm text-sacred-800 max-w-2xl">
          RudraKart is an e-commerce demonstration. Its catalog and RK-DEMO
          certificate records are illustrative and are not independent product,
          origin, or laboratory verification.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-saffron-700" />
          Mukhi descriptions
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          “Mukhi” is commonly used to describe visible longitudinal divisions on
          a Rudraksha seed. A visual count or product photograph alone cannot
          establish a specimen&apos;s identity, origin, or condition.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-saffron-700" />
          Testing and certificate records
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Some independent evaluators may use imaging or microscopy as part of
          an examination. RudraKart does not operate a laboratory, perform these
          tests, or issue real certificates. Sample records are labeled
          SAMPLE_DEMO in the lookup.
        </p>
      </section>

      <section className="rounded-lg border border-amber-300 bg-amber-50 p-5 space-y-2">
        <h2 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          About this catalog
        </h2>
        <p className="text-sm text-amber-900 leading-relaxed">
          Product descriptions, origin fields, measurements, stock, and
          certificate details may be sample values. Do not rely on them as
          commercial representations or proof of authenticity.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" asChild>
          <Link href="/products">Browse the catalog</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/certificate-verification">Look up a sample record</Link>
        </Button>
      </div>
    </div>
  );
}
