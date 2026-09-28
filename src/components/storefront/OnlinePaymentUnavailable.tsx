import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OnlinePaymentUnavailable() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
      <CreditCard className="w-10 h-10 mx-auto text-sacred-500" />
      <h1 className="font-serif text-2xl font-bold text-sacred-950">
        Online payment is unavailable
      </h1>
      <p className="text-sm text-muted-foreground">
        No payment gateway is connected, so no online payment was processed.
        Return to checkout and select Cash on Delivery.
      </p>
      <Button variant="outline" asChild>
        <Link href="/checkout">Return to checkout</Link>
      </Button>
    </div>
  );
}
