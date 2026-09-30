import { verifyCertificate } from "@/actions/certificate-actions";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Award,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Scale,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certificate Reference Lookup",
  description:
    "Look up a RudraKart certificate reference and view the record available for that identifier.",
  alternates: { canonical: "/certificate-verification" },
};

interface CertificateVerificationPageProps {
  searchParams: {
    id?: string;
  };
}

export default async function CertificateVerificationPage({
  searchParams,
}: CertificateVerificationPageProps) {
  const queryId = searchParams.id || "";
  let verificationResult: any = null;

  if (queryId) {
    verificationResult = await verifyCertificate(queryId);
  }

  const sampleIds = [
    "RK-DEMO-00001",
    "RK-DEMO-00002",
    "RK-DEMO-00005",
    "RK-DEMO-00007",
    "RK-DEMO-00014",
    "RK-DEMO-00015",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300 text-gold-900 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-4 h-4 text-gold-700" />
          RudraKart Authenticity & Verification Registry
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sacred-950">
          Verify Certificate of Authenticity
        </h1>

        <p className="text-sm sm:text-base text-sacred-800 max-w-xl mx-auto leading-relaxed">
          Enter the unique serialized certificate number printed on your
          RudraKart documentation or card to review non-destructive laboratory
          examination records.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-sacred-200 shadow-md space-y-4">
        <form
          action="/certificate-verification"
          method="GET"
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              name="id"
              defaultValue={queryId}
              placeholder="e.g. RK-DEMO-00001"
              className="w-full pl-11 pr-4 py-3 text-base rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600 font-mono"
              required
            />
          </div>
          <Button type="submit" variant="primary" size="lg" className="sm:w-36">
            Verify ID
          </Button>
        </form>

        {/* Demo Quick Try IDs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-muted-foreground">Try Sample Demo IDs:</span>
          {sampleIds.map((id) => (
            <Link
              key={id}
              href={`/certificate-verification?id=${id}`}
              className="px-2 py-1 rounded bg-sacred-100 text-sacred-900 hover:bg-gold-100 hover:text-gold-900 border border-sacred-200 font-mono transition-colors"
            >
              {id}
            </Link>
          ))}
        </div>
      </div>

      {/* Verification Result Display */}
      {verificationResult && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
          {verificationResult.success && verificationResult.certificate ? (
            <div className="rounded-2xl bg-white border-2 border-gold-400 p-6 sm:p-10 shadow-xl space-y-8">
              {/* Verified Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-gold-200">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Record Status:{" "}
                    {verificationResult.certificate.verificationStatus}
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-sacred-950">
                    {verificationResult.productName}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono">
                    Certificate Number:{" "}
                    {verificationResult.certificate.certificateNumber}
                  </p>
                </div>

                {verificationResult.productSlug && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/products/${verificationResult.productSlug}`}
                      className="gap-1.5"
                    >
                      View Product Page <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Verified Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-sacred-50 border border-sacred-200 space-y-1">
                  <span className="text-muted-foreground block">
                    Mukhi Facets
                  </span>
                  <span className="font-serif text-lg font-bold text-sacred-950">
                    {verificationResult.certificate.mukhi} Mukhi
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-sacred-50 border border-sacred-200 space-y-1">
                  <span className="text-muted-foreground block">
                    Botanical Origin
                  </span>
                  <span className="font-semibold text-sacred-950">
                    {verificationResult.certificate.origin}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-sacred-50 border border-sacred-200 space-y-1">
                  <span className="text-muted-foreground block">
                    Weight (Grams)
                  </span>
                  <span className="font-serif text-lg font-bold text-sacred-950">
                    {verificationResult.certificate.weightGrams
                      ? `${verificationResult.certificate.weightGrams} g`
                      : "Standard"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-sacred-50 border border-sacred-200 space-y-1">
                  <span className="text-muted-foreground block">
                    Dimensions
                  </span>
                  <span className="font-semibold text-sacred-950">
                    {verificationResult.certificate.dimensions || "N/A"}
                  </span>
                </div>
              </div>

              {/* Detailed Laboratory Test Results */}
              <div className="space-y-4 p-6 rounded-xl bg-sacred-50/80 border border-sacred-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-saffron-700" />
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-sacred-950">
                    Non-Destructive Laboratory Findings
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-white border border-sacred-200 space-y-1.5">
                    <span className="font-bold text-sacred-900 block flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-saffron-700" />{" "}
                      Digital X-Ray Radiograph
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {verificationResult.certificate.xrayStatus}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-white border border-sacred-200 space-y-1.5">
                    <span className="font-bold text-sacred-900 block flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />{" "}
                      Microscopic Cellular Analysis
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {verificationResult.certificate.microscopicCheck}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground border-t border-sacred-200">
                  <span>
                    Testing Body: {verificationResult.certificate.laboratory}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Tested On:{" "}
                    {new Date(
                      verificationResult.certificate.inspectionDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-center text-emerald-800 bg-emerald-50/80 p-3 rounded-lg border border-emerald-200 flex items-center justify-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Official Laboratory Record: Dimensions, locules, and physical properties verified by RudraKart Quality Assurance Lab.
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-red-900">
                Certificate Not Found
              </h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">
                {verificationResult.error}
              </p>
              <div className="pt-2">
                <Link
                  href="/certificate-verification"
                  className="text-xs font-semibold text-red-800 underline hover:text-red-950"
                >
                  Clear and try another Certificate ID
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
