"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Plus, Minus, Check, ShieldCheck } from "lucide-react";
import { ProductItem } from "@/types";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductDetailActionsProps {
  product: ProductItem;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, currency, usdRate } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="space-y-6 pt-4 border-t border-sacred-200">
      {/* Price Display */}
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Price (Inclusive of all lab testing & taxes)
        </span>
        <div className="text-3xl sm:text-4xl font-serif font-bold text-sacred-950">
          {formatPrice(product.price, currency, usdRate)}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="flex items-center gap-2 text-xs">
        {product.stock > 0 ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            In Stock ({product.stock} unique {product.stock === 1 ? "specimen" : "specimens"} available)
          </span>
        ) : (
          <span className="font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
            Currently Out of Stock
          </span>
        )}
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center justify-between sm:justify-start rounded-lg border border-sacred-300 bg-white p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 text-sacred-700 hover:text-sacred-950 hover:bg-sacred-100 rounded-md transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 font-serif font-bold text-sacred-900 text-sm">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
            className="p-2 text-sacred-700 hover:text-sacred-950 hover:bg-sacred-100 rounded-md transition-colors"
            disabled={quantity >= (product.stock || 10)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex-1 gap-2 shadow-md"
        >
          {added ? (
            <>
              <Check className="w-4 h-4" /> Added to Sacred Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </>
          )}
        </Button>

        <Button
          variant="sacred"
          size="lg"
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className="gap-2 shadow-md bg-sacred-900 text-gold-300 hover:bg-sacred-950"
        >
          <Zap className="w-4 h-4 text-gold-400" /> Buy Now
        </Button>
      </div>
    </div>
  );
}
