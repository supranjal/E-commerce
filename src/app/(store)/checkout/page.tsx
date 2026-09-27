"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Wallet,
  Truck,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import { createOrder } from "@/actions/order-actions";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart, currency, usdRate } = useCartStore();
  const subtotal = getSubtotal();

  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ESEWA");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Nepal",
    postalCode: "44600",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/account/profile")
      .then(async (response) => {
        if (response.ok) {
          const profile = await response.json();
          setIsAuthenticated(true);
          if (profile) {
            setFormData((current) => ({
              ...current,
              name: profile.name || current.name,
              email: profile.email || current.email,
              phone: profile.phone || current.phone,
              address: profile.address || current.address,
            }));
          }
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setAuthChecking(false));
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-sacred-950">
          Your cart is currently empty
        </h2>
        <p className="text-xs text-muted-foreground">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Button variant="primary" asChild>
          <Link href="/products">Browse Sacred Rudraksha</Link>
        </Button>
      </div>
    );
  }

  if (authChecking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-saffron-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">
          Verifying secure checkout session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
        <div className="rounded-2xl bg-white border border-sacred-200 shadow-md p-6 sm:p-10 space-y-8">
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-saffron-100 text-saffron-800 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
              Sign In to Complete Your Order
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              An authenticated account is required to generate your encrypted order audit, verify serial certificates, and provide dispatch tracking.
            </p>
          </div>

          {/* Cart Summary Guarantee */}
          <div className="p-4 sm:p-5 rounded-xl bg-sacred-50 border border-sacred-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Your cart ({items.length} item{items.length > 1 ? "s" : ""}) is saved & ready:
              </span>
              <p className="text-sacred-800 font-serif font-bold text-sm">
                Total: {formatPrice(subtotal, currency, usdRate)}
              </p>
            </div>
            <span className="text-[11px] text-muted-foreground bg-white px-3 py-1.5 rounded-lg border border-sacred-200 self-start sm:self-auto">
              Cart preserved after login
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link href="/login?callbackUrl=/checkout">
                Sign In to Proceed <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/register?callbackUrl=/checkout">
                Create New Customer Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
        notes: formData.notes,
        paymentMethod,
        currency,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
      };

      const res = await createOrder(orderPayload);

      if (res.success && res.orderNumber) {
        // Direct based on payment method
        if (paymentMethod === "ESEWA") {
          router.push(
            `/checkout/payment/esewa?order=${res.orderNumber}&amount=${res.total}&currency=${currency}`
          );
        } else if (paymentMethod === "KHALTI") {
          router.push(
            `/checkout/payment/khalti?order=${res.orderNumber}&amount=${res.total}&currency=${currency}`
          );
        } else if (paymentMethod === "CARD") {
          router.push(
            `/checkout/payment/stripe?order=${res.orderNumber}&amount=${res.total}&currency=${currency}`
          );
        } else {
          // Cash on Delivery
          clearCart();
          router.push(`/order-success/${res.orderNumber}?method=COD`);
        }
      }
    } catch (error) {
      alert("Checkout error. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-sacred-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-sacred-950">
          Secure Sacred Checkout
        </h1>
        <p className="text-xs text-muted-foreground">
          Direct dispatch from Kathmandu Quality Lab with tamper-evident seal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Shipping & Payment Method */}
        <div className="lg:col-span-7 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-sacred-950 flex items-center gap-2">
              <Truck className="w-5 h-5 text-saffron-700" />
              1. Delivery & Recipient Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-sacred-900">Recipient Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sacred-900">Email Address (for certificate & tracking)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sacred-900">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sacred-900">City / District</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-sacred-900">Street Address / Landmark</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sacred-900">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-sacred-900">Postal / Zip Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-sacred-900">Special Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Please call recipient upon arrival"
                  className="w-full px-3 py-2 rounded-lg border border-sacred-300 bg-sacred-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-saffron-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-sacred-950 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-saffron-700" />
              2. Select Payment Gateway
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* eSewa */}
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === "ESEWA"
                    ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                    : "border-sacred-200 bg-white hover:bg-sacred-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="ESEWA"
                    checked={paymentMethod === "ESEWA"}
                    onChange={() => setPaymentMethod("ESEWA")}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-emerald-800 block text-sm">
                      eSewa Mobile Wallet
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Demo Simulated Nepal Gateway
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                  eSewa
                </span>
              </label>

              {/* Khalti */}
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === "KHALTI"
                    ? "border-purple-600 bg-purple-50/50 shadow-xs"
                    : "border-sacred-200 bg-white hover:bg-sacred-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="KHALTI"
                    checked={paymentMethod === "KHALTI"}
                    onChange={() => setPaymentMethod("KHALTI")}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="font-bold text-purple-900 block text-sm">
                      Khalti Digital Wallet
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Demo Simulated Nepal Gateway
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-700 text-white">
                  Khalti
                </span>
              </label>

              {/* Stripe Card */}
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === "CARD"
                    ? "border-blue-600 bg-blue-50/50 shadow-xs"
                    : "border-sacred-200 bg-white hover:bg-sacred-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={paymentMethod === "CARD"}
                    onChange={() => setPaymentMethod("CARD")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-blue-950 block text-sm">
                      International Card (Stripe-style)
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Visa, Mastercard, Amex (Sandbox)
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                  Card
                </span>
              </label>

              {/* Cash On Delivery */}
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === "CASH_ON_DELIVERY"
                    ? "border-amber-600 bg-amber-50/50 shadow-xs"
                    : "border-sacred-200 bg-white hover:bg-sacred-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="font-bold text-amber-950 block text-sm">
                      Cash on Delivery
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Pay upon physical inspection
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-700 text-white">
                  COD
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-sacred-200 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-sacred-950 border-b border-sacred-100 pb-3">
            Review Selected Items ({items.length})
          </h3>

          <div className="divide-y divide-sacred-100 max-h-64 overflow-y-auto space-y-3 pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="pt-3 flex items-center gap-3 text-xs">
                <div className="relative w-12 h-12 rounded bg-sacred-100 flex-shrink-0 overflow-hidden">
                  <Image
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sacred-900 block truncate">
                    {product.name}
                  </span>
                  <span className="text-muted-foreground">Qty: {quantity}</span>
                </div>
                <span className="font-bold text-sacred-950">
                  {formatPrice(product.price * quantity, currency, usdRate)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-3 border-t border-sacred-200 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-sacred-900">
                {formatPrice(subtotal, currency, usdRate)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Express Insured Sourcing Delivery</span>
              <span className="font-semibold text-emerald-700">FREE</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Certificate Serial Verification</span>
              <span className="font-semibold text-emerald-700">INCLUDED</span>
            </div>
            <div className="pt-3 border-t border-sacred-200 flex justify-between items-baseline">
              <span className="font-serif text-base font-bold text-sacred-950">
                Total Payable
              </span>
              <span className="font-serif text-2xl font-bold text-saffron-800">
                {formatPrice(subtotal, currency, usdRate)}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full gap-2 shadow-md text-base"
          >
            {loading ? "Processing Order..." : `Proceed with ${paymentMethod}`} <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 pt-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            256-bit Encrypted Academic Sandbox Checkout
          </div>
        </div>
      </form>
    </div>
  );
}
