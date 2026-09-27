"use client";

import { useState } from "react";
import { ShieldCheck, Award, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { CertificateItem } from "@/types";
import { Button } from "@/components/ui/button";

interface CertificateModalProps {
  certificate: CertificateItem;
  productName: string;
}

export function CertificateModal({
  certificate,
  productName,
}: CertificateModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-50 border border-gold-300/80 text-gold-900 hover:bg-gold-100 transition-colors text-xs font-semibold shadow-sm"
      >
        <Award className="w-4 h-4 text-gold-700" />
        <span>View Authenticity Certificate ({certificate.certificateNumber})</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="relative w-full max-w-xl rounded-2xl bg-white border-2 border-gold-400 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-sacred-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Banner */}
            <div className="text-center space-y-2 border-b-2 border-gold-200 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sacred-900 text-gold-400 text-xs font-serif uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                Certificate of Authenticity
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-sacred-900">
                RudraKart Himalayan Laboratory
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                Certificate Ref: {certificate.certificateNumber}
              </p>
            </div>

            {/* Spec Table */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200">
                <span className="text-muted-foreground block">Item Description</span>
                <span className="font-semibold text-sacred-900">{productName}</span>
              </div>
              <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200">
                <span className="text-muted-foreground block">Mukhi Facets</span>
                <span className="font-semibold text-sacred-900">
                  {certificate.mukhi ? `${certificate.mukhi} Mukhi (Natural)` : "Conjoined Sacred"}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200">
                <span className="text-muted-foreground block">Botanical Origin</span>
                <span className="font-semibold text-sacred-900">{certificate.origin}</span>
              </div>
              <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200">
                <span className="text-muted-foreground block">Weight & Size</span>
                <span className="font-semibold text-sacred-900">
                  {certificate.weightGrams ? `${certificate.weightGrams}g` : "Standard"} / {certificate.dimensions || "N/A"}
                </span>
              </div>
            </div>

            {/* Laboratory Test Findings */}
            <div className="space-y-3 p-4 rounded-xl bg-sacred-50 border border-sacred-200">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-sacred-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-saffron-700" />
                Non-Destructive Laboratory Examination
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-sacred-900 block">X-Ray Radiograph Inspection:</span>
                  <p className="text-muted-foreground">{certificate.xrayStatus}</p>
                </div>
                <div>
                  <span className="font-semibold text-sacred-900 block">Microscopic Ridge Examination:</span>
                  <p className="text-muted-foreground">{certificate.microscopicCheck}</p>
                </div>
              </div>
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-sacred-200 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Status: {certificate.verificationStatus}
              </div>
              <span className="text-muted-foreground">
                Date: {new Date(certificate.inspectionDate).toLocaleDateString()}
              </span>
            </div>

            <div className="text-[11px] text-muted-foreground text-center italic bg-amber-50/70 p-2 rounded border border-amber-200">
              * Sample academic certificate dataset for RudraKart educational verification.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
