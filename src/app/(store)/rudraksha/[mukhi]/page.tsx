import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/actions/product-actions";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface MukhiPageProps {
  params: {
    mukhi: string;
  };
}

export async function generateMetadata({
  params,
}: MukhiPageProps): Promise<Metadata> {
  const slug = params.mukhi.toLowerCase();
  const title =
    slug === "gauri-shankar"
      ? "Gauri Shankar Rudraksha"
      : slug === "ganesh"
        ? "Ganesh Rudraksha"
        : `${slug.match(/\d+/)?.[0] || "Rudraksha"} Mukhi Rudraksha`;
  return {
    title,
    description: `Browse RudraKart catalog listings for ${title}. Availability and product details are shown on each listing.`,
    alternates: { canonical: `/rudraksha/${slug}` },
  };
}

export default async function MukhiRoutePage({ params }: MukhiPageProps) {
  const rawMukhi = params.mukhi.toLowerCase();
  let mukhiNumber: number | null = null;
  let isSpecialSearch = false;
  let title = "";
  let description = "";

  if (rawMukhi.includes("mukhi")) {
    const match = rawMukhi.match(/(\d+)/);
    if (match) {
      mukhiNumber = parseInt(match[1], 10);
      if (mukhiNumber < 1 || mukhiNumber > 14) notFound();
      title = `${mukhiNumber} Mukhi Nepali Rudraksha`;
      description = `Authentic natural ${mukhiNumber}-faced Rudraksha beads directly harvested from Nepal. Individually inspected for distinct ${mukhiNumber} continuous facial lines, cellular density, and internal seed chambers.`;
    }
  } else if (rawMukhi === "gauri-shankar") {
    isSpecialSearch = true;
    title = "Gauri Shankar Sacred Rudraksha";
    description =
      "Naturally unified twin beads forming an unbroken organic union on the tree, representing the divine Ardhanarishvara union.";
  } else if (rawMukhi === "ganesh") {
    isSpecialSearch = true;
    title = "Sacred Ganesh Rudraksha";
    description =
      "Rare natural biological formation displaying a distinct organic trunk-like protrusion along the body of the bead.";
  }

  if (!mukhiNumber && !isSpecialSearch) {
    notFound();
  }

  const allProducts = await getProducts();
  const filteredProducts = allProducts.filter((p) => {
    if (mukhiNumber) return p.mukhi === mukhiNumber;
    if (rawMukhi === "gauri-shankar") return p.slug.includes("gauri-shankar");
    if (rawMukhi === "ganesh") return p.slug.includes("ganesh");
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sacred-950 to-sacred-900 text-white p-8 sm:p-12 border border-sacred-800 shadow-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/20 text-gold-300 border border-saffron-500/30 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          Catalog Category
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-sacred-200 max-w-3xl leading-relaxed">
          {description}
        </p>

        <div className="pt-2 flex items-center gap-4 text-xs text-gold-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Product details
            are illustrative
          </span>
          <span>•</span>
          <span>Stock checked during checkout</span>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-sacred-900">
            Available Specimens ({filteredProducts.length})
          </h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/products" className="gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> All Categories
            </Link>
          </Button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-sacred-200 p-8 space-y-4">
            <h3 className="font-serif text-lg font-bold text-sacred-900">
              No individual specimens currently listed
            </h3>
            <p className="text-xs text-muted-foreground">
              New seasonal harvest specimens are currently undergoing laboratory
              examination.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/products">Browse Full Catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
