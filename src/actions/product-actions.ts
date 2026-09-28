"use server";

import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import { ProductItem } from "@/types";

function excludeDemoVerification(product: ProductItem): ProductItem {
  const certificates = product.certificates?.map((certificate) => {
    const isDemo =
      certificate.certificateNumber.startsWith("RK-DEMO-") ||
      certificate.laboratory.toLowerCase().includes("demo");
    return isDemo
      ? { ...certificate, verificationStatus: "SAMPLE_DEMO" as const }
      : certificate;
  });
  const hasVerifiedCertificate = certificates?.some(
    (certificate) => certificate.verificationStatus === "VERIFIED",
  );

  return {
    ...product,
    isCertified: product.isCertified && Boolean(hasVerifiedCertificate),
    certificates,
  };
}

export async function getProducts(options?: {
  categorySlug?: string;
  mukhi?: number;
  featured?: boolean;
  search?: string;
  origin?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-asc" | "price-desc" | "newest" | "name";
}): Promise<ProductItem[]> {
  try {
    const where: any = {};

    if (options?.categorySlug) {
      where.category = { slug: options.categorySlug };
    }

    if (options?.mukhi !== undefined && options.mukhi !== null) {
      where.mukhi = Number(options.mukhi);
    }

    if (options?.featured) {
      where.featured = true;
    }

    if (options?.origin) {
      where.origin = { contains: options.origin, mode: "insensitive" };
    }

    if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
      where.price = {};
      if (options.minPrice !== undefined) where.price.gte = options.minPrice;
      if (options.maxPrice !== undefined) where.price.lte = options.maxPrice;
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
        { origin: { contains: options.search, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (options?.sort === "price-asc") orderBy = { price: "asc" };
    if (options?.sort === "price-desc") orderBy = { price: "desc" };
    if (options?.sort === "name") orderBy = { name: "asc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        certificates: true,
      },
    });

    return (products as unknown as ProductItem[]).map(excludeDemoVerification);
  } catch (error) {
    // Database not connected yet, gracefully use in-memory seed catalog
  }

  // Graceful fallback to mock data
  let filtered = [...MOCK_PRODUCTS];

  if (options?.categorySlug) {
    filtered = filtered.filter(
      (p) => p.category?.slug === options.categorySlug,
    );
  }

  if (options?.mukhi !== undefined && options.mukhi !== null) {
    filtered = filtered.filter((p) => p.mukhi === Number(options.mukhi));
  }

  if (options?.featured) {
    filtered = filtered.filter((p) => p.featured);
  }

  if (options?.origin) {
    filtered = filtered.filter((p) =>
      p.origin.toLowerCase().includes(options.origin!.toLowerCase()),
    );
  }

  if (options?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= options.minPrice!);
  }

  if (options?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= options.maxPrice!);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q),
    );
  }

  if (options?.sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (options?.sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (options?.sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered.map(excludeDemoVerification);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductItem | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        certificates: true,
      },
    });

    return product
      ? excludeDemoVerification(product as unknown as ProductItem)
      : null;
  } catch (error) {
    // Database not connected yet, fallback to seed
  }

  const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return found ? excludeDemoVerification(found) : null;
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return categories;
  } catch (error) {
    // Database not connected yet, fallback to seed
  }

  return MOCK_CATEGORIES.map((c) => ({
    ...c,
    _count: {
      products: MOCK_PRODUCTS.filter((p) => p.categoryId === c.id).length,
    },
  }));
}

export async function getAdminCatalog() {
  if (!(await isAdmin())) {
    return {
      success: false,
      products: [],
      categories: [],
      error: "Admin access required.",
    };
  }

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          certificates: true,
        },
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    return {
      success: true,
      products: (products as unknown as ProductItem[]).map(
        excludeDemoVerification,
      ),
      categories,
    };
  } catch {
    return {
      success: false,
      products: [],
      categories: [],
      error: "Admin catalog could not be loaded from the database.",
    };
  }
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  stock: number;
  mukhi?: number | null;
  isSpecial?: boolean;
  origin: string;
  categoryId: string;
  size?: string;
  weight?: string;
  imageUrl?: string;
  featured?: boolean;
  isCertified?: boolean;
}

