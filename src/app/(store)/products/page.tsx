import Link from "next/link";
import type { Metadata } from "next";
import { getProducts, getCategories } from "@/actions/product-actions";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SlidersHorizontal, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rudraksha and Puja Product Catalog",
  description:
    "Browse Rudraksha beads, malas, accessories, and puja products by category, Mukhi, price, or origin.",
  alternates: { canonical: "/products" },
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
    mukhi?: string;
    origin?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: "price-asc" | "price-desc" | "newest" | "name";
    search?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const categories = await getCategories();

  const mukhiParam = searchParams.mukhi
    ? Number(searchParams.mukhi)
    : undefined;
  const minPriceParam = searchParams.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPriceParam = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;

  const products = await getProducts({
    categorySlug: searchParams.category,
    mukhi: mukhiParam,
    origin: searchParams.origin,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    sort: searchParams.sort,
    search: searchParams.search,
  });

  const mukhiOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-sacred-200 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sacred-950">
          Sacred Rudraksha Catalog
        </h1>
        <p className="text-sm font-medium text-stone-600">
          Showing {products.length} authenticated Himalayan specimens &
          spiritual accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6 bg-white p-6 rounded-xl border border-sacred-200 h-fit shadow-xs">
          <div className="flex items-center justify-between border-b border-sacred-200 pb-3">
            <h3 className="font-serif font-bold text-sacred-950 flex items-center gap-2 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-saffron-700" />
              Filter Collection
            </h3>
            <Link
              href="/products"
              className="text-xs text-saffron-700 hover:text-saffron-900 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </Link>
          </div>

          {/* Search within catalog */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-sacred-950 block">
              Search Keywords
            </label>
            <form action="/products" method="GET" className="relative">
              <input
                type="text"
                name="search"
                defaultValue={searchParams.search || ""}
                placeholder="Search by Mukhi..."
                className="w-full pl-3 pr-8 py-2 text-xs rounded-md border border-stone-300 bg-stone-50 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-600"
              />
              <button
                type="submit"
                className="absolute right-2 top-2.5 text-stone-600 hover:text-saffron-700"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Mukhi Face Count Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-sacred-950 block">
              Mukhi Facets
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {mukhiOptions.map((m) => {
                const isSelected = mukhiParam === m;
                return (
                  <Link
                    key={m}
                    href={`/products?mukhi=${m}${
                      searchParams.category
                        ? `&category=${searchParams.category}`
                        : ""
                    }`}
                    className={`text-center py-1.5 rounded text-xs font-bold border transition-colors ${
                      isSelected
                        ? "bg-saffron-700 text-white border-saffron-700 shadow-xs"
                        : "bg-stone-50 text-stone-900 border-stone-300 hover:border-saffron-600 hover:bg-saffron-50"
                    }`}
                  >
                    {m}M
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-sacred-950 block">
              Categories
            </label>
            <ul className="space-y-1 text-xs">
              {categories.map((cat) => {
                const isSelected = searchParams.category === cat.slug;
                return (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className={`block px-3 py-2 rounded-md font-medium transition-colors ${
                        isSelected
                          ? "bg-saffron-100 text-saffron-950 font-bold border border-saffron-300"
                          : "text-stone-800 hover:bg-stone-100"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Origin Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-sacred-950 block">
              Botanical Origin
            </label>
            <div className="space-y-1 text-xs">
              <Link
                href="/products?origin=Nepal"
                className={`block px-3 py-2 rounded-md font-medium ${
                  searchParams.origin === "Nepal"
                    ? "bg-saffron-100 text-saffron-950 font-bold border border-saffron-300"
                    : "text-stone-800 hover:bg-stone-100"
                }`}
              >
                Nepal (High Altitude)
              </Link>
              <Link
                href="/products?origin=Indonesia"
                className={`block px-3 py-2 rounded-md font-medium ${
                  searchParams.origin === "Indonesia"
                    ? "bg-saffron-100 text-saffron-950 font-bold border border-saffron-300"
                    : "text-stone-800 hover:bg-stone-100"
                }`}
              >
                Indonesia (Java Beads)
              </Link>
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-sacred-950 block">
              Sort Order
            </label>
            <div className="space-y-1 text-xs">
              <Link
                href={`/products?sort=price-asc${
                  searchParams.category
                    ? `&category=${searchParams.category}`
                    : ""
                }`}
                className={`block px-3 py-2 rounded-md font-medium ${
                  searchParams.sort === "price-asc"
                    ? "bg-saffron-100 text-saffron-950 font-bold border border-saffron-300"
                    : "text-stone-800 hover:bg-stone-100"
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href={`/products?sort=price-desc${
                  searchParams.category
                    ? `&category=${searchParams.category}`
                    : ""
                }`}
                className={`block px-3 py-2 rounded-md font-medium ${
                  searchParams.sort === "price-desc"
                    ? "bg-saffron-100 text-saffron-950 font-bold border border-saffron-300"
                    : "text-stone-800 hover:bg-stone-100"
                }`}
              >
                Price: High to Low
              </Link>
              <Link
                href={`/products?sort=name${
                  searchParams.category
                    ? `&category=${searchParams.category}`
                    : ""
                }`}
                className={`block px-3 py-2 rounded-md font-medium ${
                  searchParams.sort === "name"
                    ? "bg-saffron-100 text-saffron-950 font-bold border border-saffron-300"
                    : "text-stone-800 hover:bg-stone-100"
                }`}
              >
                Alphabetical (A-Z)
              </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-sacred-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-sacred-950">
                No matching specimens found
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                We couldn&apos;t find any Rudraksha matching your current filter
                criteria. Try resetting filters to view the full collection.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
