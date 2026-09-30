"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import {
  updatePendingOrderPaymentMethod,
  cancelAndReturnToCart,
} from "@/actions/order-actions";
import { PaymentMethod } from "@/types";

interface PendingOrderActionsProps {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    total: number;
    currency: string;
  };
  compact?: boolean;
}

export function PendingOrderActions({
  order,
  compact = false,
}: PendingOrderActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [loading, setLoading] = useState(false);
  const [showSwitch, setShowSwitch] = useState(false);
  const [error, setError] = useState("");
  const [currentMethod, setCurrentMethod] = useState(order.paymentMethod);

  // If order is paid or cancelled, nothing to act on
  if (
    order.paymentStatus === "PAID" ||
    order.status === "CANCELLED" ||
    (order.paymentMethod === "CASH_ON_DELIVERY" && order.status === "CONFIRMED")
  ) {
    return null;
  }

  const getPaymentUrl = (method: string) => {
    if (method === "KHALTI") {
      return `/checkout/payment/khalti?order=${order.orderNumber}&amount=${order.total}&currency=${order.currency}`;
    }
    if (method === "ESEWA") {
      return `/checkout/payment/esewa?order=${order.orderNumber}&amount=${order.total}&currency=${order.currency}`;
    }
    if (method === "CARD") {
      return `/checkout/payment/stripe?order=${order.orderNumber}&amount=${order.total}&currency=${order.currency}`;
    }
    return `/order-success/${order.orderNumber}?method=COD`;
  };

  const handleProceedPayment = () => {
    router.push(getPaymentUrl(currentMethod));
  };

  const handleSwitchMethod = async (newMethod: PaymentMethod) => {
    setLoading(true);
    setError("");
    try {
      const res = await updatePendingOrderPaymentMethod({
        orderNumber: order.orderNumber,
        newPaymentMethod: newMethod,
      });

      if (!res.success) {
        setError(res.error || "Could not switch payment method.");
        setLoading(false);
        return;
      }

      setCurrentMethod(newMethod);
      setShowSwitch(false);
      setLoading(false);

      if (res.isCOD) {
        router.refresh();
      } else {
        router.push(getPaymentUrl(newMethod));
      }
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleReturnToCart = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await cancelAndReturnToCart(order.orderNumber);
      if (!res.success || !res.items) {
        setError(res.error || "Could not return items to cart.");
        setLoading(false);
        return;
      }

      // Add each item back to cart
      for (const item of res.items) {
        addItem(item.product as any, item.quantity);
      }

      router.push("/cart");
    } catch {
      setError("Failed to return items to cart.");
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-2 text-xs ${compact ? "pt-1" : "pt-3 border-t border-sacred-200"}`}>
      {error && (
        <div className="p-2 rounded bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* Proceed to Payment Button */}
        {currentMethod !== "CASH_ON_DELIVERY" && (
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={handleProceedPayment}
            className="h-8 gap-1.5 text-xs bg-saffron-700 hover:bg-saffron-800 text-white font-bold shadow-xs"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CreditCard className="w-3.5 h-3.5" />
            )}
            Complete Payment ({currentMethod})
          </Button>
        )}

        {/* Change Payment Method Toggle */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => setShowSwitch(!showSwitch)}
          className="h-8 gap-1 text-xs border-sacred-300 text-sacred-900 bg-white"
        >
          <span>Change Method</span>
          <ChevronDown className="w-3 h-3" />
        </Button>

        {/* Return to Cart Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleReturnToCart}
          className="h-8 gap-1.5 text-xs border-sacred-300 text-stone-700 hover:bg-stone-50 bg-white"
        >
          <ShoppingCart className="w-3.5 h-3.5 text-stone-600" />
          Re-add to Cart
        </Button>
      </div>

      {/* Switch Method Dropdown Panel */}
      {showSwitch && (
        <div className="p-3 rounded-xl bg-white border border-sacred-200 shadow-md space-y-2 animate-in fade-in duration-150">
          <span className="font-bold text-[11px] text-sacred-950 block">
            Select New Payment Method for Order #{order.orderNumber}:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              disabled={loading || currentMethod === "ESEWA"}
              onClick={() => handleSwitchMethod("ESEWA")}
              className={`p-2 rounded-lg border text-center font-bold text-[11px] transition-colors ${
                currentMethod === "ESEWA"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                  : "bg-sacred-50 hover:bg-white border-sacred-200 text-sacred-900"
              }`}
            >
              eSewa Wallet
            </button>

            <button
              type="button"
              disabled={loading || currentMethod === "KHALTI"}
              onClick={() => handleSwitchMethod("KHALTI")}
              className={`p-2 rounded-lg border text-center font-bold text-[11px] transition-colors ${
                currentMethod === "KHALTI"
                  ? "bg-purple-50 border-purple-500 text-purple-800"
                  : "bg-sacred-50 hover:bg-white border-sacred-200 text-sacred-900"
              }`}
            >
              Khalti Wallet
            </button>

            <button
              type="button"
              disabled={loading || currentMethod === "CARD"}
              onClick={() => handleSwitchMethod("CARD")}
              className={`p-2 rounded-lg border text-center font-bold text-[11px] transition-colors ${
                currentMethod === "CARD"
                  ? "bg-blue-50 border-blue-500 text-blue-800"
                  : "bg-sacred-50 hover:bg-white border-sacred-200 text-sacred-900"
              }`}
            >
              International Card
            </button>

            <button
              type="button"
              disabled={loading || currentMethod === "CASH_ON_DELIVERY"}
              onClick={() => handleSwitchMethod("CASH_ON_DELIVERY")}
              className={`p-2 rounded-lg border text-center font-bold text-[11px] transition-colors ${
                currentMethod === "CASH_ON_DELIVERY"
                  ? "bg-amber-50 border-amber-500 text-amber-800"
                  : "bg-sacred-50 hover:bg-white border-sacred-200 text-sacred-900"
              }`}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
