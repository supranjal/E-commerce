import { getAdminCatalog } from "@/actions/product-actions";
import { ProductManagementClient } from "@/components/admin/ProductManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const { products, categories } = await getAdminCatalog();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sacred-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-sacred-950">
            Products & Specimens Management
          </h1>
          <p className="text-xs text-muted-foreground">
            Create, update pricing and inventory, edit descriptions, or remove
            specimens from the active catalog.
          </p>
        </div>
      </div>

      {/* Interactive Client Component */}
      <ProductManagementClient
        initialProducts={products}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        }))}
      />
    </div>
  );
}
