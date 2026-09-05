import { Coupon } from '../types/coupon';
import { MOCK_COUPONS } from '../mock/data';
import { fetchApi } from './api';

export const couponService = {
  async validateCoupon(code: string, cartTotal: number): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> {
    try {
      return await fetchApi<{ valid: boolean; coupon?: Coupon; message?: string }>(`/coupons/validate?code=${code}&total=${cartTotal}`);
    } catch {
      const found = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      if (!found) {
        return { valid: false, message: 'Invalid coupon code. Try AFFORD10 or PRO20.' };
      }

      if (found.minOrderAmount && cartTotal < found.minOrderAmount) {
        return { valid: false, message: `Coupon ${found.code} requires minimum order of ₹${found.minOrderAmount}.` };
      }

      return { valid: true, coupon: found, message: `Coupon ${found.code} applied successfully!` };
    }
  }
};
