import { Product } from '../types/product';
import { Category } from '../types/category';
import { Review } from '../types/review';
import { Coupon } from '../types/coupon';
import { Order } from '../types/order';

export const MOCK_CATEGORIES: Category[] = [
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

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_REVIEWS: Record<string, Review[]> = {
  'prod-1': [
    {
      id: 'rev-1',
      productId: 'prod-1',
      userName: 'Rahul Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      date: '2026-02-18',
      title: 'Game changer for my Instagram page!',
      comment: 'The video quality is top notch and 100% watermark free as promised. Gained over 4,000 followers in 2 weeks posting 2 reels daily!',
      verifiedPurchase: true,
    },
    {
      id: 'rev-2',
      productId: 'prod-1',
      userName: 'Priya Patel',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      date: '2026-02-10',
      title: 'Amazing value for ₹499',
      comment: 'Google drive link worked instantly after payment. The trending audio links spreadsheet is super helpful.',
      verifiedPurchase: true,
    },
    {
      id: 'rev-3',
      productId: 'prod-1',
      userName: 'Vikram Singh',
      rating: 4,
      date: '2026-01-28',
      title: 'Great content collection',
      comment: 'Very good variety of video clips. Easy to download and edit in CapCut or Premiere.',
      verifiedPurchase: true,
    }
  ],
  'prod-2': [
    {
      id: 'rev-4',
      productId: 'prod-2',
      userName: 'Ananya Verma',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating: 5,
      date: '2026-02-20',
      title: 'Saves so much design time!',
      comment: 'I manage 4 client accounts and these Canva templates gave me a whole month of content in just 2 hours. Highly recommended!',
      verifiedPurchase: true,
    }
  ]
};

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'AFFORD10',
    discountType: 'percentage',
    discountValue: 10,
    description: 'Get 10% OFF on any digital product',
    expiryDate: '2026-12-31',
  },
  {
    code: 'PRO20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 999,
    description: 'Get 20% OFF on orders above ₹999',
    expiryDate: '2026-12-31',
  },
  {
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 299,
    description: 'Flat ₹50 OFF for new customers',
    expiryDate: '2026-12-31',
  }
];

export const MOCK_USER_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AP-2026-8831',
    date: '2026-02-20',
    customerName: 'Demo User',
    customerEmail: 'user@affordpro.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        productId: 'prod-1',
        productTitle: '1000+ Viral Reels Bundle (Without Watermark)',
        productImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80',
        productType: 'BUNDLE',
        price: 499,
        quantity: 1,
        downloadUrl: 'https://example.com/downloads/viral-reels-bundle.zip'
      },
      {
        productId: 'prod-5',
        productTitle: '5000+ AI Prompts Master Pack (ChatGPT & Midjourney)',
        productImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&q=80',
        productType: 'DIGITAL_PRODUCT',
        price: 299,
        quantity: 1,
        downloadUrl: 'https://example.com/downloads/ai-prompts-pack.pdf'
      }
    ],
    subtotal: 798,
    discount: 50,
    tax: 0,
    total: 748,
    paymentMethod: 'UPI / Razorpay',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    couponCode: 'WELCOME50'
  },
  {
    id: 'ord-1002',
    orderNumber: 'AP-2026-9412',
    date: '2026-02-14',
    customerName: 'Demo User',
    customerEmail: 'user@affordpro.com',
    items: [
      {
        productId: 'prod-3',
        productTitle: 'Facebook & Instagram Ads Masterclass 2026',
        productImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
        productType: 'COURSE',
        price: 999,
        quantity: 1,
        accessUrl: '/account?tab=courses'
      }
    ],
    subtotal: 999,
    discount: 0,
    tax: 0,
    total: 999,
    paymentMethod: 'Credit Card',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED'
  }
];
