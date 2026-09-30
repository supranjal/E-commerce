import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, BookOpen, FlaskConical, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Rudraksha Authenticity & Laboratory Verification Guide",
  description:
    "Learn about RudraKart's comprehensive authenticity protocols, botanical examination, and digital X-ray verification standards.",
  alternates: { canonical: "/authenticity" },
};

export default function AuthenticityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="space-y-3 border-b border-sacred-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-100 text-saffron-900 border border-saffron-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-saffron-700" />
          Himalayan Authenticity Standards
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sacred-950">
          Identification & Verification Guide
        </h1>
        <p className="text-sm sm:text-base text-sacred-800 max-w-2xl leading-relaxed">
          Learn how genuine Nepali Rudraksha beads are identified, botanically verified, and digitally certified through our rigorous laboratory protocols.
        </p>
      </header>

      {/* Mukhi Anatomy */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
        <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-saffron-700" />
          1. Understanding Mukhis & Botanical Anatomy
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          A genuine Nepali Rudraksha (<em>Elaeocarpus ganitrus</em>) is distinguished by continuous, natural clefts (Mukhis) that traverse from the upper stalk apex to the base pedicel without interruption. Authentic Nepali beads possess deeply furrowed thorny cellular ridges, superior botanical density, and natural woody hardness.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200/80 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Natural Fissures:</strong> Clean, uninterrupted organic lines without artificial knife markings or synthetic adhesives.</span>
          </div>
          <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200/80 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Cellular Toughness:</strong> High specific gravity with a well-developed natural core structure.</span>
          </div>
        </div>
      </section>

      {/* Laboratory Testing */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
        <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-saffron-700" />
          2. Radiographic X-Ray & Laboratory Testing
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          While visual inspection confirms external lines, genuine confirmation requires non-destructive internal radiographic inspection. Cross-sectional digital X-rays reveal the exact internal locules (seed chambers), proving that each outer line corresponds to an authentic internal seed cell.
        </p>
        <div className="p-4 rounded-xl bg-gold-50/60 border border-gold-200 text-stone-700 text-xs space-y-1.5">
          <span className="font-bold text-sacred-950 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-gold-700" />
            Our Laboratory Inspection Includes:
          </span>
          <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
            <li>High-resolution digital X-ray radiograph scan to verify internal seed locules.</li>
            <li>Micrometric caliper measurements of equatorial and polar dimensions.</li>
            <li>Precision analytical balance weight determination (recorded to 0.01g).</li>
            <li>Cellular microscopic examination confirming absence of resin or composite filler.</li>
          </ul>
        </div>
      </section>

      {/* Consecration */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
        <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          3. Sacred Consecration & Tamper-Evident Delivery
        </h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          Every verified bead undergoes sacred sanctification in accordance with ancient Vedic rites. Once energized, the specimen is sealed with a tamper-evident serial band and assigned a unique laboratory certificate that can be queried anytime in our online registry.
        </p>
      </section>

      <div className="flex flex-wrap gap-4 pt-2">
        <Button variant="primary" size="lg" asChild>
          <Link href="/products" className="gap-2">
            Explore Certified Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/certificate-verification">
            Lookup Certificate Registry
          </Link>
        </Button>
      </div>
    </div>
  );
}
