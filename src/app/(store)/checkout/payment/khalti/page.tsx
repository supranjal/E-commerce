"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { confirmCommercialOrderPayment } from "@/actions/order-actions";

function KhaltiPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const orderNumber = searchParams.get("order") || "RK-2026-DEMO";
  const amount = searchParams.get("amount") || "1800";

  const [mobile, setMobile] = useState("9801234567");
  const [pin, setPin] = useState("9999");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const gatewayTxn = `TXN-KHALTI-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const confirmation = await confirmCommercialOrderPayment({
        orderNumber,
        paymentMethod: "KHALTI",
        gatewayTransactionId: gatewayTxn,
        amount: Number(amount),
      });

      clearCart();

      const txn =
        confirmation.success && confirmation.transactionId
          ? confirmation.transactionId
          : gatewayTxn;
      const commercial =
        confirmation.success && confirmation.commercialConfirmationId
          ? confirmation.commercialConfirmationId
          : "COM-PENDING";
      const confirmedAt =
        confirmation.success && confirmation.confirmedAt
          ? confirmation.confirmedAt
          : new Date().toISOString();

      router.push(
        `/order-success/${orderNumber}?method=KHALTI&txn=${txn}&amount=${amount}&commercial=${commercial}&confirmedAt=${encodeURIComponent(
          confirmedAt
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border-2 border-[#5C2D91]/30 shadow-xl overflow-hidden">
      {/* Khalti Header */}
      <div className="bg-[#5C2D91] p-6 text-white text-center space-y-2">
        <div className="inline-flex items-center justify-center bg-white text-[#5C2D91] font-bold text-xl px-4 py-1.5 rounded-lg shadow-sm">
          Khalti
        </div>
        <p className="text-xs text-purple-100 font-medium">
          Khalti Digital Wallet Sandbox Portal (Nepal)
        </p>
      </div>

      {/* Order Info */}
      <div className="p-6 bg-purple-50/50 border-b border-purple-100 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Store:</span>
          <span className="font-bold text-purple-950">RudraKart Nepal</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order ID:</span>
          <span className="font-mono font-bold text-purple-950">{orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-purple-200/70">
          <span className="font-bold text-purple-950">Amount:</span>
          <span className="font-bold text-purple-800 text-base">Rs. {amount}</span>
        </div>
      </div>

      {/* Khalti Form */}
      <form onSubmit={handlePay} className="p-6 space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-sacred-900">Khalti Registered Number</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 focus:outline-none focus:ring-2 focus:ring-[#5C2D91] text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-sacred-900">Khalti MPIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 focus:outline-none focus:ring-2 focus:ring-[#5C2D91] text-sm"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5C2D91] hover:bg-[#482274] text-white font-bold py-3 text-sm rounded-lg shadow-md"
        >
          {loading ? "Verifying with Khalti..." : `Pay Rs. ${amount}`}
        </Button>

        <div className="text-[11px] text-center text-muted-foreground pt-1">
          Academic Simulation: Click Pay to complete transaction.
        </div>
      </form>
    </div>
  );
}

export default function KhaltiPaymentSimulator() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F8F4FC]">
      <Suspense fallback={<div className="p-6 text-center text-xs">Loading Khalti Gateway...</div>}>
        <KhaltiPaymentContent />
      </Suspense>
    </div>
  );
}
