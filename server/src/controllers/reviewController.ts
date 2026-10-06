import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

interface CreatorReviewItem {
  id: string;
  productId?: string;
  productTitle?: string;
  userName: string;
  role: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
}

const DEFAULT_CREATOR_REVIEWS: CreatorReviewItem[] = [
  {
    id: 'rev-def-1',
    productId: 'default-1',
    productTitle: '1000+ Viral Reels Bundle',
    userName: 'Priya Sharma',
    role: 'Content Creator & SMM',
    rating: 5,
    title: 'Gained 45k followers in 30 days!',
    comment: 'The 1000+ Viral Reels Bundle saved me hundreds of hours! Top notch video quality and 100% functional templates.',
    verifiedPurchase: true,
    date: '2026-03-15',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-2',
    productId: 'default-2',
    productTitle: 'Canva Master Pro Templates',
    userName: 'Rohan Verma',
    role: 'Digital Agency Owner',
    rating: 5,
    title: 'My secret vault for high-converting templates',
    comment: 'AffordPro is my go-to store for Canva templates and marketing courses. Instant drive access right after payment!',
    verifiedPurchase: true,
    date: '2026-03-18',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-3',
    productId: 'default-3',
    productTitle: 'Meta Ads Masterclass',
    userName: 'Ananya Patel',
    role: 'E-commerce Brand Founder',
    rating: 5,
    title: 'Instant clarity & 100% working assets',
    comment: 'Super easy to download and customize. The Meta ads course and prompt pack gave my business immediate sales momentum.',
    verifiedPurchase: true,
    date: '2026-03-22',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-4',
    productId: 'default-4',
    productTitle: 'AI Content Prompt Vault',
    userName: 'Vikram Mehta',
    role: 'Freelance Graphic Designer',
    rating: 5,
    title: 'Outstanding quality and lifetime access',
    comment: 'The Canva bundle templates are super clean and easy to edit. Saved me so much time on client work!',
    verifiedPurchase: true,
    date: '2026-03-25',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-5',
    productId: 'default-5',
    productTitle: 'Instagram Growth Bundle',
    userName: 'Sneha Roy',
    role: 'Instagram Growth Coach',
    rating: 5,
    title: 'Unbelievable value for creators',
    comment: 'High engagement reel templates that boost reach naturally. My clients love the content generated from these bundles.',
    verifiedPurchase: true,
    date: '2026-03-28',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-6',
    productId: 'default-6',
    productTitle: 'High-ROAS Ad Copy Suite',
    userName: 'Karan Malhotra',
    role: 'Performance Marketer',
    rating: 5,
    title: 'ROAS increased dramatically',
    comment: 'The ad templates and AI prompts are tailored for high conversion rates. Best digital investment this year.',
    verifiedPurchase: true,
    date: '2026-03-30',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-7',
    productId: 'default-7',
    productTitle: 'Canva Business Toolkit',
    userName: 'Neha Gupta',
    role: 'Small Business Owner',
    rating: 5,
    title: 'Fast instant download & zero hassle',
    comment: 'Got my download link right on screen and in my email. Templates work on free Canva accounts perfectly!',
    verifiedPurchase: true,
    date: '2026-04-01',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-8',
    productId: 'default-8',
    productTitle: 'Ready Made Cartoon Food Reels',
    userName: 'Rahul Deshmukh',
    role: 'Video Editor & Producer',
    rating: 5,
    title: 'Crisp 4K video clips & reels',
    comment: 'Ready-made cartoon food & viral reel bundles are top quality. No watermarks, easy to use right away.',
    verifiedPurchase: true,
    date: '2026-04-02',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-9',
    productId: 'default-9',
    productTitle: 'Social Media Management Kit',
    userName: 'Pooja Nair',
    role: 'Social Media Manager',
    rating: 5,
    title: 'Extremely helpful 24/7 support',
    comment: 'Had a quick question about unzipping files and support answered in 5 minutes. 100% recommended!',
    verifiedPurchase: true,
    date: '2026-04-03',
    userAvatar: undefined,
  },
  {
    id: 'rev-def-10',
    productId: 'default-10',
    productTitle: 'Digital Course Creator Pass',
    userName: 'Amitav Sengupta',
    role: 'Course Creator & Entrepreneur',
    rating: 5,
    title: 'Complete digital ecosystem in one place',
    comment: 'From e-books to Canva kits, AffordPro delivers genuine value. Will definitely purchase again!',
    verifiedPurchase: true,
    date: '2026-04-04',
    userAvatar: undefined,
  },
];

// Get product specific reviews
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = (Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId) as string;

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
        userAvatar: undefined, // No image in reviews as per user requirement
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

// Get featured 10 creator reviews for frontend "What Our Creators Say"
export const getFeaturedReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 10;
    
    let dbReviews: any[] = [];
    try {
      dbReviews = await prisma.review.findMany({
        where: { approved: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { title: true } } },
      });
    } catch (e) {
      console.warn('Database review query notice:', e);
    }

    const formattedDb: CreatorReviewItem[] = dbReviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      productTitle: r.product?.title || 'Verified Digital Product',
      userName: r.userName,
      role: 'Verified Creator',
      userAvatar: undefined,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      verifiedPurchase: r.verifiedPurchase,
      date: r.createdAt.toISOString().split('T')[0],
    }));

    // Fill up to 10 with default creator text reviews if fewer exist
    let result: CreatorReviewItem[] = [...formattedDb];
    if (result.length < limit) {
      const needed = limit - result.length;
      const fill = DEFAULT_CREATOR_REVIEWS.slice(0, needed);
      result = [...result, ...fill];
    }

    res.json(result.slice(0, limit));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add product review
export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productId = (Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId) as string;
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

// Update review by ID (Admin / Backend Update Feature)
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const { userName, rating, title, comment, approved, verifiedPurchase } = req.body;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(userName && { userName }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(title !== undefined && { title }),
        ...(comment !== undefined && { comment }),
        ...(approved !== undefined && { approved: Boolean(approved) }),
        ...(verifiedPurchase !== undefined && { verifiedPurchase: Boolean(verifiedPurchase) }),
      },
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: {
        id: updated.id,
        productId: updated.productId,
        userName: updated.userName,
        rating: updated.rating,
        title: updated.title,
        comment: updated.comment,
        approved: updated.approved,
        verifiedPurchase: updated.verifiedPurchase,
        date: updated.createdAt.toISOString().split('T')[0],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review by ID (Admin / Backend Delete Feature)
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      res.json({ success: true, message: 'Review already deleted or not found' });
      return;
    }

    await prisma.review.delete({ where: { id } });

    // Recalculate product rating
    if (existing.productId) {
      const allReviews = await prisma.review.findMany({ where: { productId: existing.productId } });
      const avgRating = allReviews.length > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length : 5.0;

      await prisma.product.update({
        where: { id: existing.productId },
        data: {
          rating: Number(avgRating.toFixed(1)),
          reviewCount: allReviews.length,
        },
      });
    }

    res.json({ success: true, message: 'Review deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
