"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    currency,
    usdRate,
  } = useCartStore();

  const subtotal = getSubtotal();
  const total = subtotal;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-sacred-100 flex items-center justify-center mx-auto text-sacred-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-sacred-950">
            Your Sacred Cart is Empty
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You have not added any products yet. Browse the catalog to get
            started.
          </p>
        </div>
        <Button variant="primary" size="lg" asChild>
          <Link href="/products" className="gap-2">
            Explore Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sacred-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sacred-950">
            Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>
          <p className="text-xs text-muted-foreground">
            Review your selected products and quantities before checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-semibold self-start sm:self-auto"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => {
            const img = getProductImageUrl(product);

            return (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-sacred-200 bg-white shadow-xs"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-sacred-100 flex-shrink-0 border border-sacred-200">
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-serif text-base font-bold text-sacred-950 hover:text-saffron-700 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-saffron-800">
                        {product.origin}
                      </span>
                      {product.size && <span>• {product.size}</span>}
                    </div>
                    <div className="text-xs font-bold text-sacred-900">
                      Unit: {formatPrice(product.price, currency, usdRate)}
                    </div>
                  </div>
                </div>

                {/* Quantity & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-sacred-100">
                  {/* Quantity Controller */}
                  <div className="flex items-center rounded-lg border border-sacred-300 bg-sacred-50">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-sacred-700 hover:text-sacred-950 hover:bg-sacred-100 rounded-l-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-serif font-bold text-xs">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-sacred-700 hover:text-sacred-950 hover:bg-sacred-100 rounded-r-lg"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal for this item */}
                  <div className="text-right min-w-[100px]">
                    <span className="font-serif text-base font-bold text-sacred-950 block">
                      {formatPrice(product.price * quantity, currency, usdRate)}
                    </span>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1 ml-auto pt-0.5"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-700 hover:text-saffron-900"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-sacred-200 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-sacred-950 border-b border-sacred-100 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Subtotal</span>
              <span className="font-semibold text-sacred-900">
                {formatPrice(subtotal, currency, usdRate)}
              </span>
            </div>

            <div className="pt-3 border-t border-sacred-200 flex justify-between items-baseline">
              <span className="font-serif text-base font-bold text-sacred-950">
                Total Amount
              </span>
              <span className="font-serif text-xl font-bold text-saffron-800">
                {formatPrice(total, currency, usdRate)}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full gap-2 shadow-md"
            asChild
          >
            <Link href="/checkout">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