export async function createProductAction(input: CreateProductInput) {
  if (!(await isAdmin())) {
    return { success: false, error: "Admin access required." };
  }

  try {
    if (!input.name || input.name.trim().length < 3) {
      return {
        success: false,
        error: "Product name must be at least 3 characters.",
      };
    }
    const price = Number(input.price);
    if (isNaN(price) || price <= 0) {
      return {
        success: false,
        error: "Price must be a valid positive amount.",
      };
    }
    const stock = Number(input.stock);
    if (isNaN(stock) || stock < 0) {
      return { success: false, error: "Stock cannot be negative." };
    }
    if (!input.categoryId) {
      return { success: false, error: "Please select a valid category." };
    }

    const baseSlug = (input.slug || input.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = await prisma.product.create({
      data: {
        name: input.name.trim(),
        slug,
        description:
          input.description?.trim() ||
          "Academic demo catalog listing; product details have not been independently verified.",
        price,
        stock,
        mukhi: input.mukhi ? Number(input.mukhi) : null,
        isSpecial: Boolean(input.isSpecial),
        origin: input.origin?.trim() || "Nepal (Sankhuwasabha)",
        size: input.size || "22.0 mm",
        weight: input.weight || "3.50 grams",
        shape: input.isSpecial ? "Naturally Conjoined" : "Natural Oval",
        featured: Boolean(input.featured),
        isCertified: false,
        categoryId: input.categoryId,
        images: input.imageUrl
          ? {
              create: [
                {
                  url: input.imageUrl.trim(),
                  altText: input.name,
                  isPrimary: true,
                  sortOrder: 0,
                },
              ],
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return { success: true, product: newProduct };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return {
      success: false,
      error: error.message || "Could not create product.",
    };
  }
}

export interface UpdateProductInput {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  mukhi?: number | null;
  origin: string;
  categoryId: string;
  featured?: boolean;
  isCertified?: boolean;
  imageUrl?: string;
}

export async function updateProductAction(input: UpdateProductInput) {
  if (!(await isAdmin())) {
    return { success: false, error: "Admin access required." };
  }

  try {
    if (!input.id) {
      return { success: false, error: "Product ID is required for updating." };
    }
    const price = Number(input.price);
    if (isNaN(price) || price <= 0) {
      return {
        success: false,
        error: "Price must be a valid positive amount.",
      };
    }
    const stock = Number(input.stock);
    if (isNaN(stock) || stock < 0) {
      return { success: false, error: "Stock cannot be negative." };
    }

    const updated = await prisma.product.update({
      where: { id: input.id },
      data: {
        name: input.name.trim(),
        description: input.description.trim(),
        price,
        stock,
        mukhi: input.mukhi ? Number(input.mukhi) : null,
        origin: input.origin.trim(),
        categoryId: input.categoryId,
        featured: Boolean(input.featured),
        isCertified: false,
        ...(input.imageUrl !== undefined
          ? {
              images: {
                deleteMany: {},
                ...(input.imageUrl.trim()
                  ? {
                      create: [
                        {
                          url: input.imageUrl.trim(),
                          altText: input.name.trim(),
                          isPrimary: true,
                          sortOrder: 0,
                        },
                      ],
                    }
                  : {}),
              },
            }
          : {}),
      },
      include: {
        category: true,
        images: true,
      },
    });

    return { success: true, product: updated };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return {
      success: false,
      error: error.message || "Could not update product.",
    };
  }
}

export async function deleteProductAction(id: string) {
  if (!(await isAdmin())) {
    return { success: false, error: "Admin access required." };
  }

  try {
    if (!id) return { success: false, error: "Invalid product ID." };

    // Check if product is in any orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItemsCount > 0) {
      // Historical constraint: Set stock to 0 to prevent further orders
      await prisma.product.update({
        where: { id },
        data: { stock: 0, featured: false },
      });
      return {
        success: true,
        message:
          "Specimen is linked to existing customer orders. It has been deactivated and stock set to 0 instead of breaking historical transaction integrity.",
      };
    }

    // Delete associated images, certificates and product
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.certificate.deleteMany({ where: { productId: id } });
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.review.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return {
      success: true,
      message: "Product deleted successfully from catalog.",
    };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return {
      success: false,
      error: error.message || "Could not delete product.",
    };
  }
}
