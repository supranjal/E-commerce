import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { getAdminCatalog } from "@/actions/product-actions";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const { products } = await getAdminCatalog();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sacred-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-sacred-950">
            Inventory Stock Controller
          </h1>
          <p className="text-xs text-muted-foreground">
            Current database stock levels and low-stock alerts. Stock edits are
            managed with product details.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="text-xs font-semibold text-saffron-800 hover:underline"
        >
          Manage product stock
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-sacred-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sacred-100/80 border-b border-sacred-200 font-serif font-bold text-sacred-900 uppercase tracking-wider">
              <tr>
                <th className="p-4">SKU / Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Available Units</th>
                <th className="p-4">Inventory Status</th>
                <th className="p-4">Stock Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sacred-100">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-sacred-50/50 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-serif font-bold text-sacred-950 block">
                      {p.name}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Slug: {p.slug}
                    </span>
                  </td>
                  <td className="p-4 text-sacred-700">{p.category?.name}</td>
                  <td className="p-4 font-mono font-bold text-base text-sacred-950">
                    {p.stock} units
                  </td>
                  <td className="p-4">
                    {p.stock <= 3 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Optimal Supply
                      </span>
                    )}
                  </td>
                  <td className="p-4 w-48">
                    <div className="w-full bg-sacred-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          p.stock <= 3 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(100, (p.stock / 20) * 100)}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
