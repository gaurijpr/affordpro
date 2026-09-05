import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number; // Defaults to 1 for digital products
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  appliedCoupon?: {
    code: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
  };
  tax: number;
  total: number;
}
