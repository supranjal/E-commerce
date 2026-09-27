import Link from "next/link";
import Image from "next/image";
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

export default async function HomePage() {
  const allProducts = await getProducts();
  const categories = await getCategories();

  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 4);
  const rareProducts = allProducts.filter((p) => p.isSpecial).slice(0, 4);
  const regularMukhis = allProducts.filter((p) => p.mukhi && p.mukhi <= 7).slice(0, 4);

  const mukhiNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sacred-100/50 to-sacred-50 py-16 sm:py-24 border-b border-sacred-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100 border border-saffron-300 text-saffron-950 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-saffron-700" />
                Himalayan Sacred Botanicals • X-Ray Certified
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-sacred-950 tracking-tight leading-[1.15]">
                Authentic & Certified{" "}
                <span className="text-saffron-700 underline decoration-gold-500 decoration-wavy underline-offset-8">
                  Nepali Rudraksha
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-800 font-sans max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Directly harvested from the sacred high-altitude groves of Sankhuwasabha and Dingla, Nepal. Every rare bead is radiologically inspected, laboratory-documented, and backed by verifiable certificate IDs.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Button variant="primary" size="lg" className="gap-2 shadow-lg text-base font-bold" asChild>
                  <Link href="/products">
                    Explore Sacred Beads <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2 border-stone-400 bg-white text-stone-900 font-bold shadow-xs hover:bg-stone-50" asChild>
                  <Link href="/certificate-verification">
                    <Award className="w-4 h-4 text-gold-700" /> Verify Certificate
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sacred-200 text-center lg:text-left">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-sacred-950">100%</span>
                  <p className="text-xs font-semibold text-stone-600">Nepali Origin</p>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-sacred-950">1–14</span>
                  <p className="text-xs font-semibold text-stone-600">Certified Mukhis</p>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-extrabold text-sacred-950">X-Ray</span>
                  <p className="text-xs font-semibold text-stone-600">Chamber Tested</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-sacred-950">
                <div className="relative aspect-4/5 w-full">
                  <Image
                    src="https://ts1.mm.bing.net/th?id=OIP.bJamoS-njJWmQNuhw_n2YgHaFS"
                    alt="Authentic 1 Mukhi Savar Rudraksha"
                    fill
                    className="object-contain p-4"
                    quality={80}
                    priority
                  />
                  
                  {/* Floating Certificate Badge */}
                  <div className="absolute top-4 right-4 bg-sacred-950/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gold-400 shadow-lg text-xs font-bold text-gold-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    ID: RK-DEMO-00001
                  </div>
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
            Select a specific natural face count to explore verified specifications, origins, and botanical details.
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
              <span className="text-[10px] font-medium text-stone-500">Nepali Bead</span>
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
              Featured Authentic Specimens
            </h2>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products" className="gap-1.5 font-bold text-stone-800 border-stone-300">
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
              Public Authenticity Registry
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Verify Your RudraKart Certificate
            </h2>

            <p className="text-sm text-sacred-100 leading-relaxed font-medium">
              Every genuine RudraKart specimen comes with a unique certificate ID. Verify laboratory X-ray observations, microscopic facet analysis, and exact weight records.
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
                placeholder="Enter Certificate ID (e.g. RK-DEMO-00001)"
                className="flex-1 px-4 py-3 text-sm rounded-lg bg-sacred-900 border border-gold-400/60 text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-400 font-mono"
              />
              <Button type="submit" variant="primary" size="lg" className="whitespace-nowrap font-bold">
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
            Botanical & Scientific Integrity
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
            Our 4-Stage Verification Protocol
          </h2>
          <p className="text-xs sm:text-sm font-medium text-stone-600 max-w-xl mx-auto">
            Distinguishing genuine natural Himalayan beads from carved or manipulated imitations through non-destructive laboratory testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center font-serif font-extrabold text-base">
                1
              </div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Direct Foothill Harvest
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Direct ethical sourcing from verified farmers in Sankhuwasabha and Dingla with zero middleman adulteration.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center font-serif font-extrabold text-base">
                2
              </div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Microscopic Examination
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Magnified examination of natural thorny ridges, cellular fissures, and elimination of carved fake grooves or glue joints.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center font-serif font-extrabold text-base">
                3
              </div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Digital X-Ray Radiograph
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Non-destructive radiological scanning to confirm that the internal natural seed chambers match external Mukhi lines.
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center font-serif font-extrabold text-base">
                4
              </div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                Unique Certificate Registry
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Issuance of a serialized certificate documenting exact weight in grams, dimensions in millimeters, and digital verification.
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
            <Link href="/category/rare-sacred-rudraksha" className="gap-1.5 font-bold text-stone-800 border-stone-300">
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
