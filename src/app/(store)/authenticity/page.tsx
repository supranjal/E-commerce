import Link from "next/link";
import {
  ShieldCheck,
  Microscope,
  Layers,
  Award,
  AlertOctagon,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthenticityPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-100 border border-saffron-300 text-saffron-950 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-saffron-700" />
          Transparency & Botanical Integrity
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sacred-950 tracking-tight">
          The Science of Rudraksha Authenticity
        </h1>

        <p className="text-sm sm:text-base text-sacred-800 max-w-2xl mx-auto leading-relaxed">
          At RudraKart, we bridge reverent Himalayan tradition with empirical botanical science. Learn how we verify genuine Nepali Elaeocarpus ganitrus beads.
        </p>
      </div>

      {/* Sourcing Distinction: Nepal vs Other Origins */}
      <section className="space-y-6">
        <div className="border-b border-sacred-200 pb-3">
          <h2 className="font-serif text-2xl font-bold text-sacred-900">
            1. Why Nepali Rudraksha is Highly Revered
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Geographical and botanical factors that make high-altitude Himalayan specimens unique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <Card className="border-emerald-300 bg-emerald-50/40">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base font-serif">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Nepali Rudraksha (Sankhuwasabha / Dingla)
              </div>
              <ul className="space-y-2 text-sacred-800">
                <li>• <strong>Larger Size:</strong> Typically ranges between 18mm to 30mm+.</li>
                <li>• <strong>Deep Natural Mukhi Grooves:</strong> Prominent, deeply cleft natural lines running from the top pore to the bottom.</li>
                <li>• <strong>Internal Compartments:</strong> Symmetrical internal locules containing mature seeds.</li>
                <li>• <strong>Wood Density:</strong> Dense, naturally oily endocarp with high durability lasting generations.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sacred-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-sacred-900 font-bold text-base font-serif">
                <ShieldCheck className="w-5 h-5 text-sacred-500" />
                Indonesian (Java) Rudraksha
              </div>
              <ul className="space-y-2 text-sacred-700">
                <li>• <strong>Smaller Size:</strong> Typically ranges between 3mm to 12mm.</li>
                <li>• <strong>Subtle Mukhi Lines:</strong> Fainter surface fissures with flatter endocarp.</li>
                <li>• <strong>Common Use:</strong> Ideal for lightweight daily wristbands and high bead count malas.</li>
                <li>• <strong>Value:</strong> Natural and authentic, but distinct in size and weight from collector Nepali beads.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Non-Destructive Lab Procedures */}
      <section className="space-y-6">
        <div className="border-b border-sacred-200 pb-3">
          <h2 className="font-serif text-2xl font-bold text-sacred-900">
            2. Laboratory Verification Procedures
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Methods utilized by authenticity laboratories to examine high-value rare Rudraksha without damaging the bead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-sacred-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <Layers className="w-8 h-8 text-saffron-700" />
              <h3 className="font-serif text-base font-bold text-sacred-900">
                Digital X-Ray Radiography
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Visualizes the internal seed locules (chambers) non-destructively. In an authentic bead, the number of internal compartments must correspond to the exterior Mukhi lines.
              </p>
            </CardContent>
          </Card>

          <Card className="border-sacred-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <Microscope className="w-8 h-8 text-saffron-700" />
              <h3 className="font-serif text-base font-bold text-sacred-900">
                Microscopic Ridge Analysis
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-magnification optical inspection to verify that the thorny projections and facial clefts are organically grown cellular wood, detecting glued or carved alterations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-sacred-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <Award className="w-8 h-8 text-gold-600" />
              <h3 className="font-serif text-base font-bold text-sacred-900">
                Density & Caliber Metric
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Precision digital vernier calipers and analytical micro-balances document exact millimeters and gram weight for unique certificate registry.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Debunking Common Myths */}
      <section className="space-y-6">
        <div className="border-b border-sacred-200 pb-3">
          <h2 className="font-serif text-2xl font-bold text-sacred-900">
            3. Debunking Traditional Testing Myths
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Why popular folklore tests like the water-floating or copper coin rotation test are scientifically unreliable.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white border border-sacred-200 flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-sacred-950">
                The Water Floating Myth (Sinking = Real, Floating = Fake)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Botanical Fact:</strong> An authentic ripe, dry Rudraksha seed containing air within its seed cavities may float on water, while an unripe or dense bead sinks. Unscrupulous manufacturers can also inject lead or heavy resins into fake beads to make them sink. Floating or sinking does NOT scientifically verify Mukhi authenticity.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-sacred-200 flex items-start gap-4">
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-sacred-950">
                The Copper Coin Rotation Test
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Physical Fact:</strong> Any spherical or ribbed object placed between two flat copper coins will rotate due to subtle hand tremors, uneven friction, and gravitational tilt. It is not an electromagnetic property unique to authentic Rudraksha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl bg-sacred-950 text-white p-8 text-center space-y-4 border border-gold-500/30">
        <h3 className="font-serif text-2xl font-bold">
          Experience Genuine Himalayan Transparency
        </h3>
        <p className="text-xs sm:text-sm text-sacred-300 max-w-xl mx-auto">
          Explore our certified collection or look up an existing specimen using our live certificate verification tool.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button variant="primary" size="lg" asChild>
            <Link href="/products">Explore Catalog</Link>
          </Button>
          <Button variant="outline" size="lg" className="border-sacred-700 bg-sacred-900 text-white" asChild>
            <Link href="/certificate-verification">Verify Certificate ID</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
