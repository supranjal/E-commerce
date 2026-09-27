"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { confirmCommercialOrderPayment } from "@/actions/order-actions";

function EsewaPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const orderNumber = searchParams.get("order") || "RK-2026-DEMO";
  const amount = searchParams.get("amount") || "1800";

  const [esewaId, setEsewaId] = useState("9841234567");
  const [password, setPassword] = useState("1234");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const gatewayTxn = `TXN-ESEWA-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const confirmation = await confirmCommercialOrderPayment({
        orderNumber,
        paymentMethod: "ESEWA",
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
        `/order-success/${orderNumber}?method=ESEWA&txn=${txn}&amount=${amount}&commercial=${commercial}&confirmedAt=${encodeURIComponent(
          confirmedAt
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border-2 border-[#60BB46]/40 shadow-xl overflow-hidden">
      {/* eSewa Header */}
      <div className="bg-[#60BB46] p-6 text-white text-center space-y-2">
        <div className="inline-flex items-center justify-center bg-white text-[#60BB46] font-bold text-xl px-4 py-1.5 rounded-lg shadow-sm">
          eSewa
        </div>
        <p className="text-xs text-emerald-100 font-medium">
          Demo Payment Gateway Sandbox (Nepal)
        </p>
      </div>

      {/* Order Summary Box */}
      <div className="p-6 bg-emerald-50/60 border-b border-emerald-100 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Merchant:</span>
          <span className="font-bold text-emerald-950">RudraKart Himalayan Organics</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Reference:</span>
          <span className="font-mono font-bold text-emerald-950">{orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-emerald-200/70">
          <span className="font-bold text-emerald-950">Total Amount:</span>
          <span className="font-bold text-emerald-800 text-base">Rs. {amount}</span>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePay} className="p-6 space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-sacred-900">eSewa ID / Mobile Number</label>
          <input
            type="text"
            value={esewaId}
            onChange={(e) => setEsewaId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 focus:outline-none focus:ring-2 focus:ring-[#60BB46] text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-sacred-900">MPIN / Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 focus:outline-none focus:ring-2 focus:ring-[#60BB46] text-sm"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#60BB46] hover:bg-[#52A33B] text-white font-bold py-3 text-sm rounded-lg shadow-md"
        >
          {loading ? "Authorizing eSewa Transaction..." : `Pay Rs. ${amount}`}
        </Button>

        <div className="text-[11px] text-center text-muted-foreground pt-1">
          Academic Simulation: Click Pay to test instant order confirmation.
        </div>
      </form>
    </div>
  );
}

export default function EsewaPaymentSimulator() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F2F7F2]">
      <Suspense fallback={<div className="p-6 text-center text-xs">Loading eSewa Gateway...</div>}>
        <EsewaPaymentContent />
      </Suspense>
    </div>
  );
}
