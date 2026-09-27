import Link from "next/link";
import { Award, ShieldCheck, CheckCircle2, Search, ExternalLink, Plus } from "lucide-react";
import { MOCK_CERTIFICATES, MOCK_PRODUCTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function AdminCertificatesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sacred-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-sacred-950">
            Certificate & Laboratory Registry
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage authenticated X-ray radiograph serials and public verification records.
          </p>
        </div>

        <Button variant="primary" size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Issue New Certificate
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-sacred-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sacred-100/80 border-b border-sacred-200 font-serif font-bold text-sacred-900 uppercase tracking-wider">
              <tr>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Associated Specimen</th>
                <th className="p-4">Mukhi / Origin</th>
                <th className="p-4">Caliber & Weight</th>
                <th className="p-4">X-Ray Status</th>
                <th className="p-4">Inspection Date</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Public Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sacred-100">
              {MOCK_CERTIFICATES.map((cert) => {
                const prod = MOCK_PRODUCTS.find((p) => p.id === cert.productId);

                return (
                  <tr key={cert.id} className="hover:bg-sacred-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-saffron-800">
                      {cert.certificateNumber}
                    </td>
                    <td className="p-4 font-serif font-semibold text-sacred-950 max-w-[200px] truncate">
                      {prod?.name || "Nepali Rudraksha"}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold block">{cert.mukhi} Mukhi</span>
                      <span className="text-[11px] text-muted-foreground">{cert.origin}</span>
                    </td>
                    <td className="p-4">
                      <span>{cert.dimensions}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        {cert.weightGrams} grams
                      </span>
                    </td>
                    <td className="p-4 max-w-[200px] truncate text-muted-foreground">
                      {cert.xrayStatus}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(cert.inspectionDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {cert.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                        <Link
                          href={`/certificate-verification?id=${cert.certificateNumber}`}
                          target="_blank"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
