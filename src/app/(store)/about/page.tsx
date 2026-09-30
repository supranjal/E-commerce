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
          Himalayan Heritage & Sanctum
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sacred-950">
          About RudraKart
        </h1>
        <p className="text-base text-sacred-800 leading-relaxed max-w-2xl mx-auto">
          Dedicated to preserving sacred Himalayan heritage through ethically sourced, laboratory-certified Rudraksha and authentic puja essentials.
        </p>
      </div>

      <div className="prose prose-sacred max-w-none text-sacred-800 text-sm sm:text-base leading-relaxed space-y-6">
        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-saffron-700" />
            Ethical Sourcing & Himalayan Origin
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every Rudraksha bead in our collection is harvested directly from organic trees nestled in the high-altitude Himalayan hills of Sankhuwasabha and Dingla, Nepal. We work closely with local artisan harvesters to ensure natural development without premature plucking or chemical treating.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Rigorous Quality & Digital Certification
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We operate an in-house quality inspection laboratory in Kathmandu where each specimen undergoes digital radiography, botanical locule verification, precise caliper measurements, and density testing. Every certified specimen receives an individualized tamper-proof registry number accessible through our digital verification portal.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-600" />
            Vedic Consecration & Secure Fulfillment
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Prior to shipping, all sacred items undergo traditional Vedic energization rituals. Orders are encased in tamper-evident packaging and dispatched with live tracking, backed by convenient payment options including eSewa, Khalti, International Cards, and Cash on Delivery.
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
