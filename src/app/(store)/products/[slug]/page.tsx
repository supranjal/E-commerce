import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  Star,
} from "lucide-react";
import { getProductBySlug } from "@/actions/product-actions";
import { getRecommendationsForProduct } from "@/lib/recommendations";
import { getProductImageUrl } from "@/lib/utils";
import { CertificateModal } from "@/components/certificate/CertificateModal";
import { ProductDetailActions } from "@/components/storefront/ProductDetailActions";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductReviews } from "@/components/storefront/ProductReviews";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://rudrakart.vercel.app";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product)
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };

  const canonical = `/products/${product.slug}`;
  const description = product.description.slice(0, 155);
  const image = getProductImageUrl(product);

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: canonical,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const recommendations = await getRecommendationsForProduct(product);
  const primaryImage = getProductImageUrl(product);
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [new URL(primaryImage, baseUrl).toString()],
    sku: product.id,
    brand: { "@type": "Brand", name: "RudraKart" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "NPR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${baseUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
        <span className="text-foreground font-medium truncate">
          {product.name}
        </span>
      </div>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-sacred-200 bg-sacred-100 shadow-md">
            <Image
              src={primaryImage}
              alt={
                product.slug === "1-mukhi-rudraksha-nepal"
                  ? "1 Mukhi Chandrakar Rudraksha product photograph"
                  : product.name
              }
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

            {product.isCertified &&
              product.certificates?.some(
                (certificate) => certificate.verificationStatus === "VERIFIED",
              ) && (
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
              <span className="font-bold block">Catalog origin</span>
              <span>
                Listed origin: {product.origin}. Product data is illustrative
                and not independently verified.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Specifications & Purchasing Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-sacred-50 text-sacred-800 text-[11px]"
              >
                {product.category?.name || "Sacred Rudraksha"}
              </Badge>
              <Badge
                variant="outline"
                className="bg-sacred-50 text-sacred-800 text-[11px]"
              >
                Origin: {product.origin}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sacred-950">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="#customer-reviews"
                className="inline-flex items-center gap-2 text-xs text-saffron-800 hover:text-saffron-950 font-medium group transition-colors"
              >
                <div className="flex items-center text-gold-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 fill-gold-500 text-gold-600"
                    />
                  ))}
                </div>
                <span className="group-hover:underline">
                  Ratings & Verified Customer Reviews
                </span>
              </a>
            </div>
          </div>

          <p className="text-sm text-sacred-800 leading-relaxed">
            {product.description}
          </p>

          {/* Physical & Botanical Specifications Table */}
          <div className="rounded-xl border border-sacred-200 overflow-hidden bg-white shadow-xs">
            <div className="px-4 py-3 bg-sacred-100/80 border-b border-sacred-200 font-serif font-bold text-xs uppercase tracking-wider text-sacred-900">
              Product Details
            </div>
            <div className="divide-y divide-sacred-100 text-xs">
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">
                  Natural Mukhi Lines
                </span>
                <span className="font-semibold text-sacred-900">
                  {product.mukhi
                    ? `${product.mukhi} Mukhi`
                    : "Natural Conjoined Shape"}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">
                  Dimensions / Caliber
                </span>
                <span className="font-semibold text-sacred-900">
                  {product.size || "Standard Size"}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">Documented Weight</span>
                <span className="font-semibold text-sacred-900">
                  {product.weight || "Standard Weight"}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">Natural Shape</span>
                <span className="font-semibold text-sacred-900">
                  {product.shape || "Natural Oval"}
                </span>
              </div>
              <div className="grid grid-cols-2 px-4 py-2.5">
                <span className="text-muted-foreground">
                  Botanical Classification
                </span>
                <span className="font-semibold text-sacred-900 italic">
                  Elaeocarpus ganitrus Roxb.
                </span>
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
                      Certificate Record
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

      {/* CUSTOMER REVIEWS & RATINGS */}
      <ProductReviews
        productId={product.id}
        productName={product.name}
        productSlug={product.slug}
      />

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
