export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name or image path
  image?: string;
  productCount: number;
  featured?: boolean;
}
