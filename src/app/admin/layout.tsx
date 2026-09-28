import Link from "next/link";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Award,
  Boxes,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const adminNav = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products & Stock", href: "/admin/products", icon: Package },
    {
      label: "Orders & Fulfillment",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Transaction Security",
      href: "/admin/security/transactions",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen flex bg-sacred-100/50 text-foreground">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-sacred-950 text-sacred-200 flex flex-col justify-between p-4 border-r border-sacred-800 flex-shrink-0 hidden md:flex">
        <div className="space-y-6">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-saffron-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-gold-300" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white tracking-tight block">
                RudraKart
              </span>
              <span className="text-[10px] text-gold-400 font-semibold tracking-wider uppercase">
                Admin Operations
              </span>
            </div>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1 text-xs font-medium">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sacred-300 hover:text-white hover:bg-sacred-900 transition-colors"
                >
                  <Icon className="w-4 h-4 text-saffron-500" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status */}
        <div className="pt-4 border-t border-sacred-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 px-2 text-sacred-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Admin: {session.user.email}</span>
          </div>

          <div className="flex items-center justify-end px-2 text-[11px]">
            <SignOutButton className="text-red-400 hover:underline" />
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-sacred-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold text-sacred-950">
              RudraKart Administration
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-saffron-100 text-saffron-900 border border-saffron-300">
              Role: System Administrator
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
