import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, total } = req.query;
    if (!code) {
      res.status(400).json({ valid: false, message: 'Coupon code is required.' });
      return;
    }

    const couponCode = String(code).trim().toUpperCase();
    const cartTotal = Number(total) || 0;

    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon || !coupon.active) {
      res.status(404).json({ valid: false, message: 'Invalid or inactive coupon code.' });
      return;
    }

    if (coupon.expiryDate < new Date()) {
      res.status(400).json({ valid: false, message: 'This coupon has expired.' });
      return;
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      res.status(400).json({
        valid: false,
        message: `Coupon ${coupon.code} requires a minimum order of ₹${coupon.minOrderAmount}.`,
      });
      return;
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount || undefined,
        maxDiscount: coupon.maxDiscount || undefined,
        description: coupon.description,
        expiryDate: coupon.expiryDate.toISOString().split('T')[0],
      },
      message: `Coupon ${coupon.code} applied successfully!`,
    });
  } catch (error: any) {
    res.status(500).json({ valid: false, message: error.message });
  }
};
