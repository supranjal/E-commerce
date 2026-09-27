import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  MapPin,
  Scale,
  Maximize2,
  FileCheck2,
  ArrowLeft,
} from "lucide-react";
import { getProductBySlug } from "@/actions/product-actions";
import { getRecommendationsForProduct } from "@/lib/recommendations";
import { getProductImageUrl } from "@/lib/utils";
import { CertificateModal } from "@/components/certificate/CertificateModal";
import { ProductDetailActions } from "@/components/storefront/ProductDetailActions";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const recommendations = await getRecommendationsForProduct(product);
  const primaryImage = getProductImageUrl(product);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-sacred-200 bg-sacred-100 shadow-md">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover object-center"
              quality={80}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.mukhi && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-sacred-950 text-white shadow">
                  {product.mukhi} Mukhi
                </span>
              )}
              {product.isSpecial && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-gold-600 text-white shadow">
                  Special Formation
                </span>
              )}
            </div>

            {product.isCertified && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-emerald-800 border border-emerald-300 shadow">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Lab Certified
                </span>
              </div>
            )}
          </div>

          {/* Sourcing guarantee small card */}
          <div className="p-4 rounded-xl bg-sacred-100/60 border border-sacred-200 flex items-center gap-3 text-xs text-sacred-800">
            <MapPin className="w-5 h-5 text-saffron-700 flex-shrink-0" />
            <div>
              <span className="font-bold block">100% Genuine Himalayan Origin</span>
              <span>Harvested in {product.origin} and tested for botanical integrity.</span>
            </div>
          </div>
        </div>

        {/* Right: Specifications & Purchasing Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-sacred-50 text-sacred-800 text-[11px]">
                {product.category?.name || "Sacred Rudraksha"}
              </Badge>
              <Badge variant="outline" className="bg-sacred-50 text-sacred-800 text-[11px]">
                Origin: {product.origin}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sacred-950">
              {product.name}
            </h1>
          </div>

          <p className="text-sm text-sacred-800 leading-relaxed">
            {product.description}
          </p>

          {/* Physical & Botanical Specifications Table */}
          <div className="rounded-xl border border-sacred-200 overflow-hidden bg-white shadow-xs">
            <div className="px-4 py-3 bg-sacred-100/80 border-b border-sacred-200 font-serif font-bold text-xs uppercase tracking-wider text-sacred-900">
              Verified Physical Characteristics
            </div>
            <div className="divide-y divide-sacred-100 text-xs">
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">Natural Mukhi Lines</span>
                <span className="font-semibold text-sacred-900">
                  {product.mukhi ? `${product.mukhi} Mukhi` : "Natural Conjoined Shape"}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">Dimensions / Caliber</span>
                <span className="font-semibold text-sacred-900">{product.size || "Standard Size"}</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">Documented Weight</span>
                <span className="font-semibold text-sacred-900">{product.weight || "Standard Weight"}</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">Natural Shape</span>
                <span className="font-semibold text-sacred-900">{product.shape || "Natural Oval"}</span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">Botanical Classification</span>
                <span className="font-semibold text-sacred-900 italic">Elaeocarpus ganitrus Roxb.</span>
              </div>
            </div>
          </div>

          {/* Certificate Action If Certified */}
          {product.certificates && product.certificates.length > 0 && (
            <div className="p-4 rounded-xl bg-gold-50/70 border border-gold-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold-700" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-sacred-900">
                      Authenticity Certificate Available
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Ref ID: {product.certificates[0].certificateNumber}
                    </p>
                  </div>
                </div>
              </div>

              <CertificateModal
                certificate={product.certificates[0]}
                productName={product.name}
              />
            </div>
          )}

          {/* Interactive Purchasing Controller */}
          <ProductDetailActions product={product} />
        </div>
      </div>

      {/* RECOMMENDATIONS SECTION */}
      <div className="pt-12 border-t border-sacred-200 space-y-12">
        {/* Same Mukhi Related Accessories */}
        {recommendations.sameMukhiProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700">
                  Harmonious Pairing
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-sacred-900">
                  Matching {product.mukhi} Mukhi Creations
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.sameMukhiProducts.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Complementary Accessories */}
        {recommendations.matchingAccessories.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700">
                  Sacred Preservation & Wear
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-sacred-900">
                  Recommended Cappings & Storage Accessories
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.matchingAccessories.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
