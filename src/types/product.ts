export type ProductType = 
  | 'DIGITAL_PRODUCT' 
  | 'TEMPLATE' 
  | 'COURSE' 
  | 'SERVICE' 
  | 'BUNDLE';

export type ProductStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER';

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  categorySlug: string;
  productType: ProductType;
  images: string[];
  video?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number; // percentage e.g. 67
  currency: string; // e.g. '₹'
  rating: number;
  reviewCount: number;
  features: string[];
  whatIsIncluded: string[];
  whoIsThisFor: string[];
  requirements: string[];
  format?: string; // e.g. 'ZIP', 'PDF', 'Canva', 'MP4', 'Google Drive', 'Online Course'
  deliveryMethod?: string; // e.g. 'Instant Download', 'Access within 24 hours', 'Service delivery: 2–3 days'
  deliveryTime?: string; // e.g. 'Instant', '2-3 Business Days'
  accessDuration?: string; // e.g. 'Lifetime Access', '1 Year'
  courseDuration?: string; // e.g. '8.5 Hours'
  lessons?: number; // e.g. 42
  level?: string; // e.g. 'All Levels', 'Beginner', 'Intermediate'
  tags: string[];
  status: ProductStatus;
  downloadable: boolean;
  serviceBased: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  fileSize?: string;
  templateCount?: number;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterState {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string; // 'under-199', '199-499', '499-999', '999-plus'
  productType?: ProductType | 'PRODUCTS_ONLY' | 'ALL';
  minRating?: number;
  inStockOnly?: boolean;
  bestSellerOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
