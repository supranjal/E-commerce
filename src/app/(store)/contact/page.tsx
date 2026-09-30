import { MapPin, Mail, Phone, Clock } from "lucide-react";
import type { Metadata } from "next";
import { ContactInquiryForm } from "@/components/storefront/ContactInquiryForm";

export const metadata: Metadata = {
  title: "Contact RudraKart",
  description:
    "Contact RudraKart with questions about products, orders, or certificate verification.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-sacred-950">
          Contact RudraKart
        </h1>
        <p className="text-base text-sacred-800 max-w-xl mx-auto leading-relaxed">
          Have questions about specific Mukhis, laboratory certificates, or
          order shipping? Reach out to our customer care team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-bold text-sacred-950">
            Himalayan Headquarters
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-saffron-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sacred-900">
                  Kathmandu Office & Quality Lab
                </span>
                <span className="text-muted-foreground">
                  Baluwatar-04, Kathmandu, Bagmati Province, Nepal
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-saffron-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sacred-900">
                  Sourcing Depot
                </span>
                <span className="text-muted-foreground">
                  Chainpur, Sankhuwasabha District, Koshi Province, Nepal
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-saffron-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sacred-900">
                  Email Inquiries
                </span>
                <span className="text-muted-foreground">
                  support@rudrakart.com
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-saffron-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sacred-900">
                  Helpline
                </span>
                <span className="text-muted-foreground">
                  +977 1 4412345 / +977 9801234567
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-saffron-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sacred-900">
                  Support Hours
                </span>
                <span className="text-muted-foreground">
                  Sunday - Friday: 9:00 AM - 6:00 PM NPT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
          <h2 className="font-serif text-xl font-bold text-sacred-950">
            Send an Inquiry
          </h2>
          <ContactInquiryForm />
        </div>
      </div>
    </div>
  );
}
