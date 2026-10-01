import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MOCK_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Reels Bundles',
    slug: 'reels-bundles',
    description: 'Ready-to-use, viral vertical video reels with HD quality & editable text',
    icon: 'Video',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80',
    productCount: 24,
    featured: true,
  },
  {
    id: 'cat-2',
    name: 'Canva Templates',
    slug: 'canva-templates',
    description: 'Fully customizable Instagram, Facebook & business graphics in Canva',
    icon: 'Layout',
    image: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=600&q=80',
    productCount: 42,
    featured: true,
  },
  {
    id: 'cat-3',
    name: 'Courses',
    slug: 'courses',
    description: 'Practical online video courses to master ads, marketing & design',
    icon: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    productCount: 18,
    featured: true,
  },
  {
    id: 'cat-4',
    name: 'Digital Products',
    slug: 'digital-products',
    description: 'Downloadable e-books, toolkits, prompt packs & guides',
    icon: 'Download',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    productCount: 35,
    featured: true,
  },
  {
    id: 'cat-5',
    name: 'Marketing',
    slug: 'marketing',
    description: 'Growth strategies, funnel blueprints & copywriting formulas',
    icon: 'TrendingUp',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    productCount: 19,
    featured: false,
  },
  {
    id: 'cat-6',
    name: 'Social Media',
    slug: 'social-media',
    description: 'Content calendars, caption banks & bio optimization kits',
    icon: 'Share2',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80',
    productCount: 28,
    featured: false,
  },
  {
    id: 'cat-7',
    name: 'Business Tools',
    slug: 'business-tools',
    description: 'Contracts, invoice templates, proposal decks & spreadsheets',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    productCount: 15,
    featured: false,
  },
  {
    id: 'cat-8',
    name: 'Services',
    slug: 'services',
    description: 'Done-for-you graphic design, reel editing & ad campaign setup',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    productCount: 12,
    featured: true,
  },
];

const MOCK_PRODUCTS: any[] = [];

const MOCK_COUPONS = [
  {
    id: 'coup-1',
    code: 'WELCOME50',
    discountType: 'percentage',
    discountValue: 50,
    minOrderAmount: 299,
    description: 'Get Flat 50% OFF on your first purchase',
    expiryDate: new Date('2026-12-31'),
    active: true,
  },
  {
    id: 'coup-2',
    code: 'PRO20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 199,
    description: 'Flat 20% OFF on all digital products',
    expiryDate: new Date('2026-12-31'),
    active: true,
  },
  {
    id: 'coup-3',
    code: 'AFFORD10',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 499,
    description: 'Flat ₹100 Instant Discount',
    expiryDate: new Date('2026-12-31'),
    active: true,
  }
];

async function main() {
  console.log('🌱 Starting AffordPro Database Seeding...');

  // Create Admin & Demo Users
  const passwordHash = await bcrypt.hash('Password123', 10);
  const adminPasswordHash = await bcrypt.hash('Affordpro@#4450', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'affordprojpr@affordpro.shop' },
    update: {
      name: 'Affordprojpr',
      passwordHash: adminPasswordHash,
    },
    create: {
      id: 'usr-admin-1',
      name: 'Affordprojpr',
      email: 'affordprojpr@affordpro.shop',
      phone: '+91 99999 88888',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@affordpro.com' },
    update: {},
    create: {
      id: 'usr-101',
      name: 'Rahul Sharma',
      email: 'demo@affordpro.com',
      phone: '+91 98765 43210',
      passwordHash,
      role: 'USER',
    },
  });

  console.log('👤 Users created: Admin (admin@affordpro.com), Customer (demo@affordpro.com)');

  // Seed Categories
  const categoryMap = new Map<string, string>();
  for (const cat of MOCK_CATEGORIES) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        productCount: cat.productCount,
        featured: cat.featured,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        productCount: cat.productCount,
        featured: cat.featured,
      },
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log(`📁 ${MOCK_CATEGORIES.length} Categories seeded.`);

  // Seed Products
  for (const prod of MOCK_PRODUCTS) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        shortDescription: prod.shortDescription,
        fullDescription: prod.fullDescription,
        categoryId,
        productType: prod.productType,
        images: prod.images,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        discount: prod.discount,
        currency: prod.currency,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        features: prod.features,
        whatIsIncluded: prod.whatIsIncluded,
        whoIsThisFor: prod.whoIsThisFor,
        requirements: prod.requirements,
        format: prod.format,
        deliveryMethod: prod.deliveryMethod,
        deliveryTime: prod.deliveryTime,
        accessDuration: prod.accessDuration,
        courseDuration: prod.courseDuration,
        lessons: prod.lessons,
        level: prod.level,
        tags: prod.tags,
        status: prod.status,
        downloadable: prod.downloadable,
        serviceBased: prod.serviceBased,
        featured: prod.featured,
        bestSeller: prod.bestSeller,
        newArrival: prod.newArrival,
        fileSize: prod.fileSize,
        downloadUrl: prod.downloadUrl,
      },
      create: {
        id: prod.id,
        slug: prod.slug,
        title: prod.title,
        shortDescription: prod.shortDescription,
        fullDescription: prod.fullDescription,
        categoryId,
        productType: prod.productType,
        images: prod.images,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        discount: prod.discount,
        currency: prod.currency,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        features: prod.features,
        whatIsIncluded: prod.whatIsIncluded,
        whoIsThisFor: prod.whoIsThisFor,
        requirements: prod.requirements,
        format: prod.format,
        deliveryMethod: prod.deliveryMethod,
        deliveryTime: prod.deliveryTime,
        accessDuration: prod.accessDuration,
        courseDuration: prod.courseDuration,
        lessons: prod.lessons,
        level: prod.level,
        tags: prod.tags,
        status: prod.status,
        downloadable: prod.downloadable,
        serviceBased: prod.serviceBased,
        featured: prod.featured,
        bestSeller: prod.bestSeller,
        newArrival: prod.newArrival,
        fileSize: prod.fileSize,
        downloadUrl: prod.downloadUrl,
      },
    });
  }
  console.log(`🛍️ ${MOCK_PRODUCTS.length} Products seeded.`);

  // Seed Coupons
  for (const coup of MOCK_COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coup.code },
      update: {
        discountType: coup.discountType,
        discountValue: coup.discountValue,
        minOrderAmount: coup.minOrderAmount,
        description: coup.description,
        expiryDate: coup.expiryDate,
        active: coup.active,
      },
      create: {
        id: coup.id,
        code: coup.code,
        discountType: coup.discountType,
        discountValue: coup.discountValue,
        minOrderAmount: coup.minOrderAmount,
        description: coup.description,
        expiryDate: coup.expiryDate,
        active: coup.active,
      },
    });
  }
  console.log(`🎟️ ${MOCK_COUPONS.length} Coupons seeded.`);

  console.log('✅ AffordPro Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
