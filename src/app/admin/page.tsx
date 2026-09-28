import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Award,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getAdminCatalog } from "@/actions/product-actions";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  const { products } = await getAdminCatalog();
  const lowStock = products.filter((p) => p.stock <= 3);
  const certifiedCount = products.filter((p) => p.isCertified).length;

  let pendingOrdersCount = 0;
  let recentOrders: any[] = [];

  try {
    pendingOrdersCount = await prisma.order.count({
      where: { status: { in: ["PENDING", "CONFIRMED", "PROCESSING"] } },
    });
    recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  } catch (err) {
    // If DB offline, maintain 0 / empty
  }

  const stats = [
    {
      title: "Active Catalog Specimens",
      value: products.length,
      desc: "Live items across all categories",
      icon: Package,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Lab-Certified Beads",
      value: certifiedCount,
      desc: "Documented with verified X-ray serials",
      icon: Award,
      color: "text-gold-700 bg-gold-50",
    },
    {
      title: "Active Processing Orders",
      value: `${pendingOrdersCount} ${pendingOrdersCount === 1 ? "Order" : "Orders"}`,
      desc: "Pending, confirmed, or in fulfillment",
      icon: ShoppingCart,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      title: "Low-Stock Warnings",
      value: `${lowStock.length} Items`,
      desc: "Specimens with <= 3 remaining units",
      icon: AlertTriangle,
      color: "text-amber-700 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-sacred-950">
          Executive Operations Overview
        </h1>
        <p className="text-xs text-muted-foreground">
          Real-time metrics for RudraKart catalog inventory, active customer
          orders, and transaction audit trails.
        </p>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="border-sacred-200 bg-white shadow-xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium block">
                    {stat.title}
                  </span>
                  <span className="font-serif text-2xl font-bold text-sacred-950 block">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {stat.desc}
                  </span>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Columns: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Overview */}
        <div className="bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sacred-100 pb-3">
            <h3 className="font-serif text-base font-bold text-sacred-950 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-saffron-700" />
              Recent Orders from Database
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-saffron-700 hover:underline font-semibold"
            >
              View All Orders
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-lg bg-sacred-50/70 border border-sacred-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sacred-950">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-muted-foreground block text-[11px]">
                    Customer: {ord.customerName} ({ord.customerEmail})
                  </span>
                  <span className="font-bold text-saffron-800">
                    {ord.currency} {ord.total.toLocaleString()}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ord.status === "DELIVERED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {ord.status}
                </span>
              </div>
            ))}

            {recentOrders.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">
                No orders recorded in database yet. New checkout orders will
                appear here automatically.
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sacred-100 pb-3">
            <h3 className="font-serif text-base font-bold text-sacred-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Low-Stock Inventory Warnings
            </h3>
            <Link
              href="/admin/products"
              className="text-xs text-saffron-700 hover:underline font-semibold"
            >
              Manage Catalog
            </Link>
          </div>

          <div className="space-y-3">
            {lowStock.map((prod) => (
              <div
                key={prod.id}
                className="p-3 rounded-lg bg-sacred-50/70 border border-sacred-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-serif font-bold text-sacred-900 block">
                    {prod.name}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Origin: {prod.origin} • Price: Rs.{" "}
                    {prod.price.toLocaleString()}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded font-bold bg-amber-100 text-amber-800 text-[11px]">
                  {prod.stock} units left
                </span>
              </div>
            ))}

            {lowStock.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">
                All catalog specimens have healthy inventory levels (&gt; 3
                units).
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Direct Administrative Shortcuts */}
      <div className="bg-white p-6 rounded-2xl border border-sacred-200 shadow-xs space-y-4">
        <h3 className="font-serif text-base font-bold text-sacred-950 border-b border-sacred-100 pb-3">
          Quick Management Tasks
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            href="/admin/products"
            className="p-4 rounded-xl border border-sacred-200 bg-sacred-50 hover:bg-saffron-50 hover:border-saffron-300 transition-colors space-y-1 block"
          >
            <Package className="w-5 h-5 text-saffron-700" />
            <span className="font-bold text-sacred-950 block">
              Manage Specimens
            </span>
            <span className="text-muted-foreground text-[11px]">
              Add new beads, adjust prices, edit stocks
            </span>
          </Link>

          <Link
            href="/admin/orders"
            className="p-4 rounded-xl border border-sacred-200 bg-sacred-50 hover:bg-saffron-50 hover:border-saffron-300 transition-colors space-y-1 block"
          >
            <ShoppingCart className="w-5 h-5 text-saffron-700" />
            <span className="font-bold text-sacred-950 block">
              Orders & Shipments
            </span>
            <span className="text-muted-foreground text-[11px]">
              Update order statuses and dispatch tracking
            </span>
          </Link>

          <Link
            href="/admin/security/transactions"
            className="p-4 rounded-xl border border-sacred-200 bg-sacred-50 hover:bg-saffron-50 hover:border-saffron-300 transition-colors space-y-1 block"
          >
            <ShieldCheck className="w-5 h-5 text-saffron-700" />
            <span className="font-bold text-sacred-950 block">
              Cryptographic Security
            </span>
            <span className="text-muted-foreground text-[11px]">
              Audit SHA-256 hashes and RSA digital signatures
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
