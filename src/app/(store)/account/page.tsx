import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { User, Package, MapPin, Award, LogOut, ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if ((session.user as any).role === "ADMIN") redirect("/admin");

  const sessionUser = session.user as any;
  const customer = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: { include: { certificates: true } },
            },
          },
        },
      },
    },
  });
  const customerName = customer?.name || sessionUser.name || "Customer";
  const customerEmail = customer?.email || sessionUser.email || "";
  const customerPhone = customer?.phone || "Not provided";
  const customerAddress = customer?.address || "Not provided";
  const orders = customer?.orders || [];
  const initials = customerName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sacred-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-sacred-950">
            Customer Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your personal profile, active orders, and certificate verification records.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs text-red-600 hover:text-red-700" asChild>
          <SignOutButton />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-saffron-100 text-saffron-800 flex items-center justify-center font-serif font-bold text-lg">
              {initials}
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-sacred-950">
                {customerName}
              </h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Verified Customer
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs border-t border-sacred-100 pt-4">
            <div>
              <span className="text-muted-foreground block">Email</span>
              <span className="font-medium text-sacred-900">{customerEmail}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Phone</span>
              <span className="font-medium text-sacred-900">{customerPhone}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Default Shipping Address</span>
              <span className="font-medium text-sacred-900">{customerAddress}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-sacred-100">
            <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
              <Link href="/account/wallet">
                <Wallet className="w-3.5 h-3.5 text-saffron-700" />
                Open RudraKart Wallet
              </Link>
            </Button>
          </div>
        </div>

        {/* Orders Overview */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-sacred-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-sacred-950 flex items-center gap-2">
              <Package className="w-5 h-5 text-saffron-700" />
              Order History ({orders.length})
            </h3>
            <span className="text-xs text-muted-foreground">Recent Purchases</span>
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-sacred-50/70 border border-sacred-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sacred-950">{order.orderNumber}</span>
                    <span className="text-muted-foreground">• {order.createdAt.toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sacred-900 text-sm">
                    {order.items.map((item) => item.product.name).join(", ") || "Rudraksha order"}
                  </h4>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="font-bold text-saffron-800">
                      {order.currency} {order.total.toLocaleString()}
                    </span>
                    {order.items[0]?.product.certificates[0] && (
                      <Link
                        href={`/certificate-verification?id=${order.items[0].product.certificates[0].certificateNumber}`}
                        className="inline-flex items-center gap-1 text-gold-700 hover:underline font-semibold"
                      >
                        <Award className="w-3.5 h-3.5" /> Cert: {order.items[0].product.certificates[0].certificateNumber}
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <Link
                    href={`/order-success/${order.orderNumber}`}
                    className="text-[11px] text-saffron-700 hover:underline font-semibold"
                  >
                    View Invoice
                  </Link>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">
                No orders have been placed from this account yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
