"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  getSandboxPaymentOrder,
  confirmDummyCardPayment,
} from "@/actions/payment-actions";

function DummyCardPaymentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const orderNumber = searchParams.get("order") || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [amountLabel, setAmountLabel] = useState("");
  const [currency, setCurrency] = useState<"NPR" | "USD">("NPR");
  const [customerName, setCustomerName] = useState("");

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (!orderNumber) {
      setError("Missing order reference.");
      setLoading(false);
      return;
    }

    getSandboxPaymentOrder(orderNumber).then((result) => {
      if (!result.success) {
        setError(result.error || "Unable to load this order.");
        setLoading(false);
        return;
      }

      if (result.order.paymentMethod !== "CARD") {
        setError("This order was placed with a different payment method.");
        setLoading(false);
        return;
      }

      if (result.order.paymentStatus === "PAID") {
        clearCart();
        router.replace(`/order-success/${result.order.orderNumber}?method=CARD`);
        return;
      }

      if (result.order.status === "CANCELLED") {
        setError("This order was cancelled.");
        setLoading(false);
        return;
      }

      const ordCurrency = (result.order.currency as "NPR" | "USD") || "NPR";
      setCurrency(ordCurrency);
      setAmountLabel(formatPrice(result.order.total, ordCurrency));
      setCustomerName(result.order.customerName || "");
      setCardholderName(result.order.customerName || "RUDRAKART PATRON");
      setLoading(false);
    });
  }, [orderNumber, router, clearCart]);

  const handleFillTestCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardholderName(customerName || "RUDRAKART PATRON");
    setExpiry("12/28");
    setCvv("888");
    setError("");
  };

  const handleCardNumberChange = (value: string) => {
    // Only numbers and format with space every 4 digits
    const raw = value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const result = await confirmDummyCardPayment({
        orderNumber,
        cardNumber,
        cardholderName,
        expiry,
        cvv,
      });

      if (!result.success) {
        setError(result.error || "Payment was rejected. Please review card details.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order-success/${result.orderNumber}?method=CARD`);
    } catch {
      setError("An unexpected error occurred during payment processing.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">
          Loading secure international payment terminal...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Top Brand Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-blue-600" />
          International Secure Payment Terminal
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
          Complete Card Checkout
        </h1>
        <p className="text-xs text-stone-600">
          Order Reference: <span className="font-mono font-bold text-sacred-900">{orderNumber}</span>
        </p>
      </div>

      {/* Visual Credit Card Preview */}
      <div className="relative mx-auto w-full max-w-sm aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-sacred-950 via-slate-900 to-blue-950 text-white p-6 shadow-2xl border border-white/20 flex flex-col justify-between overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span className="font-serif font-bold text-sm tracking-wide text-sacred-100">
              Rudra<span className="text-gold-400">Kart</span> Pay
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-blue-300 uppercase px-2 py-0.5 rounded bg-white/10">
            TEST MODE
          </span>
        </div>

        {/* Card Chip & Contactless */}
        <div className="flex items-center gap-3 z-10 my-1">
          <div className="w-10 h-7 rounded bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/40 shadow-inner flex items-center justify-center">
            <div className="w-6 h-4 border border-amber-700/30 rounded-xs" />
          </div>
        </div>

        {/* Card Number */}
        <div className="z-10 font-mono text-lg sm:text-xl font-bold tracking-widest text-white/95 drop-shadow-sm">
          {cardNumber || "•••• •••• •••• ••••"}
        </div>

        {/* Bottom Details */}
        <div className="flex items-end justify-between z-10 text-xs">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-sacred-300 block font-sans">
              Cardholder
            </span>
            <span className="font-mono font-semibold tracking-wide uppercase truncate max-w-[180px] block">
              {cardholderName || "CARDHOLDER NAME"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider text-sacred-300 block font-sans">
              Expires
            </span>
            <span className="font-mono font-semibold">
              {expiry || "MM/YY"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Payment Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-sacred-100">
          <div>
            <span className="text-xs text-stone-500 block">Total Due</span>
            <span className="font-serif text-2xl font-bold text-sacred-950">
              {amountLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillTestCard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Fill Test Card
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePay} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-sacred-900">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-sacred-900">Cardholder Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
              placeholder="e.g. AARAV SHARMA"
              className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-sacred-900">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono text-center"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-sacred-900">CVC / CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="888"
                maxLength={4}
                className="w-full px-3 py-2.5 rounded-lg border border-sacred-300 bg-sacred-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-mono text-center"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Safe International Test Simulation:</strong> Use test card <strong>4242 •••• 4242</strong> with any future expiration date and 3-digit CVV.
            </span>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md gap-2 text-sm transition-all"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay {amountLabel} Now
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/checkout"
            className="text-xs text-stone-500 hover:text-stone-800 underline"
          >
            ← Back to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DummyCardPayment() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-4 text-xs text-muted-foreground">
          Loading payment gateway...
        </div>
      }
    >
      <DummyCardPaymentInner />
    </Suspense>
  );
}
