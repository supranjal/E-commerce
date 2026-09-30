import prisma from "../src/lib/prisma";

const productImagesMapping: Record<string, Array<{ url: string; altText: string; isPrimary: boolean; sortOrder: number }>> = {
  "1-mukhi-rudraksha-nepal": [
    { url: "/images/products/1 Mukhi Savar Rudraksha (Nepal).webp", altText: "1 Mukhi Savar Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
    { url: "/images/products/1-mukhi-chandrakar-rudraksha.jpg", altText: "1 Mukhi Chandrakar Rudraksha", isPrimary: false, sortOrder: 1 },
  ],
  "2-mukhi-rudraksha-nepal": [
    { url: "/images/products/2 Mukhi Dwi Mukhi Rudraksha (Nepal).webp", altText: "2 Mukhi Dwi Mukhi Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "3-mukhi-rudraksha-nepal": [
    { url: "/images/products/3 Mukhi Agni Rudraksha (Nepal).webp", altText: "3 Mukhi Agni Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "4-mukhi-rudraksha-nepal": [
    { url: "/images/products/4 Mukhi Brahma Rudraksha (Nepal).webp", altText: "4 Mukhi Brahma Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "5-mukhi-rudraksha-nepal": [
    { url: "/images/products/5 Mukhi Collector Grade Rudraksha (Nepal).jpg", altText: "5 Mukhi Collector Grade Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
    { url: "/images/products/rudraksha-beads.jpg", altText: "Natural Nepali Rudraksha Beads", isPrimary: false, sortOrder: 1 },
  ],
  "6-mukhi-rudraksha-nepal": [
    { url: "/images/products/6 Mukhi Kartikeya Rudraksha (Nepal).webp", altText: "6 Mukhi Kartikeya Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "7-mukhi-rudraksha-nepal": [
    { url: "/images/products/7 Mukhi Mahalakshmi Rudraksha (Nepal).webp", altText: "7 Mukhi Mahalakshmi Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "8-mukhi-rudraksha-nepal": [
    { url: "/images/products/8 Mukhi Ashta-Murti Ganesh Rudraksha (Nepal).webp", altText: "8 Mukhi Ashta-Murti Ganesh Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "9-mukhi-rudraksha-nepal": [
    { url: "/images/products/9 Mukhi Navadurga Rudraksha (Nepal).png", altText: "9 Mukhi Navadurga Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "10-mukhi-rudraksha-nepal": [
    { url: "/images/products/10 Mukhi Dashamukhi Rudraksha (Nepal.webp", altText: "10 Mukhi Dashamukhi Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "14-mukhi-rudraksha-nepal": [
    { url: "/images/products/14 Mukhi Devamani Rudraksha (Nepal).webp", altText: "14 Mukhi Devamani Rudraksha Nepal", isPrimary: true, sortOrder: 0 },
  ],
  "ganesh-rudraksha-nepal": [
    { url: "/images/products/Natural Ganesh Rudraksha with Trunk Formation.webp", altText: "Natural Ganesh Rudraksha with Trunk Formation", isPrimary: true, sortOrder: 0 },
  ],
  "108-beads-5-mukhi-nepali-japa-mala": [
    { url: "/images/products/108+1 Beads 5-Mukhi Nepali Japa Mala (8mm).jpg", altText: "108+1 Beads 5-Mukhi Nepali Japa Mala", isPrimary: true, sortOrder: 0 },
  ],
  "silver-capped-5-mukhi-bracelet": [
    { url: "/images/products/Pure 925 Silver Capped 5-Mukhi Rudraksha Bracelet.webp", altText: "Pure 925 Silver Capped 5-Mukhi Rudraksha Bracelet", isPrimary: true, sortOrder: 0 },
  ],
  "carved-teakwood-rudraksha-box": [
    { url: "/images/products/rudraksha_jewelry_box_-16_compartments_1751346905.webp", altText: "Carved Teakwood Velvet-Lined Rudraksha Storage Box", isPrimary: true, sortOrder: 0 },
  ],
  "gauri-shankar-rudraksha-nepal": [
    { url: "/images/products/Gauri Shankar Sacred Conjoined Rudraksha.webp", altText: "Gauri Shankar Sacred Conjoined Rudraksha", isPrimary: true, sortOrder: 0 },
  ],
};

async function updateImages() {
  console.log("Updating product images to downloaded files...");
  for (const [slug, images] of Object.entries(productImagesMapping)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      console.log(`Product with slug ${slug} not found.`);
      continue;
    }

    // Delete existing images for this product
    await prisma.productImage.deleteMany({ where: { productId: product.id } });

    // Create new images
    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        },
      });
    }

    console.log(`Updated images for: ${product.name} (${images.length} images)`);
  }
  console.log("Product images update complete!");
}

updateImages()
  .catch((e) => {
    console.error("Failed to update images:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
