"use client";

import { signOut } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";

export function SignOutButton({ className = "" }: { className?: string }) {
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <button
      type="button"
      onClick={() => {
        clearCart();
        signOut({ callbackUrl: "/login" });
      }}
      className={className}
    >
      Sign Out
    </button>
  );
}
