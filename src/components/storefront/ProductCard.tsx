"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShieldCheck, ShoppingBag } from "lucide-react";
import { ProductItem } from "@/types";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const [cartMessage, setCartMessage] = useState("");
  const { addItem, currency, usdRate } = useCartStore();
  const primaryImage = getProductImageUrl(product);

  return (
    <div className="group relative flex flex-col rounded-xl border border-sacred-200 bg-white overflow-hidden shadow-sm hover:shadow-elevated transition-all duration-300">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-sacred-950">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.mukhi && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-sacred-950/95 text-gold-300 border border-gold-500/40 backdrop-blur shadow-sm">
              {product.mukhi} Mukhi
            </span>
          )}
          {product.isSpecial && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-saffron-700 text-white shadow-sm">
              Special Rare
            </span>
          )}
        </div>

        {(product.isCertified || (product.certificates && product.certificates.length > 0)) && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm backdrop-blur">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Certified
            </span>
          </div>
        )}

        {/* Quick View Link */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`View ${product.name}`}
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-4 justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-saffron-800">{product.origin}</span>
            {product.certificates?.[0]?.certificateNumber ? (
              <span className="font-mono text-[10px] text-muted-foreground bg-sacred-100/80 px-1.5 py-0.5 rounded border border-sacred-200">
                {product.certificates[0].certificateNumber}
              </span>
            ) : product.size ? (
              <span className="font-semibold text-stone-600">
                {product.size}
              </span>
            ) : null}
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif text-base font-bold text-sacred-950 line-clamp-1 group-hover:text-saffron-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-sacred-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-stone-500 font-semibold block uppercase tracking-wider">
              Price
            </span>
            <span className="text-base font-extrabold text-sacred-950">
              {formatPrice(product.price, currency, usdRate)}
            </span>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={(e) => {
              e.preventDefault();
              setCartMessage(addItem(product, 1) ? "Added" : "Stock limit");
            }}
            disabled={product.stock <= 0}
            className="gap-1.5 text-xs font-bold"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock <= 0 ? "Out of stock" : cartMessage || "Add"}
          </Button>
        </div>
      </div>
    </div>
  );
}
