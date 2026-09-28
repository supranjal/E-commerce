import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Details",
  robots: { index: false, follow: false },
};

interface OrderPageProps {
  params: { id: string };
}

export default async function OrderSuccessPage({ params }: OrderPageProps) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/order-success/${params.id}`)}`,
    );
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber: params.id, userId },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sacred-950">
          Order received
        </h1>
        <p className="text-sm text-muted-foreground">
          Your order has been saved. Payment and fulfillment statuses below
          reflect the current order record.
        </p>
      </div>

      <section className="bg-white p-6 sm:p-8 rounded-xl border border-sacred-200 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block">Order reference</span>
            <span className="font-mono font-bold">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Order status</span>
            <span className="font-semibold">{order.status}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Payment status</span>
            <span className="font-semibold">{order.paymentStatus}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Total</span>
            <span className="font-semibold">
              {order.currency} {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="border-t border-sacred-200 pt-4 space-y-3">
          <h2 className="font-serif text-lg font-bold">Items</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>
                {order.currency} {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-sacred-200 pt-4">
          <Button variant="outline" asChild>
            <Link href="/account">View your orders</Link>
          </Button>
          <Button variant="primary" asChild>
            <Link href="/products">Continue shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
