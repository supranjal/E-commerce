import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  Award,
  MapPin,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sacred-950 text-sacred-200 pt-16 pb-12 border-t border-sacred-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-sacred-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-saffron-700 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-gold-300" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Rudra<span className="text-saffron-500">Kart</span>
              </span>
            </Link>
            <p className="text-xs text-sacred-300 leading-relaxed max-w-sm">
              Your trusted destination for authentic Himalayan Rudraksha beads, sacred malas, and consecrated puja accessories sourced directly from Nepal.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-gold-400 font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-gold-400" /> Lab Tested
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Sacred Mukhis
            </h3>
            <ul className="space-y-2 text-xs text-sacred-300">
              <li>
                <Link
                  href="/rudraksha/1-mukhi"
                  className="hover:text-saffron-400 transition-colors"
                >
                  1 Mukhi Chandrakar Rudraksha
                </Link>
              </li>
              <li>
                <Link
                  href="/rudraksha/5-mukhi"
                  className="hover:text-saffron-400 transition-colors"
                >
                  5 Mukhi Kalagni Rudraksha
                </Link>
              </li>
              <li>
                <Link
                  href="/rudraksha/7-mukhi"
                  className="hover:text-saffron-400 transition-colors"
                >
                  7 Mukhi Mahalakshmi
                </Link>
              </li>
              <li>
                <Link
                  href="/rudraksha/14-mukhi"
                  className="hover:text-saffron-400 transition-colors"
                >
                  14 Mukhi Devamani
                </Link>
              </li>
              <li>
                <Link
                  href="/rudraksha/gauri-shankar"
                  className="hover:text-saffron-400 transition-colors"
                >
                  Gauri Shankar Sacred Pair
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Trust & Transparency
            </h3>
            <ul className="space-y-2 text-xs text-sacred-300">
              <li>
                <Link
                  href="/certificate-verification"
                  className="text-gold-400 font-semibold hover:text-gold-300 transition-colors"
                >
                  Verify Certificate ID
                </Link>
              </li>
              <li>
                <Link
                  href="/authenticity"
                  className="hover:text-saffron-400 transition-colors"
                >
                  Rudraksha Information
                </Link>
              </li>
              <li>
                <Link
                  href="/authenticity"
                  className="hover:text-saffron-400 transition-colors"
                >
                  Sample Data Notice
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-saffron-400 transition-colors"
                >
                  About the Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Sanctum & Contact */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Sanctum & Contact
            </h3>
            <div className="space-y-2 text-xs text-sacred-300">
              <p className="text-[11px] text-sacred-400 leading-relaxed">
                Direct Himalayan sourcing and consecrated quality laboratory based in Kathmandu, Nepal.
              </p>
              <div className="flex items-center gap-2 text-sacred-300 pt-1">
                <MapPin className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                <span>Kathmandu / Sankhuwasabha, Nepal</span>
              </div>
              <div className="flex items-center gap-2 text-sacred-300">
                <Mail className="w-3.5 h-3.5 text-saffron-500 flex-shrink-0" />
                <span>support@rudrakart.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sacred-400">
          <p>
            © 2026 RudraKart. All rights reserved. Consecrated Himalayan Specimen Registry.
          </p>
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-1 rounded bg-emerald-800/80 border border-emerald-700 text-[10px] text-emerald-100">
              eSewa
            </span>
            <span className="px-2 py-1 rounded bg-purple-900/80 border border-purple-800 text-[10px] text-purple-100">
              Khalti
            </span>
            <span className="px-2 py-1 rounded bg-blue-900/80 border border-blue-800 text-[10px] text-blue-100">
              International Card
            </span>
            <span className="px-2 py-1 rounded bg-sacred-900 border border-sacred-800 text-[10px] text-sacred-300">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
