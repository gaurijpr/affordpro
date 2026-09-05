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

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    slug: '1000-viral-reels-bundle',
    title: '1000+ Viral Reels Bundle (Without Watermark)',
    shortDescription: 'Ready-to-use HD vertical video reels across 10+ popular niches with captions and trending audio prompts.',
    fullDescription: 'Boost your Instagram & TikTok growth effortlessly with 1000+ high-quality vertical reels ready for immediate download. No watermark, high resolution 1080x1920 MP4 format.',
    categorySlug: 'reels-bundles',
    productType: 'BUNDLE',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80'
    ]),
    price: 499,
    compareAtPrice: 1499,
    discount: 67,
    currency: '₹',
    rating: 4.8,
    reviewCount: 142,
    features: JSON.stringify(['1000+ HD Vertical Videos', '100% Watermark-Free', 'Instant Access']),
    whatIsIncluded: JSON.stringify(['1000+ Video Clips in MP4', 'PDF Strategy Guide']),
    whoIsThisFor: JSON.stringify(['Content Creators', 'Digital Marketers']),
    requirements: JSON.stringify(['Internet Connection']),
    format: 'MP4 / ZIP / Google Drive',
    deliveryMethod: 'Instant Download',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    tags: JSON.stringify(['reels', 'viral', 'instagram', 'video bundle']),
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: true,
    bestSeller: true,
    newArrival: false,
    fileSize: '4.2 GB',
    downloadUrl: 'https://example.com/downloads/viral-reels-bundle.zip',
  },
  {
    id: 'prod-2',
    slug: '500-canva-social-media-templates',
    title: '500+ Premium Canva Social Media Templates',
    shortDescription: 'Fully customizable Instagram post & carousel templates for Canva. Easily change colors, photos, and fonts.',
    fullDescription: 'Elevate your social media feed in minutes! Designed for entrepreneurs, coaches, and creators who want cohesive branding without hiring a full-time designer.',
    categorySlug: 'canva-templates',
    productType: 'TEMPLATE',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'
    ]),
    price: 399,
    compareAtPrice: 1199,
    discount: 67,
    currency: '₹',
    rating: 4.9,
    reviewCount: 98,
    features: JSON.stringify(['500+ Canva Templates', '100% Customizable', 'Carousels Included']),
    whatIsIncluded: JSON.stringify(['Direct Canva Links', 'Tutorial Video']),
    whoIsThisFor: JSON.stringify(['Social Media Managers', 'Coaches']),
    requirements: JSON.stringify(['Free Canva Account']),
    format: 'Canva Template Links',
    deliveryMethod: 'Instant PDF with Links',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    tags: JSON.stringify(['canva', 'templates', 'instagram']),
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: true,
    bestSeller: true,
    newArrival: false,
    fileSize: '15 MB',
    downloadUrl: 'https://example.com/downloads/canva-templates.pdf',
  },
  {
    id: 'prod-3',
    slug: 'facebook-instagram-ads-masterclass',
    title: 'Facebook & Instagram Ads Masterclass 2026',
    shortDescription: 'Complete step-by-step video course to create, scale & optimize high-ROI Meta ad campaigns.',
    fullDescription: 'Master Facebook and Instagram advertising with real-world case studies and zero fluff. Learn how to set up pixel tracking, build custom audiences, and scale profitable campaigns.',
    categorySlug: 'courses',
    productType: 'COURSE',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ]),
    price: 999,
    compareAtPrice: 2999,
    discount: 67,
    currency: '₹',
    rating: 4.9,
    reviewCount: 215,
    features: JSON.stringify(['42 HD Video Lessons', 'Pixel Setup', 'Retargeting Blueprint']),
    whatIsIncluded: JSON.stringify(['Lifetime Portal Access', '42 Modules']),
    whoIsThisFor: JSON.stringify(['Agency Owners', 'E-commerce Owners']),
    requirements: JSON.stringify(['Facebook Business Page']),
    format: 'Online Course / HD Video',
    deliveryMethod: 'Instant Portal Access',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    courseDuration: '8.5 Hours',
    lessons: 42,
    level: 'All Levels',
    tags: JSON.stringify(['course', 'facebook ads', 'marketing']),
    status: 'IN_STOCK',
    downloadable: false,
    serviceBased: false,
    featured: true,
    bestSeller: true,
    newArrival: false,
  },
  {
    id: 'prod-4',
    slug: 'custom-canva-graphic-design-service',
    title: 'Custom Canva Graphic Design Service (10 Designs)',
    shortDescription: 'Done-for-you custom branded graphic design package. Get 10 tailor-made designs created in Canva.',
    fullDescription: 'Short on time or design skills? Let our professional design team handle your social media posts, promotional banners, and marketing assets.',
    categorySlug: 'services',
    productType: 'SERVICE',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    ]),
    price: 1499,
    compareAtPrice: 2999,
    discount: 50,
    currency: '₹',
    rating: 5.0,
    reviewCount: 47,
    features: JSON.stringify(['10 Custom Designs', 'Editable Canva Links', '48-72 Hour Delivery']),
    whatIsIncluded: JSON.stringify(['10 High-res custom graphics', 'Source Links']),
    whoIsThisFor: JSON.stringify(['Busy Creators', 'Brands']),
    requirements: JSON.stringify(['Brand Logo & Colors']),
    format: 'Custom Canva Links',
    deliveryMethod: 'Email Delivery in 48-72 Hours',
    deliveryTime: '2–3 Business Days',
    accessDuration: 'Lifetime Ownership',
    tags: JSON.stringify(['service', 'graphic design', 'canva']),
    status: 'IN_STOCK',
    downloadable: false,
    serviceBased: true,
    featured: true,
    bestSeller: false,
    newArrival: true,
  },
  {
    id: 'prod-5',
    slug: 'ai-prompt-engineer-master-bundle',
    title: '5000+ AI Prompts Master Pack (ChatGPT & Midjourney)',
    shortDescription: 'Ultimate collection of copy-paste AI prompts for marketing, sales, coding, design & productivity.',
    fullDescription: 'Supercharge your productivity with 5000+ tested AI prompts for ChatGPT, Claude, Midjourney, and Stable Diffusion.',
    categorySlug: 'digital-products',
    productType: 'DIGITAL_PRODUCT',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80'
    ]),
    price: 299,
    compareAtPrice: 799,
    discount: 63,
    currency: '₹',
    rating: 4.7,
    reviewCount: 84,
    features: JSON.stringify(['5000+ Categorized AI Prompts', 'ChatGPT & Midjourney Compatible']),
    whatIsIncluded: JSON.stringify(['Notion Workspace Access', 'PDF Prompt Guide']),
    whoIsThisFor: JSON.stringify(['Marketers', 'Creators']),
    requirements: JSON.stringify(['Free ChatGPT account']),
    format: 'Notion / PDF',
    deliveryMethod: 'Instant Download',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    tags: JSON.stringify(['ai', 'chatgpt', 'prompts']),
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: true,
    bestSeller: true,
    newArrival: false,
    fileSize: '8 MB',
    downloadUrl: 'https://example.com/downloads/ai-prompts-pack.pdf',
  }
];

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
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@affordpro.com' },
    update: {},
    create: {
      id: 'usr-admin-1',
      name: 'AffordPro Admin',
      email: 'admin@affordpro.com',
      phone: '+91 99999 88888',
      passwordHash,
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
