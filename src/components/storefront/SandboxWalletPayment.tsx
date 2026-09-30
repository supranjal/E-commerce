"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  cancelSandboxWalletPayment,
  confirmSandboxWalletPayment,
  failSandboxWalletPayment,
  getSandboxPaymentOrder,
} from "@/actions/payment-actions";
import {
  ESEWA_SANDBOX_IDS,
  ESEWA_SANDBOX_MPIN,
  ESEWA_SANDBOX_PASSWORD,
  ESEWA_SANDBOX_TOKEN,
  KHALTI_SANDBOX_IDS,
  KHALTI_SANDBOX_MPIN,
  KHALTI_SANDBOX_OTP,
  type WalletGateway,
} from "@/lib/payments/sandbox";

interface SandboxWalletPaymentProps {
  gateway: WalletGateway;
}

function SandboxWalletPaymentInner({ gateway }: SandboxWalletPaymentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const orderNumber = searchParams.get("order") || "";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [amountLabel, setAmountLabel] = useState("");
  const [orderPaymentStatus, setOrderPaymentStatus] = useState<string>("PENDING");
  const [esewaId, setEsewaId] = useState<string>(ESEWA_SANDBOX_IDS[0]);
  const [password, setPassword] = useState("");
  const [mpin, setMpin] = useState("");
  const [token, setToken] = useState("");
  const [mobile, setMobile] = useState<string>(KHALTI_SANDBOX_IDS[0]);
  const [otp, setOtp] = useState("");

  const isEsewa = gateway === "ESEWA";

  useEffect(() => {
    if (!orderNumber) {
      setError("Missing order reference.");
      setLoading(false);
      return;
    }

    getSandboxPaymentOrder(orderNumber).then((result) => {
      if (!result.success) {
        setError(result.error || "Unable to load this payment.");
        setLoading(false);
        return;
      }
      if (result.order.paymentMethod !== gateway) {
        setError("This order belongs to a different payment method.");
        setLoading(false);
        return;
      }
      if (result.order.paymentStatus === "PAID") {
        clearCart();
        router.replace(`/order-success/${result.order.orderNumber}`);
        return;
      }
      if (result.order.status === "CANCELLED") {
        setError("This order was cancelled.");
        setLoading(false);
        return;
      }
      setOrderPaymentStatus(result.order.paymentStatus);
      setAmountLabel(formatPrice(result.order.total, "NPR"));
      setLoading(false);
    });
  }, [orderNumber, gateway, router, clearCart]);

  const handleSimulateFailure = async () => {
    setSubmitting(true);
    setError("");
    const result = await failSandboxWalletPayment(orderNumber);
    if (!result.success) {
      setError(result.error || "Could not mark payment as failed.");
    } else {
      setOrderPaymentStatus("FAILED");
      setError("Payment simulated as FAILED. You can re-enter credentials and retry, or cancel the order.");
    }
    setSubmitting(false);
  };

  const handlePay = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await confirmSandboxWalletPayment(
      isEsewa
        ? {
            orderNumber,
            gateway,
            esewaId,
            password,
            mpin,
            token,
          }
        : {
            orderNumber,
            gateway,
            mobile,
            mpin,
            otp,
          },
    );

    if (!result.success) {
      setError(result.error || "Payment failed.");
      setOrderPaymentStatus("FAILED");
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/order-success/${result.orderNumber}`);
  };

  const handleCancel = async () => {
    setSubmitting(true);
    const result = await cancelSandboxWalletPayment(orderNumber);
    if (!result.success) {
      setError(result.error || "Could not cancel payment.");
      setSubmitting(false);
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center text-sm text-muted-foreground">
        Opening {isEsewa ? "eSewa" : "Khalti"} sandbox...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden ${
          isEsewa
            ? "border-emerald-200 bg-white"
            : "border-purple-200 bg-white"
        }`}
      >
        <div
          className={`px-6 py-4 text-white ${
            isEsewa ? "bg-emerald-600" : "bg-purple-700"
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider opacity-90">
            Official sandbox credentials · academic demo
          </p>
          <h1 className="font-serif text-2xl font-bold">
            {isEsewa ? "eSewa" : "Khalti"} Payment
          </h1>
          <p className="text-sm opacity-90">Merchant: RudraKart</p>
        </div>

        <form onSubmit={handlePay} className="p-6 space-y-4 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-sacred-50 border border-sacred-200 px-4 py-3">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-serif text-lg font-bold text-sacred-950">
              {amountLabel || "—"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-muted-foreground">Current Payment Status</span>
            <span
              className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                orderPaymentStatus === "FAILED"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-amber-100 text-amber-900 border border-amber-200"
              }`}
            >
              {orderPaymentStatus}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Order {orderNumber}. No live wallet is charged. Stock is reserved until
            you pay or cancel.
          </p>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}

          {isEsewa ? (
            <>
              <label className="block space-y-1">
                <span className="font-semibold">eSewa ID</span>
                <input
                  value={esewaId}
                  onChange={(e) => setEsewaId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="font-semibold">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="font-semibold">MPIN</span>
                <input
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="font-semibold">Token</span>
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300"
                  required
                />
              </label>
              <div className="text-[11px] rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-900 space-y-1">
                <p className="font-semibold">eSewa RC test login</p>
                <p>ID: {ESEWA_SANDBOX_IDS.join(", ")}</p>
                <p>Password: {ESEWA_SANDBOX_PASSWORD}</p>
                <p>
                  MPIN: {ESEWA_SANDBOX_MPIN} · Token: {ESEWA_SANDBOX_TOKEN}
                </p>
              </div>
            </>
          ) : (
            <>
              <label className="block space-y-1">
                <span className="font-semibold">Khalti mobile</span>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="font-semibold">MPIN</span>
                <input
                  type="password"
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300"
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="font-semibold">OTP</span>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300"
                  required
                />
              </label>
              <div className="text-[11px] rounded-lg bg-purple-50 border border-purple-200 p-3 text-purple-950 space-y-1">
                <p className="font-semibold">Khalti test login</p>
                <p>Mobile: {KHALTI_SANDBOX_IDS.join(", ")}</p>
                <p>
                  MPIN: {KHALTI_SANDBOX_MPIN} · OTP: {KHALTI_SANDBOX_OTP}
                </p>
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting || !orderNumber}
            className={`w-full ${
              isEsewa
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {submitting ? "Processing sandbox payment..." : `Pay with ${isEsewa ? "eSewa" : "Khalti"}`}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={handleSimulateFailure}
              className="text-xs text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800"
            >
              Simulate Failure
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={handleCancel}
              className="text-xs"
            >
              Cancel & restore stock
            </Button>
          </div>
        </form>
      </div>

      <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        Amount is taken from the saved order, not from the URL.
      </p>
      <p className="text-center text-xs">
        <Link href="/checkout" className="text-saffron-700 hover:underline">
          Return to checkout
        </Link>
      </p>
    </div>
  );
}

export function SandboxWalletPayment({ gateway }: SandboxWalletPaymentProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-sm text-muted-foreground">
          Loading sandbox...
        </div>
      }
    >
      <SandboxWalletPaymentInner gateway={gateway} />
    </Suspense>
  );
}
