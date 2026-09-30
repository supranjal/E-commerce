import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Layers,
  Scale,
  Microscope,
  FileCheck2,
} from "lucide-react";
import { getProducts, getCategories } from "@/actions/product-actions";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Authentic Himalayan Rudraksha & Sacred Puja Store",
  description:
    "Explore certified natural Nepali Rudraksha beads (1–14 Mukhi), consecrated malas, and sacred puja items directly from Nepal.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const allProducts = await getProducts();
  const categories = await getCategories();

  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 4);
  const rareProducts = allProducts.filter((p) => p.isSpecial).slice(0, 4);
  const regularMukhis = allProducts
    .filter((p) => p.mukhi && p.mukhi <= 7)
    .slice(0, 4);

  const mukhiNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RudraKart",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://rudrakart.vercel.app",
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RudraKart",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://rudrakart.vercel.app",
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sacred-100/50 to-sacred-50 py-16 sm:py-24 border-b border-sacred-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100 border border-saffron-300 text-saffron-950 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-saffron-700" />
                Rudraksha Products and Puja Supplies
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-sacred-950 tracking-tight leading-[1.15]">
                Rudraksha and Puja{" "}
                <span className="text-saffron-700 underline decoration-gold-500 decoration-wavy underline-offset-8">
                  Products
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-800 font-sans max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Directly harvested from sacred Himalayan foothills and consecrated in Nepal.
                Explore laboratory-certified genuine Mukhi beads, energizing malas, and traditional puja essentials.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="gap-2 shadow-lg text-base font-bold"
                  asChild
                >
                  <Link href="/products">
                    Explore Sacred Beads <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-stone-400 bg-white text-stone-900 font-bold shadow-xs hover:bg-stone-50"
                  asChild
                >
                  <Link href="/certificate-verification">
                    <Award className="w-4 h-4 text-gold-700" /> Verify
                    Certificate
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sacred-200 text-center lg:text-left">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-sacred-950">
                    1–14
                  </span>
                  <p className="text-xs font-semibold text-stone-600">
                    Mukhi Categories
                  </p>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-sacred-950">
                    100%
                  </span>
                  <p className="text-xs font-semibold text-stone-600">
                    Certified Lab Tested
                  </p>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-sacred-950">
                    Global
                  </span>
                  <p className="text-xs font-semibold text-stone-600">
                    & COD Delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Trust & Highlights Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl p-6 sm:p-8 bg-white/95 backdrop-blur-md border border-sacred-200 shadow-xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-sacred-100">
                  <div className="w-10 h-10 rounded-xl bg-saffron-100 text-saffron-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6 text-saffron-700" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-sacred-950">
                      Sacred Purity & Authenticity
                    </h3>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Himalayan Origin Guaranteed
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-sacred-950 block text-sm">
                        Direct Himalayan Harvest
                      </span>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        Ethically sourced directly from high-altitude trees in Sankhuwasabha & Dingla, Nepal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                    <div>
                      <span className="font-bold text-sacred-950 block text-sm">
                        Laboratory Certified
                      </span>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        Every bead undergoes botanical locule verification and digital X-ray inspection.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-saffron-50 text-saffron-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-saffron-700" />
                    </div>
                    <div>
                      <span className="font-bold text-sacred-950 block text-sm">
                        Vedic Consecration
                      </span>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        Traditional energization rituals performed with pure holy water and sacred Vedic mantras.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-sacred-100 flex items-center justify-between">
                  <Link
                    href="/authenticity"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-800 hover:text-saffron-900 transition-colors"
                  >
                    Read identification guide <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                    Nepal Consecrated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MUKHI QUICK JUMP BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
            Browse by Sacred Mukhi
          </h2>
          <p className="text-xs sm:text-sm font-medium text-stone-600 max-w-xl mx-auto">
            Browse our complete catalog of certified Nepali beads by Mukhi category.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {mukhiNumbers.map((m) => (
            <Link
              key={m}
              href={`/rudraksha/${m}-mukhi`}
              className="group flex flex-col items-center justify-center p-3.5 rounded-xl border border-stone-200 bg-white hover:border-saffron-600 hover:bg-saffron-50/70 transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-saffron-700 group-hover:text-white flex items-center justify-center font-serif font-extrabold text-stone-900 transition-colors">
                {m}
              </div>
              <span className="text-xs font-bold text-stone-900 mt-2 group-hover:text-saffron-800">
                {m} Mukhi
              </span>
              <span className="text-[10px] font-medium text-stone-500">
                Nepali Bead
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-800">
              Collector & High-Grade
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
              Featured Products
            </h2>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link
              href="/products"
              className="gap-1.5 font-bold text-stone-800 border-stone-300"
            >
              View All Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. LIVE CERTIFICATE VERIFICATION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-sacred-950 via-sacred-900 to-saffron-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-gold-500/40">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-bold">
              <Award className="w-4 h-4 text-gold-400" />
              Certificate Registry
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Verify Specimen Authenticity
            </h2>

            <p className="text-sm text-sacred-100 leading-relaxed font-medium">
              Enter your specimen certificate serial number to access its official laboratory record, including cross-sectional X-ray analysis, botanical locules, dimensions, and weight.
            </p>

            <form
              action="/certificate-verification"
              method="GET"
              className="flex flex-col sm:flex-row gap-3 max-w-lg"
            >
              <input
                type="text"
                name="id"
                defaultValue="RK-DEMO-00001"
                placeholder="Certificate ID (e.g. RK-2026-00001)"
                className="flex-1 px-4 py-3 text-sm rounded-lg bg-sacred-900 border border-gold-400/60 text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="whitespace-nowrap font-bold"
              >
                Verify Now
              </Button>
            </form>
          </div>

          <ShieldCheck className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 pointer-events-none" />
        </div>
      </section>

      {/* 5. 4-STEP AUTHENTICITY PROTOCOL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-800">
            Storefront Overview
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
            Sacred Standards & Fulfillment
          </h2>
          <p className="text-xs sm:text-sm font-medium text-stone-600 max-w-xl mx-auto">
            From high-altitude harvest to consecrated delivery, every sacred specimen meets exacting quality benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center font-serif font-extrabold text-base">
                1
              </div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Authentic Sourcing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Sustainably harvested from mature Himalayan trees in eastern Nepal with natural clefts and thorn density.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center font-serif font-extrabold text-base">
                2
              </div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Lab Certification
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Detailed digital radiograph inspection confirming internal seed locules and zero synthetic alteration.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center font-serif font-extrabold text-base">
                3
              </div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Flexible Checkout
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Convenient payment choices: eSewa, Khalti, International Cards, and Cash on Delivery with full encryption.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center font-serif font-extrabold text-base">
                4
              </div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Consecrated Delivery
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Vedic energization, sacred packaging, and tamper-evident courier dispatch worldwide with live tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. RARE & SACRED COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-saffron-800">
              Natural Wonders
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
              Rare & Conjoined Rudraksha
            </h2>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link
              href="/category/rare-sacred-rudraksha"
              className="gap-1.5 font-bold text-stone-800 border-stone-300"
            >
              Explore Rare Beads <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rareProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
