"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";

/**
 * DevSessionInit checks if the server was restarted (new `npm run dev`).
 * If a new server run is detected, it ensures the user starts with a clean slate:
 * - Cart is cleared (0 items)
 * - Any existing signed-in session is logged out
 */
export function DevSessionInit() {
  useEffect(() => {
    fetch("/api/system/dev-instance")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data?.instanceId) return;

        const storedInstanceId = localStorage.getItem("rudrakart_server_instance_id");

        // If this is a new server start (different instanceId or first time after reboot)
        if (storedInstanceId !== data.instanceId) {
          // Clear cart
          try {
            useCartStore.getState().clearCart();
            localStorage.removeItem("rudrakart-cart-storage-v2");
          } catch {
            // ignore
          }

          // Invalidate cookie & sign out from any active session
          try {
            document.cookie = "next-auth.session-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "__Secure-next-auth.session-token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            signOut({ redirect: false }).catch(() => {});
          } catch {
            // ignore
          }

          // Store current instance ID
          localStorage.setItem("rudrakart_server_instance_id", data.instanceId);
        }
      })
      .catch(() => {
        // Silently continue if offline
      });
  }, []);

  return null;
}
