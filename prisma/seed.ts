import { PrismaClient, Role, VerificationStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  if (process.env.ALLOW_DESTRUCTIVE_SEED !== "true") {
    throw new Error(
      "This demo seed deletes existing RudraKart records. Set ALLOW_DESTRUCTIVE_SEED=true only for a disposable database.",
    );
  }
  if (
    !process.env.ADMIN_SEED_PASSWORD ||
    process.env.ADMIN_SEED_PASSWORD.length < 12
  ) {
    throw new Error(
      "Set ADMIN_SEED_PASSWORD to a password of at least 12 characters before seeding.",
    );
  }

  console.log("🌱 Starting RudraKart database seed...");

  // 1. Clean existing data (respecting foreign key order)
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing tables.");

  // 2. Create Users
  const adminPassword = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD, 12);

  const adminUser = await prisma.user.create({
    data: {
      name: "RudraKart Administrator",
      email: "admin@rudrakart.com",
      password: adminPassword,
      role: Role.ADMIN,
      phone: "+977 9801234567",
      address: "Baluwatar, Kathmandu, Nepal",
    },
  });

  console.log("👤 Created the configured administrator account.");

  // 3. Create Categories
  const catRudraksha = await prisma.category.create({
    data: {
      name: "1 to 14 Mukhi Rudraksha",
      slug: "1-14-mukhi-rudraksha",
      description:
        "Authentic single beads directly harvested from eastern Himalayan foothills of Nepal (Sankhuwasabha & Dingla).",
    },
  });

  const catRare = await prisma.category.create({
    data: {
      name: "Rare & Sacred Combinations",
      slug: "rare-sacred-rudraksha",
      description:
        "Naturally conjoined and uniquely formed sacred specimens like Gauri Shankar, Trijuti, and Ganesh Rudraksha.",
    },
  });

  const catMalas = await prisma.category.create({
    data: {
      name: "Rudraksha Malas & Rosaries",
      slug: "rudraksha-malas",
      description:
        "Traditional 108+1 japa rosaries and designer malas strung with natural silk and pure silver wire.",
    },
  });

  const catBracelets = await prisma.category.create({
    data: {
      name: "Rudraksha Bracelets",
      slug: "rudraksha-bracelets",
      description:
        "Ergonomic wristbands crafted from hand-selected authentic Nepali beads with adjustable clasps.",
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "Silver Caps & Puja Accessories",
      slug: "puja-accessories",
      description:
        "Pure 925 sterling silver cappings, traditional teakwood storage boxes, and consecration essentials.",
    },
  });

  console.log("📁 Created 5 Core Categories.");

  // 4. Products Data Set
  const productsData = [
    {
      name: "1 Mukhi Chandrakar Rudraksha",
      slug: "1-mukhi-rudraksha-nepal",
      description:
        "Academic sample listing for a 1 Mukhi Chandrakar Rudraksha. Product identity and physical characteristics have not been independently verified.",
      price: 145000,
      mukhi: 1,
      isSpecial: true,
      origin: "Nepal (Sankhuwasabha)",
      size: "24.5 mm",
      weight: "4.12 grams",
      shape: "Natural Oval Savar",
      stock: 2,
      featured: true,
      isCertified: true,
      categoryId: catRare.id,
      images: [
        {
          url: "/images/products/1-mukhi-chandrakar-rudraksha.jpg",
          altText: "1 Mukhi Chandrakar Rudraksha product photograph",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00001",
        mukhi: 1,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "24.5 x 18.2 mm",
        weightGrams: 4.12,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus:
          "Single central seed chamber verified; no artificial embedding detected",
        microscopicCheck:
          "Complete natural uninterrupted Mukhi line; authentic thorny cellular ridges",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "2 Mukhi Dwi Mukhi Rudraksha (Nepal)",
      slug: "2-mukhi-rudraksha-nepal",
      description:
        "Authentic two-faced Nepali Rudraksha representing the sacred Ardhanarishvara union. Features two clearly defined natural clefts traversing symmetrically across the bead with deep, prominent ridges.",
      price: 9500,
      mukhi: 2,
      isSpecial: false,
      origin: "Nepal (Sankhuwasabha)",
      size: "21.0 mm",
      weight: "3.20 grams",
      shape: "Natural Crescent Oval",
      stock: 6,
      featured: true,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=82",
          altText: "2 Mukhi Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00002",
        mukhi: 2,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "21.0 x 14.5 mm",
        weightGrams: 3.2,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus: "Two distinct internal seed compartments observed",
        microscopicCheck:
          "Natural twin cleft lines intact; density standard 1.18 g/cm3",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "3 Mukhi Agni Rudraksha (Nepal)",
      slug: "3-mukhi-rudraksha-nepal",
      description:
        "Authentic three-mukhi bead from Dingla region of eastern Nepal. Features three distinct equidistant natural ridges, symbolizing pure vitality and energy.",
      price: 4500,
      mukhi: 3,
      isSpecial: false,
      origin: "Nepal (Dingla)",
      size: "18.5 mm",
      weight: "2.95 grams",
      shape: "Natural Round-Oval",
      stock: 12,
      featured: false,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=82",
          altText: "3 Mukhi Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00003",
        mukhi: 3,
        origin: "Nepal (Dingla)",
        dimensions: "18.5 x 18.0 mm",
        weightGrams: 2.95,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus: "Three triangular symmetrical seed chambers confirmed",
        microscopicCheck: "Original woody endocarp with intact thorny spines",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "4 Mukhi Brahma Rudraksha (Nepal)",
      slug: "4-mukhi-rudraksha-nepal",
      description:
        "Natural 4-faced bead harvested from high-altitude groves in eastern Nepal. Four clean, deeply grooved lines run from pole to pole without artificial carving.",
      price: 3500,
      mukhi: 4,
      isSpecial: false,
      origin: "Nepal (Sankhuwasabha)",
      size: "19.0 mm",
      weight: "3.10 grams",
      shape: "Spherical",
      stock: 15,
      featured: false,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=82",
          altText: "4 Mukhi Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00004",
        mukhi: 4,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "19.0 x 19.1 mm",
        weightGrams: 3.1,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus: "Four distinct internal compartments observed",
        microscopicCheck:
          "No artificial line incision or filler adhesive present",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "5 Mukhi Collector Grade Rudraksha (Nepal)",
      slug: "5-mukhi-rudraksha-nepal",
      description:
        "Premium large-sized (22mm+) 5 Mukhi bead representing Lord Shiva (Kalagni Rudra). Selected from prime crop harvest with flawless symmetry, deep natural facets, and dense woody texture.",
      price: 1800,
      mukhi: 5,
      isSpecial: false,
      origin: "Nepal (Dingla)",
      size: "22.0 mm",
      weight: "3.80 grams",
      shape: "Natural Round",
      stock: 45,
      featured: true,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=900&q=82",
          altText: "5 Mukhi Rudraksha Collector Bead",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00005",
        mukhi: 5,
        origin: "Nepal (Dingla)",
        dimensions: "22.0 x 21.8 mm",
        weightGrams: 3.8,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus: "Five natural radial seed cavities confirmed",
        microscopicCheck:
          "Standard natural Elaeocarpus ganitrus endocarp structure",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "6 Mukhi Kartikeya Rudraksha (Nepal)",
      slug: "6-mukhi-rudraksha-nepal",
      description:
        "Six-faced authentic Nepali Rudraksha representing Lord Kartikeya. Known for high botanical density, sharp thorny ridges, and symmetrical line distribution.",
      price: 4200,
      mukhi: 6,
      isSpecial: false,
      origin: "Nepal (Sankhuwasabha)",
      size: "20.5 mm",
      weight: "3.40 grams",
      shape: "Natural Round",
      stock: 14,
      featured: false,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=82",
          altText: "6 Mukhi Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00006",
        mukhi: 6,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "20.5 x 20.2 mm",
        weightGrams: 3.4,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus: "Six hexagonal internal chambers verified",
        microscopicCheck: "Natural surface grooves without artificial carving",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "7 Mukhi Mahalakshmi Rudraksha (Nepal)",
      slug: "7-mukhi-rudraksha-nepal",
      description:
        "Auspicious 7-faced Nepali Rudraksha representing Goddess Mahalakshmi. Highly prized for its distinct deep golden-brown luster and clearly articulated seven facets.",
      price: 12000,
      mukhi: 7,
      isSpecial: false,
      origin: "Nepal (Sankhuwasabha)",
      size: "23.0 mm",
      weight: "4.05 grams",
      shape: "Natural Round",
      stock: 8,
      featured: true,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=82",
          altText: "7 Mukhi Mahalakshmi Rudraksha",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00007",
        mukhi: 7,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "23.0 x 22.7 mm",
        weightGrams: 4.05,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus: "Seven symmetrical internal seed cavities observed",
        microscopicCheck:
          "Pristine natural ridges; unbleached chemical-free surface",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "8 Mukhi Ashta-Murti Ganesh Rudraksha (Nepal)",
      slug: "8-mukhi-rudraksha-nepal",
      description:
        "Natural eight-mukhi Rudraksha associated with Lord Ganesha. Premium high-altitude specimen featuring deep contours and exceptional durability.",
      price: 18500,
      mukhi: 8,
      isSpecial: false,
      origin: "Nepal (Dingla)",
      size: "21.5 mm",
      weight: "3.65 grams",
      shape: "Natural Round",
      stock: 5,
      featured: false,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=82",
          altText: "8 Mukhi Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00008",
        mukhi: 8,
        origin: "Nepal (Dingla)",
        dimensions: "21.5 x 21.0 mm",
        weightGrams: 3.65,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus: "Eight radial internal seed locules confirmed",
        microscopicCheck:
          "Continuous natural ridges from apical to basal pores",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "9 Mukhi Navadurga Rudraksha (Nepal)",
      slug: "9-mukhi-rudraksha-nepal",
      description:
        "Sacred 9-mukhi Nepali Rudraksha representing the nine forms of Goddess Durga (Navashakti). Large, well-balanced bead with 9 prominent natural lines.",
      price: 26000,
      mukhi: 9,
      isSpecial: false,
      origin: "Nepal (Sankhuwasabha)",
      size: "22.8 mm",
      weight: "3.90 grams",
      shape: "Natural Round",
      stock: 4,
      featured: true,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1601821765780-754fa98637c1?auto=format&fit=crop&w=900&q=82",
          altText: "9 Mukhi Navadurga Rudraksha",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00009",
        mukhi: 9,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "22.8 x 22.5 mm",
        weightGrams: 3.9,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus: "Nine natural internal seed chambers clearly visualized",
        microscopicCheck:
          "Authentic high-grade natural endocarp; zero tampering",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "10 Mukhi Dashamukhi Rudraksha (Nepal)",
      slug: "10-mukhi-rudraksha-nepal",
      description:
        "Ten-faced Nepali Rudraksha representing Lord Mahavishnu and the ten directions (Digpalas). Excellent spherical formation with ten distinct facets.",
      price: 34000,
      mukhi: 10,
      isSpecial: false,
      origin: "Nepal (Sankhuwasabha)",
      size: "23.5 mm",
      weight: "4.15 grams",
      shape: "Natural Round",
      stock: 3,
      featured: false,
      isCertified: true,
      categoryId: catRudraksha.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=900&q=82",
          altText: "10 Mukhi Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00010",
        mukhi: 10,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "23.5 x 23.2 mm",
        weightGrams: 4.15,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus:
          "Ten internal seed locules confirmed on cross-sectional scan",
        microscopicCheck:
          "Unbroken natural Mukhi fissures; verified botanical specimen",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "14 Mukhi Devamani Rudraksha (Nepal)",
      slug: "14-mukhi-rudraksha-nepal",
      description:
        "Among the rarest and most treasured of all higher Mukhis. Known as the Devamani (Gem of the Gods) and associated with Lord Hanuman and Lord Shiva. Large collector size with 14 natural lines traversing the entire sphere.",
      price: 210000,
      mukhi: 14,
      isSpecial: true,
      origin: "Nepal (Sankhuwasabha)",
      size: "26.5 mm",
      weight: "5.20 grams",
      shape: "Natural Spherical",
      stock: 1,
      featured: true,
      isCertified: true,
      categoryId: catRare.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=900&q=82",
          altText: "14 Mukhi Devamani Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00014",
        mukhi: 14,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "26.5 x 26.1 mm",
        weightGrams: 5.2,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus:
          "14 distinct internal seed cavities completely verified under digital radiograph",
        microscopicCheck:
          "Natural woody partitions; genuine uninterrupted spines with zero carving",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "Gauri Shankar Sacred Conjoined Rudraksha",
      slug: "gauri-shankar-rudraksha-nepal",
      description:
        "Naturally united twin Rudraksha beads conjoined on the tree without human intervention. Symbolizes the divine union of Lord Shiva and Goddess Parvati. Outstanding natural bond strength and symmetrical beauty.",
      price: 55000,
      mukhi: null,
      isSpecial: true,
      origin: "Nepal (Sankhuwasabha)",
      size: "28.0 mm",
      weight: "6.10 grams",
      shape: "Naturally Joined Twin",
      stock: 2,
      featured: true,
      isCertified: true,
      categoryId: catRare.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=82",
          altText: "Gauri Shankar Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00015",
        mukhi: 10,
        origin: "Nepal (Sankhuwasabha)",
        dimensions: "28.0 x 21.4 mm",
        weightGrams: 6.1,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus:
          "Continuous botanical fusion observed; no glue or synthetic bonding material",
        microscopicCheck:
          "Natural organic joint with continuous woody fiber network",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "Natural Ganesh Rudraksha with Trunk Formation",
      slug: "ganesh-rudraksha-nepal",
      description:
        "A rare biological wonder where an organic trunk-like protrusion naturally extends from the body of the bead. Revered as an auspicious representation of Lord Ganesha.",
      price: 22000,
      mukhi: null,
      isSpecial: true,
      origin: "Nepal (Dingla)",
      size: "21.0 mm",
      weight: "3.50 grams",
      shape: "Trunk-Bearing Spherical",
      stock: 3,
      featured: true,
      isCertified: true,
      categoryId: catRare.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=82",
          altText: "Ganesh Rudraksha Nepal",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
      certificate: {
        certificateNumber: "RK-DEMO-00016",
        mukhi: 5,
        origin: "Nepal (Dingla)",
        dimensions: "21.0 x 19.5 mm",
        weightGrams: 3.5,
        laboratory: "RudraKart Himalayan Gem & Botanical Lab (Academic Demo)",
        xrayStatus:
          "Organic vascular continuation from bead core to trunk projection confirmed",
        microscopicCheck:
          "Single unbroken endocarp structure without artificial attachment",
        verificationStatus: VerificationStatus.VERIFIED,
      },
    },
    {
      name: "108+1 Beads 5-Mukhi Nepali Japa Mala (8mm)",
      slug: "108-beads-5-mukhi-nepali-japa-mala",
      description:
        "Hand-crafted 108+1 sacred rosary strung with calibrated 8mm natural Nepali five-mukhi beads. Features traditional knotting between each bead and a vibrant saffron tassel.",
      price: 6500,
      mukhi: 5,
      isSpecial: false,
      origin: "Nepal",
      size: "8 mm beads (108+1 total)",
      weight: "48 grams",
      shape: "Uniform Spherical Beads",
      stock: 25,
      featured: false,
      isCertified: false,
      categoryId: catMalas.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1528459105426-b9548367069b?auto=format&fit=crop&w=900&q=82",
          altText: "108 Beads 5 Mukhi Nepali Japa Mala",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Pure 925 Silver Capped 5-Mukhi Rudraksha Bracelet",
      slug: "silver-capped-5-mukhi-bracelet",
      description:
        "Elegant wrist bracelet crafted with selected 12mm Nepali five-mukhi Rudraksha beads encased in handcrafted 925 sterling silver caps with a secure lobster clasp.",
      price: 4800,
      mukhi: 5,
      isSpecial: false,
      origin: "Nepal",
      size: "12 mm beads (7.5 inch length)",
      weight: "18.5 grams",
      shape: "Beaded Bracelet",
      stock: 18,
      featured: false,
      isCertified: false,
      categoryId: catBracelets.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=82",
          altText: "Silver Capped Rudraksha Bracelet",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Carved Teakwood Velvet-Lined Rudraksha Storage Box",
      slug: "carved-teakwood-rudraksha-box",
      description:
        "Traditional Himalayan artisan-carved solid teakwood box with rich saffron velvet interior. Designed specifically to protect and energize sacred beads.",
      price: 2200,
      mukhi: null,
      isSpecial: false,
      origin: "Nepal (Patan Craft)",
      size: "15 x 10 x 8 cm",
      weight: "320 grams",
      shape: "Rectangular Box",
      stock: 30,
      featured: false,
      isCertified: false,
      categoryId: catAccessories.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=82",
          altText: "Carved Teakwood Storage Box",
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
  ];

  // 5. Insert Products & Associated Certificates
  for (const item of productsData) {
    const { images, certificate, ...productFields } = item;

    const createdProduct = await prisma.product.create({
      data: {
        ...productFields,
        isCertified: false,
        images: {
          create: images,
        },
      },
    });

    if (certificate) {
      await prisma.certificate.create({
        data: {
          ...certificate,
          verificationStatus: VerificationStatus.SAMPLE_DEMO,
          productId: createdProduct.id,
        },
      });
    }
  }

  console.log(
    `✨ Seeded ${productsData.length} authentic products with sample certificates.`,
  );

  console.log(
    "🎉 Database seeding completed successfully with clean local assets!",
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
