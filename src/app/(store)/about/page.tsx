import Link from "next/link";
import { Sparkles, ShieldCheck, MapPin, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-100 text-saffron-900 border border-saffron-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-saffron-700" />
          Our Heritage & Mission
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sacred-950">
          About RudraKart
        </h1>
        <p className="text-base text-sacred-800 leading-relaxed max-w-2xl mx-auto">
          Born at the intersection of reverence for sacred Himalayan flora and modern empirical laboratory standards.
        </p>
      </div>

      <div className="prose prose-sacred max-w-none text-sacred-800 text-sm sm:text-base leading-relaxed space-y-6">
        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-saffron-700" />
            Direct High-Altitude Himalayan Sourcing
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nepal&apos;s eastern district of Sankhuwasabha and Dingla are globally recognized as the natural habitat of genuine Elaeocarpus ganitrus. The high altitude, pristine alpine soil, and mountain microclimate produce large, dense, and deeply grooved Rudrakshas found nowhere else on earth.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Empirical Transparency Over Unverifiable Superstition
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            While we respect the sacred millennia-old cultural heritage surrounding Rudraksha, RudraKart firmly refuses to make superstitious claims such as guaranteed instant wealth or medical panaceas. Instead, our value proposition is grounded in <strong>radiological X-ray certification</strong>, botanical authenticity, and transparent origin documentation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sacred-200 shadow-xs space-y-3">
          <h2 className="font-serif text-xl font-bold text-sacred-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-600" />
            Academic E-Commerce Architecture
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            RudraKart is developed as a comprehensive 6th Semester BSc CSIT E-Commerce project demonstrating full-stack modern architecture: Next.js App Router, Prisma ORM, PostgreSQL on Neon, Auth.js role-based security, rule-based recommendation algorithms, and simulated multi-currency payment gateways for Nepal (eSewa, Khalti) and International checkout.
          </p>
        </div>
      </div>

      <div className="pt-4 text-center">
        <Button variant="primary" size="lg" asChild>
          <Link href="/products" className="gap-2">
            Explore Certified Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
