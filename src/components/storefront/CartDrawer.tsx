"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalItems,
    getSubtotal,
    currency,
    usdRate,
  } = useCartStore();

  const totalCount = getTotalItems();
  const subtotal = getSubtotal();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Trigger Button in Navigation */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full text-sacred-800 hover:text-saffron-800 hover:bg-sacred-100 transition-colors"
        aria-label="Shopping Cart"
      >
        <ShoppingBag className="w-5 h-5" />
        {mounted && totalCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-saffron-700 px-1 text-[10px] font-bold text-white shadow">
            {totalCount}
          </span>
        )}
      </button>

      {/* Slide-over Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-sacred-200 shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-sacred-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-saffron-700" />
                  <h2 className="font-serif text-lg font-bold text-sacred-900">
                    Your Sacred Cart ({totalCount})
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-sacred-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-sacred-100 flex items-center justify-center mx-auto text-sacred-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium text-sacred-800">
                      Your sacred cart is currently empty.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      <Link href="/products">Browse Authentic Rudraksha</Link>
                    </Button>
                  </div>
                ) : (
                  items.map(({ product, quantity }) => {
                    const img = getProductImageUrl(product);

                    return (
                      <div
                        key={product.id}
                        className="flex gap-4 p-3 rounded-lg border border-sacred-200 bg-sacred-50/50"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-sacred-100 flex-shrink-0">
                          <Image
                            src={img}
                            alt={product.name}
                            fill
                            className="object-cover"
                            quality={70}
                            sizes="64px"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-serif text-sm font-semibold text-sacred-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs font-bold text-saffron-800">
                            {formatPrice(product.price, currency, usdRate)}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            {/* Quantity Controls */}
                            <div className="flex items-center rounded-md border border-sacred-300 bg-white">
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity - 1)
                                }
                                className="p-1 text-muted-foreground hover:text-foreground"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(product.id, quantity + 1)
                                }
                                className="p-1 text-muted-foreground hover:text-foreground"
                                disabled={quantity >= product.stock}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeItem(product.id)}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer / Checkout Button */}
              {items.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-sacred-200 bg-sacred-50/70 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-serif text-lg font-bold text-sacred-900">
                      {formatPrice(subtotal, currency, usdRate)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full gap-2 justify-center"
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      <Link href="/checkout">
                        Proceed to Secure Checkout{" "}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => setIsOpen(false)}
                      asChild
                    >
                      <Link href="/cart">View Full Cart Page</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
