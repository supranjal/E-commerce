import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories } from "@/actions/product-actions";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = (await getCategories()).find(
    (item) => item.slug === params.slug,
  );
  if (!category)
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  return {
    title: category.name,
    description:
      category.description ||
      `Browse ${category.name} in the RudraKart catalog.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPageRoute({ params }: CategoryPageProps) {
  const categories = await getCategories();
  const currentCategory = categories.find((c) => c.slug === params.slug);

  if (!currentCategory) {
    notFound();
  }

  const products = await getProducts({ categorySlug: params.slug });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Category Banner */}
      <div className="rounded-2xl bg-sacred-950 text-white p-8 sm:p-12 border border-sacred-800 shadow-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/20 text-gold-300 border border-saffron-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          Curated Category
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {currentCategory.name}
        </h1>

        <p className="text-sm sm:text-base text-sacred-200 max-w-3xl leading-relaxed">
          {currentCategory.description}
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-sacred-900">
            Products in this category ({products.length})
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products" className="gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> All Products
            </Link>
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-sacred-200 p-8 space-y-4">
            <h3 className="font-serif text-lg font-bold text-sacred-900">
              No items currently listed in this category
            </h3>
            <Button variant="outline" size="sm" asChild>
              <Link href="/products">Browse Full Catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
