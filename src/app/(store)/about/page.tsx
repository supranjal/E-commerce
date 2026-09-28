import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, ShieldCheck, MapPin, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About RudraKart",
  description:
    "Learn about the RudraKart e-commerce project and its Rudraksha and puja product catalog.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-100 text-saffron-900 border border-saffron-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-saffron-700" />
          Academic Project
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sacred-950">
          About RudraKart
        </h1>
        <p className="text-base text-sacred-800 leading-relaxed max-w-2xl mx-auto">
          A full-stack storefront demonstration for Rudraksha and puja products.
        </p>
      </div>

      <div className="prose prose-sacred max-w-none text-sacred-800 text-sm sm:text-base leading-relaxed space-y-6">
        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-saffron-700" />
            Product Catalog
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Product origin, measurements, stock, and descriptions are catalog
            fields. The current seeded and fallback records are academic sample
            data, not independently verified sourcing claims.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Sample Certificates
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The public lookup demonstrates certificate-reference handling.
            Records prefixed with RK-DEMO are illustrative examples and do not
            represent laboratory tests, certifications, or authenticity
            guarantees.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-600" />
            Academic E-Commerce Architecture
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            RudraKart is a BSc CSIT 6th Semester E-Commerce project built with
            Next.js, Prisma, PostgreSQL, and Auth.js. Cash on Delivery is
            available in the checkout flow; online payment gateways are not
            connected.
          </p>
        </div>
      </div>

      <div className="pt-4 text-center">
        <Button variant="primary" size="lg" asChild>
          <Link href="/products" className="gap-2">
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
