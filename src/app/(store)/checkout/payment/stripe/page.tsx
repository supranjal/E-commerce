"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { confirmCommercialOrderPayment } from "@/actions/order-actions";

function StripePaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, currency, usdRate } = useCartStore();

  const orderNumber = searchParams.get("order") || "RK-2026-DEMO";
  const amount = Number(searchParams.get("amount") || "1800");

  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [name, setName] = useState("Aarav Sharma");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const gatewayTxn = `TXN-STRIPE-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const confirmation = await confirmCommercialOrderPayment({
        orderNumber,
        paymentMethod: "CARD",
        gatewayTransactionId: gatewayTxn,
        amount,
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
        `/order-success/${orderNumber}?method=CARD&txn=${txn}&amount=${amount}&commercial=${commercial}&confirmedAt=${encodeURIComponent(
          confirmedAt
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-sacred-200 shadow-2xl p-6 sm:p-8 space-y-6">
      {/* Stripe Header */}
      <div className="space-y-1 pb-4 border-b border-sacred-200">
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-sacred-950">
            International Card Checkout
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
            Stripe Sandbox
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Order Reference: <span className="font-mono font-bold text-sacred-900">{orderNumber}</span>
        </p>
      </div>

      {/* Amount */}
      <div className="p-4 rounded-xl bg-sacred-50 border border-sacred-200 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">Total Charge</span>
        <span className="font-serif text-xl font-bold text-sacred-950">
          {formatPrice(amount, currency, usdRate)}
        </span>
      </div>

      {/* Card Input Form */}
      <form onSubmit={handlePay} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-sacred-900">Cardholder Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-sacred-900">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-sacred-900">Expiry (MM/YY)</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-sacred-900">CVC / CVV</label>
            <input
              type="password"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm rounded-lg shadow-md"
        >
          {loading ? "Authorizing Card Payment..." : `Pay ${formatPrice(amount, currency, usdRate)}`}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-2">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          End-to-End SSL Encrypted International Gateway
        </div>
      </form>
    </div>
  );
}

export default function StripePaymentSimulator() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-sacred-100/40">
      <Suspense fallback={<div className="p-6 text-center text-xs">Loading Card Gateway...</div>}>
        <StripePaymentContent />
      </Suspense>
    </div>
  );
}
