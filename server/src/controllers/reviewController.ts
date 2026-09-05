import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId as string;

    let product = await prisma.product.findFirst({
      where: { OR: [{ id: productId }, { slug: productId }] },
    });

    const targetId = product ? product.id : productId;

    const reviews = await prisma.review.findMany({
      where: { productId: targetId, approved: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(
      reviews.map((r) => ({
        id: r.id,
        productId: r.productId,
        userName: r.userName,
        userAvatar: r.userAvatar || undefined,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        verifiedPurchase: r.verifiedPurchase,
        date: r.createdAt.toISOString().split('T')[0],
      }))
    );
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId as string;
    const { rating, title, comment, userName } = req.body;

    let product = await prisma.product.findFirst({
      where: { OR: [{ id: productId }, { slug: productId }] },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: req.user?.id || undefined,
        userName: userName || req.user?.email.split('@')[0] || 'Verified Buyer',
        rating: Number(rating) || 5,
        title: title || 'Great product!',
        comment: comment || '',
        verifiedPurchase: true,
        approved: true,
      },
    });

    const allReviews = await prisma.review.findMany({ where: { productId: product.id } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating: Number(avgRating.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    res.json({
      id: review.id,
      productId: review.productId,
      userName: review.userName,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      verifiedPurchase: review.verifiedPurchase,
      date: review.createdAt.toISOString().split('T')[0],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
