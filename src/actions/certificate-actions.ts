"use server";

import prisma from "@/lib/prisma";
import { MOCK_CERTIFICATES, MOCK_PRODUCTS } from "@/lib/mock-data";
import { CertificateItem } from "@/types";

export async function verifyCertificate(
  certificateNumber: string
): Promise<{
  success: boolean;
  certificate?: CertificateItem;
  productName?: string;
  productSlug?: string;
  error?: string;
}> {
  const trimmed = certificateNumber.trim().toUpperCase();

  if (!trimmed) {
    return { success: false, error: "Please enter a valid certificate number." };
  }

  try {
    const cert = await prisma.certificate.findUnique({
      where: { certificateNumber: trimmed },
      include: { product: { select: { name: true, slug: true } } },
    });

    if (cert) {
      return {
        success: true,
        certificate: cert as unknown as CertificateItem,
        productName: cert.product.name,
        productSlug: cert.product.slug,
      };
    }
  } catch (error) {
    // Fallback to mock certificates
  }

  // Check fallback mock certificates
  const mockCert = MOCK_CERTIFICATES.find(
    (c) => c.certificateNumber.toUpperCase() === trimmed
  );

  if (mockCert) {
    const relatedProduct = MOCK_PRODUCTS.find((p) => p.id === mockCert.productId);
    return {
      success: true,
      certificate: mockCert,
      productName: relatedProduct?.name ?? "Certified Sacred Nepali Rudraksha",
      productSlug: relatedProduct?.slug ?? "1-mukhi-rudraksha-nepal",
    };
  }

  return {
    success: false,
    error: `Certificate ID "${trimmed}" was not found in the authentic registry. Please check the spelling or format (e.g. RK-DEMO-00001).`,
  };
}
