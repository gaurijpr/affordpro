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

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: '1000-viral-reels-bundle',
    title: '1000+ Viral Reels Bundle (Without Watermark)',
    shortDescription: 'Ready-to-use HD vertical video reels across 10+ popular niches with captions and trending audio prompts.',
    fullDescription: `Boost your Instagram & TikTok growth effortlessly with 1000+ high-quality vertical reels ready for immediate download. No watermark, high resolution 1080x1920 MP4 format.

Includes reels for Motivation, Luxury Lifestyle, Fitness, Business Tips, AI Tech, Cooking, Travel, and Aesthetic Quotes. Simply add your logo or branding and publish!`,
    category: 'Reels Bundles',
    categorySlug: 'reels-bundles',
    productType: 'BUNDLE',
    images: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    price: 499,
    compareAtPrice: 1499,
    discount: 67,
    currency: '₹',
    rating: 4.8,
    reviewCount: 142,
    features: [
      '1000+ HD Vertical Videos (1080x1920 MP4)',
      '100% Watermark-Free & Royalty-Free',
      '10+ High-Engagement Niches Included',
      'Pre-written Viral Captions & Hashtags',
      'Instant One-Click Google Drive Access'
    ],
    whatIsIncluded: [
      '1000+ Video Clips in MP4',
      'PDF Guide with Viral Reel Strategies',
      'Excel Sheet of Trending Audio Links',
      'Lifetime Access Link'
    ],
    whoIsThisFor: [
      'Content Creators & Influencers',
      'Theme Page Owners',
      'Digital Marketers & Freelancers',
      'Small Business Owners'
    ],
    requirements: [
      'Internet connection to download files',
      'Smartphone or PC with Google Drive access'
    ],
    format: 'MP4 / ZIP / Google Drive',
    deliveryMethod: 'Instant Download',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    tags: ['reels', 'viral', 'instagram', 'tiktok', 'video bundle', 'motivation'],
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: true,
    bestSeller: true,
    newArrival: false,
    fileSize: '4.2 GB',
    downloadUrl: 'https://example.com/downloads/viral-reels-bundle.zip',
    createdAt: '2026-01-10',
    updatedAt: '2026-02-01',
  },
  {
    id: 'prod-2',
    slug: 'canva-social-media-ultimate-pack',
    title: '500+ Canva Social Media Template Kit',
    shortDescription: 'Modern, fully customizable Instagram carousel, post & story templates for Canva Free & Pro.',
    fullDescription: `Transform your social media feed into a high-converting visual experience. This pack contains 500+ premium Canva templates specially designed for creators, coaches, and brands.

Easily edit text, colors, images, and fonts in seconds using Canva's intuitive drag-and-drop editor.`,
    category: 'Canva Templates',
    categorySlug: 'canva-templates',
    productType: 'TEMPLATE',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80',
    ],
    price: 399,
    compareAtPrice: 999,
    discount: 60,
    currency: '₹',
    rating: 4.9,
    reviewCount: 98,
    features: [
      '500+ Editable Canva Templates',
      '200 Square Posts + 150 Stories + 150 Carousels',
      'Works with free Canva accounts',
      'Fully editable colors, text & fonts',
      'Commercial license included'
    ],
    whatIsIncluded: [
      'Direct Canva Template Links',
      'Video Tutorial on How to Edit in Canva',
      'Brand Color Palette Suggestions'
    ],
    whoIsThisFor: [
      'Social Media Managers',
      'Coaches & Consultants',
      'E-commerce Brands'
    ],
    requirements: [
      'Free Canva Account'
    ],
    format: 'Canva Template Links',
    deliveryMethod: 'Instant PDF with Links',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    templateCount: 500,
    tags: ['canva', 'templates', 'instagram', 'posts', 'carousels', 'graphics'],
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: true,
    bestSeller: true,
    newArrival: false,
    fileSize: '15 MB (PDF)',
    downloadUrl: 'https://example.com/downloads/canva-templates.pdf',
    createdAt: '2026-01-15',
    updatedAt: '2026-02-10',
  },
  {
    id: 'prod-3',
    slug: 'facebook-instagram-ads-masterclass',
    title: 'Facebook & Instagram Ads Masterclass 2026',
    shortDescription: 'Complete step-by-step video course to create, scale & optimize high-ROI Meta ad campaigns.',
    fullDescription: `Master Facebook and Instagram advertising with real-world case studies and zero fluff. Learn how to set up pixel tracking, build high-converting custom audiences, write killer ad copy, and scale profitable campaigns.

Includes 40+ HD video lessons, downloadable PDF checklists, and ad creative templates.`,
    category: 'Courses',
    categorySlug: 'courses',
    productType: 'COURSE',
    images: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    ],
    price: 999,
    compareAtPrice: 2999,
    discount: 67,
    currency: '₹',
    rating: 4.9,
    reviewCount: 215,
    features: [
      '42 HD Video Lessons (8.5 Hours)',
      'Meta Pixel & Conversions API Setup',
      'Audience Targeting & Retargeting Blueprint',
      'Scaling Strategies for E-commerce & Leads',
      'Ad Creative & Copywriting Templates'
    ],
    whatIsIncluded: [
      'Lifetime Course Portal Access',
      '42 Modules + Exercise Worksheets',
      'Private Q&A Support',
      'Certificate of Completion'
    ],
    whoIsThisFor: [
      'Agency Owners & Marketers',
      'E-commerce Store Owners',
      'Business Founders wanting more leads'
    ],
    requirements: [
      'Basic knowledge of Facebook Business Page',
      'Computer or Smartphone'
    ],
    format: 'Online Video Course',
    deliveryMethod: 'Instant Course Portal Access',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    courseDuration: '8.5 Hours',
    lessons: 42,
    level: 'Beginner to Advanced',
    tags: ['course', 'facebook ads', 'instagram ads', 'meta ads', 'marketing', 'roi'],
    status: 'IN_STOCK',
    downloadable: false,
    serviceBased: false,
    featured: true,
    bestSeller: true,
    newArrival: false,
    downloadUrl: 'https://example.com/courses/fb-ads-masterclass',
    createdAt: '2026-01-01',
    updatedAt: '2026-02-15',
  },
  {
    id: 'prod-4',
    slug: 'custom-canva-design-service',
    title: 'Done-For-You Custom Canva Graphic Design',
    shortDescription: 'Professional custom graphic design service for your social media, banners, ads & branding.',
    fullDescription: `Let our professional designers create stunning, custom-branded Canva graphics for your business. We design custom Instagram posts, banners, lead magnets, or ad creatives aligned with your brand guidelines.

Includes full source Canva edit links delivered directly to your inbox.`,
    category: 'Services',
    categorySlug: 'services',
    productType: 'SERVICE',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80',
    ],
    price: 1499,
    compareAtPrice: 2999,
    discount: 50,
    currency: '₹',
    rating: 5.0,
    reviewCount: 47,
    features: [
      '10 Custom Branded Graphic Designs',
      'Delivered in editable Canva source links',
      'Unlimited revisions until satisfied',
      'Turnaround in 48-72 hours',
      'Dedicated designer assigned'
    ],
    whatIsIncluded: [
      '1-on-1 Requirement Brief Intake',
      '10 High-res custom graphics',
      'Canva Edit Access Links',
      'PNG / JPG exports'
    ],
    whoIsThisFor: [
      'Busy Entrepreneurs & Creators',
      'Brands needing high-end aesthetic graphics',
      'Agencies outsourcing design work'
    ],
    requirements: [
      'Your Brand Logo & Color Guidelines',
      'Content text/ideas for graphics'
    ],
    format: 'Custom Canva Links',
    deliveryMethod: 'Email Delivery in 48-72 Hours',
    deliveryTime: '2–3 Business Days',
    accessDuration: 'Lifetime Ownership',
    tags: ['service', 'graphic design', 'canva', 'custom design', 'branding'],
    status: 'IN_STOCK',
    downloadable: false,
    serviceBased: true,
    featured: true,
    bestSeller: false,
    newArrival: true,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-20',
  },
  {
    id: 'prod-5',
    slug: 'ai-prompt-engineer-master-bundle',
    title: '5000+ AI Prompts Master Pack (ChatGPT & Midjourney)',
    shortDescription: 'Ultimate collection of copy-paste AI prompts for marketing, sales, coding, design & productivity.',
    fullDescription: `Supercharge your productivity with 5000+ tested AI prompts for ChatGPT, Claude, Midjourney, and Stable Diffusion. Covers Marketing, SEO, Copywriting, Email Campaigns, Social Media, Coding, and Image Generation.`,
    category: 'Digital Products',
    categorySlug: 'digital-products',
    productType: 'DIGITAL_PRODUCT',
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    price: 299,
    compareAtPrice: 799,
    discount: 63,
    currency: '₹',
    rating: 4.7,
    reviewCount: 84,
    features: [
      '5000+ Categorized AI Prompts',
      'ChatGPT, Claude & Midjourney Compatible',
      'Notion Database + PDF Cheat Sheet',
      'Copy-Paste Copywriting & Marketing Frameworks',
      'Free Monthly Updates'
    ],
    whatIsIncluded: [
      'Notion Workspace Access Link',
      'PDF Prompt Guide',
      'Midjourney Style Reference Sheet'
    ],
    whoIsThisFor: [
      'Copywriters & Marketers',
      'Entrepreneurs & AI Enthusiasts',
      'Content Creators'
    ],
    requirements: [
      'Free ChatGPT or AI tool account'
    ],
    format: 'Notion / PDF',
    deliveryMethod: 'Instant Download',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    tags: ['ai', 'chatgpt', 'prompts', 'midjourney', 'productivity', 'digital product'],
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: true,
    bestSeller: true,
    newArrival: false,
    fileSize: '8 MB',
    downloadUrl: 'https://example.com/downloads/ai-prompts-pack.pdf',
    createdAt: '2026-01-20',
    updatedAt: '2026-02-18',
  },
  {
    id: 'prod-6',
    slug: 'instagram-growth-accellerator-course',
    title: 'Instagram Organic Growth Blueprint 2026',
    shortDescription: 'Proven system to gain 10k+ targeted followers and monetize your Instagram audience without ads.',
    fullDescription: `Learn how to beat the algorithm, create viral content consistently, optimize your profile for conversions, and turn followers into paying customers. Packed with real case studies and actionable frameworks.`,
    category: 'Courses',
    categorySlug: 'courses',
    productType: 'COURSE',
    images: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    ],
    price: 699,
    compareAtPrice: 1999,
    discount: 65,
    currency: '₹',
    rating: 4.8,
    reviewCount: 112,
    features: [
      '28 Video Lessons (5.5 Hours)',
      'Algorithm Secrets & Reel Optimization',
      'Bio & Highlight Funnel Conversion Strategy',
      'Monetization Blueprint for Products & Affiliates'
    ],
    whatIsIncluded: [
      'Video Course Portal Access',
      'Downloadable Content Calendar Template',
      'Hashtag & Audio Research Sheet'
    ],
    whoIsThisFor: [
      'Instagram Creators & Influencers',
      'Small Business Owners',
      'Freelancers looking for clients'
    ],
    requirements: [
      'Instagram account'
    ],
    format: 'Online Video Course',
    deliveryMethod: 'Instant Access',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    courseDuration: '5.5 Hours',
    lessons: 28,
    level: 'All Levels',
    tags: ['instagram', 'growth', 'course', 'monetization', 'social media'],
    status: 'IN_STOCK',
    downloadable: false,
    serviceBased: false,
    featured: false,
    bestSeller: false,
    newArrival: true,
    downloadUrl: 'https://example.com/courses/ig-growth',
    createdAt: '2026-02-05',
    updatedAt: '2026-02-22',
  },
  {
    id: 'prod-7',
    slug: 'reels-video-editing-service',
    title: 'Professional Reels & Shorts Video Editing Service',
    shortDescription: 'Turn raw videos into high-retention Alex Hormozi style vertical short videos with captions & FX.',
    fullDescription: `Send us your raw spoken videos and we will edit them into viral short-form content with dynamic captions, sound effects, B-roll footage, and pop-up graphics. Perfect for Instagram Reels, YouTube Shorts, and TikTok.`,
    category: 'Services',
    categorySlug: 'services',
    productType: 'SERVICE',
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'
    ],
    price: 1999,
    compareAtPrice: 3999,
    discount: 50,
    currency: '₹',
    rating: 4.9,
    reviewCount: 36,
    features: [
      '5 Edited Vertical Short Videos (Up to 60s each)',
      'Dynamic Animated Captions & Subtitles',
      'Sound FX, Transitions & Background Music',
      'Relevant Stock Footage & Image Pop-ups',
      '2 Rounds of Free Revisions'
    ],
    whatIsIncluded: [
      'Direct Drive Upload Link for Raw Files',
      '5 Final Rendered MP4 Files',
      'Thumbnail Covers Included'
    ],
    whoIsThisFor: [
      'Podcasters & Speakers',
      'Coaches & Educators',
      'Founders creating personal brand content'
    ],
    requirements: [
      'Raw video clips recorded in good lighting'
    ],
    format: 'MP4 Video Files',
    deliveryMethod: 'Google Drive Link in 3-4 Days',
    deliveryTime: '3-4 Days',
    accessDuration: 'Full Ownership',
    tags: ['service', 'video editing', 'reels', 'shorts', 'hormozi style'],
    status: 'IN_STOCK',
    downloadable: false,
    serviceBased: true,
    featured: false,
    bestSeller: false,
    newArrival: true,
    createdAt: '2026-02-12',
    updatedAt: '2026-02-23',
  },
  {
    id: 'prod-8',
    slug: 'business-contract-legal-toolkit',
    title: 'Ultimate Freelancer & Agency Contract Legal Templates',
    shortDescription: '15+ Lawyer-drafted customizable agreements for client services, NDA, proposals & invoices.',
    fullDescription: `Protect your business and get paid faster with professional legal agreement templates. Fully editable in Microsoft Word, Google Docs, and PDF formats. Includes Client Master Services Agreement, Non-Disclosure Agreement (NDA), Project Scope Contract, Payment Terms Agreement, and Revision Policy.`,
    category: 'Business Tools',
    categorySlug: 'business-tools',
    productType: 'DIGITAL_PRODUCT',
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    ],
    price: 349,
    compareAtPrice: 1299,
    discount: 73,
    currency: '₹',
    rating: 4.9,
    reviewCount: 64,
    features: [
      '15+ Editable Legal Contract Templates',
      'Word (.docx), Google Docs & PDF Formats',
      'Lawyer-Reviewed & Industry Standard',
      'Covers Scope Creep, Payment Terms & IP Rights'
    ],
    whatIsIncluded: [
      'ZIP Bundle with all 15 Docs',
      'Guide on how to customize contract fields'
    ],
    whoIsThisFor: [
      'Freelance Designers & Developers',
      'Digital Marketing Agencies',
      'Consultants & Service Providers'
    ],
    requirements: [
      'Microsoft Word or Google Docs'
    ],
    format: 'DOCX / PDF / Google Docs',
    deliveryMethod: 'Instant Download',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    tags: ['business', 'legal', 'contracts', 'freelancer', 'agency', 'templates'],
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: false,
    bestSeller: true,
    newArrival: false,
    fileSize: '4.5 MB',
    downloadUrl: 'https://example.com/downloads/contract-templates.zip',
    createdAt: '2026-01-18',
    updatedAt: '2026-02-14',
  },
  {
    id: 'prod-9',
    slug: 'youtube-viral-thumbnail-templates',
    title: '100+ High-CTR YouTube Thumbnail Canva Templates',
    shortDescription: 'Click-boosting thumbnail templates designed for Gaming, Tech, Finance, Vlogs & Tutorials.',
    fullDescription: `Double your YouTube Click-Through Rate (CTR) with high-impact, professionally designed thumbnail templates. Created according to proven YouTube visual psychological principles.`,
    category: 'Canva Templates',
    categorySlug: 'canva-templates',
    productType: 'TEMPLATE',
    images: [
      'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    ],
    price: 249,
    compareAtPrice: 699,
    discount: 64,
    currency: '₹',
    rating: 4.8,
    reviewCount: 79,
    features: [
      '100+ Editable Thumbnail Templates (1280x720)',
      'Designed for High CTR (Tested 10%+ CTR)',
      'Free Canva Account compatible',
      'Includes cutout effects & neon text styles'
    ],
    whatIsIncluded: [
      'Canva Edit Links PDF',
      'Thumbnail Design Guidelines PDF'
    ],
    whoIsThisFor: [
      'YouTubers & Video Editors',
      'Content Creators & Educators'
    ],
    requirements: [
      'Free Canva account'
    ],
    format: 'Canva Links',
    deliveryMethod: 'Instant Download',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    templateCount: 100,
    tags: ['youtube', 'thumbnails', 'canva', 'ctr', 'templates'],
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: false,
    bestSeller: false,
    newArrival: true,
    fileSize: '3 MB',
    downloadUrl: 'https://example.com/downloads/youtube-thumbnails.pdf',
    createdAt: '2026-02-10',
    updatedAt: '2026-02-21',
  },
  {
    id: 'prod-10',
    slug: 'social-media-content-calendar-2026',
    title: '365 Days Social Media Content Calendar 2026',
    shortDescription: 'Never run out of post ideas again with 365 daily content prompts, captions & holiday dates.',
    fullDescription: `Plan a full year of engaging social media content in minutes. Comes in Notion and Google Sheets format with daily content hooks, industry holiday reminders, call-to-action prompts, and status trackers.`,
    category: 'Social Media',
    categorySlug: 'social-media',
    productType: 'DIGITAL_PRODUCT',
    images: [
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    ],
    price: 199,
    compareAtPrice: 599,
    discount: 67,
    currency: '₹',
    rating: 4.7,
    reviewCount: 156,
    features: [
      '365 Daily Content Prompts for 2026',
      'Notion Dashboard + Google Sheets',
      '50+ High-Converting CTA Formulas',
      '100+ Plug-and-Play Caption Templates'
    ],
    whatIsIncluded: [
      'Notion Template Duplicate Link',
      'Google Sheets Link',
      'PDF Cheat Sheet'
    ],
    whoIsThisFor: [
      'Social Media Managers',
      'Small Business Owners',
      'Creators & Bloggers'
    ],
    requirements: [
      'Google Account or Notion Account'
    ],
    format: 'Notion / Google Sheets',
    deliveryMethod: 'Instant Link Access',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    tags: ['social media', 'content calendar', 'notion', 'planning', 'marketing'],
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: false,
    bestSeller: true,
    newArrival: false,
    downloadUrl: 'https://example.com/downloads/content-calendar-2026',
    createdAt: '2026-01-05',
    updatedAt: '2026-02-11',
  },
  {
    id: 'prod-11',
    slug: 'facebook-ads-setup-service',
    title: 'Done-For-You Facebook Ads Campaign Setup Service',
    shortDescription: 'Complete technical setup of your Meta ad manager, pixel, custom audiences & 2 initial campaigns.',
    fullDescription: `Overwhelmed by Facebook Business Manager? Our certified ads expert will handle your complete technical setup, domain verification, CAPI pixel integration, custom audience creation, and launch your first 2 ad campaigns.`,
    category: 'Services',
    categorySlug: 'services',
    productType: 'SERVICE',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
    ],
    price: 2999,
    compareAtPrice: 5999,
    discount: 50,
    currency: '₹',
    rating: 5.0,
    reviewCount: 29,
    features: [
      'Full Meta Business Manager Setup',
      'Pixel & Conversions API (CAPI) Integration',
      'Domain Verification & Event Setup',
      '2 Custom Ad Campaigns Setup (Lead / Sales)',
      '3 Days Post-Launch Monitoring'
    ],
    whatIsIncluded: [
      'Initial 30-min strategy call',
      'Complete backend configuration',
      'Screen-share walkthrough video'
    ],
    whoIsThisFor: [
      'Store owners struggling with tech setup',
      'Local service businesses needing leads',
      'Coaches launching webinars'
    ],
    requirements: [
      'Facebook Business Page & Ad Account Admin Access'
    ],
    format: 'Live Account Setup',
    deliveryMethod: 'Service completed within 3 business days',
    deliveryTime: '3 Business Days',
    accessDuration: 'Lifetime Setup',
    tags: ['service', 'facebook ads', 'meta ads setup', 'pixel setup', 'marketing'],
    status: 'IN_STOCK',
    downloadable: false,
    serviceBased: true,
    featured: true,
    bestSeller: false,
    newArrival: true,
    createdAt: '2026-02-15',
    updatedAt: '2026-02-24',
  },
  {
    id: 'prod-12',
    slug: 'digital-marketing-ebook-playbook',
    title: 'Zero to $10k Digital Product Mastery E-book',
    shortDescription: 'Comprehensive 120-page step-by-step guide to create, market & scale digital products online.',
    fullDescription: `The ultimate blueprint for building a profitable online digital product store. Covers market research, product creation, landing page design, email funnels, and automated traffic generation.`,
    category: 'Digital Products',
    categorySlug: 'digital-products',
    productType: 'DIGITAL_PRODUCT',
    images: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    price: 199,
    compareAtPrice: 499,
    discount: 60,
    currency: '₹',
    rating: 4.8,
    reviewCount: 92,
    features: [
      '120-Page Illustrated PDF E-book',
      'Product Idea Validation Checklist',
      'High-Converting Landing Page Wireframes',
      'Email Funnel Sequence Scripts'
    ],
    whatIsIncluded: [
      'Instant Download PDF E-book',
      'Bonus Audio Version (MP3)'
    ],
    whoIsThisFor: [
      'Aspiring Digital Entrepreneurs',
      'Content Creators wanting passive income'
    ],
    requirements: [
      'PDF Reader on any device'
    ],
    format: 'PDF / MP3',
    deliveryMethod: 'Instant Download',
    deliveryTime: 'Instant',
    accessDuration: 'Lifetime Access',
    tags: ['ebook', 'digital product', 'marketing', 'guide', 'passive income'],
    status: 'IN_STOCK',
    downloadable: true,
    serviceBased: false,
    featured: false,
    bestSeller: false,
    newArrival: false,
    fileSize: '12 MB',
    downloadUrl: 'https://example.com/downloads/digital-product-mastery.pdf',
    createdAt: '2026-01-12',
    updatedAt: '2026-02-15',
  }
];

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
