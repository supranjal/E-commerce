import Link from "next/link";
import { CheckCircle2, Award, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintInvoiceButton } from "@/components/storefront/PrintInvoiceButton";

interface OrderSuccessPageProps {
  params: {
    id: string;
  };
  searchParams: {
    method?: string;
    txn?: string;
    amount?: string;
    commercial?: string;
    confirmedAt?: string;
  };
}

export default function OrderSuccessPage({
  params,
  searchParams,
}: OrderSuccessPageProps) {
  const orderNumber = params.id;
  const paymentMethod = searchParams.method || "ONLINE";
  const transactionId = searchParams.txn || `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
  const commercialConfirmationId = searchParams.commercial || "COM-PENDING";
  const confirmedAt = searchParams.confirmedAt
    ? decodeURIComponent(searchParams.confirmedAt)
    : new Date().toISOString();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      {/* Success Badge Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sacred-950">
          Sacred Order Confirmed
        </h1>
        <p className="text-sm text-muted-foreground">
          Thank you for choosing certified authenticity. Your order has been registered in the laboratory queue for consecration and secure dispatch.
        </p>
      </div>

      {/* Invoice Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-sacred-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sacred-200 pb-4">
          <div>
            <span className="text-xs text-muted-foreground block">Order Reference</span>
            <span className="font-mono text-xl font-bold text-sacred-950">
              {orderNumber}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-muted-foreground block">Payment Status</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {paymentMethod === "COD" ? "Cash on Delivery" : "Paid & Verified"}
            </span>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200">
            <span className="text-muted-foreground block">Payment Channel</span>
            <span className="font-semibold text-sacred-950">{paymentMethod}</span>
          </div>

          <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200">
            <span className="text-muted-foreground block">Transaction Ref</span>
            <span className="font-mono font-semibold text-sacred-950 truncate block">
              {transactionId}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-sacred-50 border border-sacred-200 col-span-2 sm:col-span-1">
            <span className="text-muted-foreground block">Estimated Delivery</span>
            <span className="font-semibold text-sacred-950">2 - 4 Business Days</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 col-span-2 sm:col-span-3">
            <span className="text-emerald-700 block">Commercial Confirmation</span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-1">
              <span className="font-mono font-bold text-emerald-900">{commercialConfirmationId}</span>
              <span className="text-emerald-800">Confirmed: {new Date(confirmedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Guarantee Notes */}
        <div className="p-4 rounded-xl bg-gold-50/70 border border-gold-300 space-y-2 text-xs">
          <h4 className="font-serif font-bold text-sacred-950 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-700" />
            What Happens Next?
          </h4>
          <ul className="space-y-1 text-sacred-800 list-disc list-inside">
            <li>Your Rudraksha undergoes final optical and digital X-ray inspection.</li>
            <li>A printed physical laboratory certificate card is enclosed in the packaging.</li>
            <li>The package is secured with a tamper-evident holographic seal before handover to courier.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sacred-200">
          <PrintInvoiceButton />

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/certificate-verification">Verify Lab Database</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/products" className="gap-1.5">
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
