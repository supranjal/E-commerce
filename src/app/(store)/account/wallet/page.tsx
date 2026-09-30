import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Wallet",
  robots: { index: false, follow: false },
};

export default async function WalletPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/wallet");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
      <Wallet className="w-10 h-10 mx-auto text-sacred-500" />
      <h1 className="font-serif text-2xl font-bold text-sacred-950">
        Wallet payments happen at checkout
      </h1>
      <p className="text-sm text-muted-foreground">
        RudraKart does not keep a store credit wallet. Pay at checkout with the
        eSewa or Khalti academic sandbox, or choose Cash on Delivery.
      </p>
      <Button variant="outline" asChild>
        <Link href="/checkout">Go to checkout</Link>
      </Button>
    </div>
  );
}
