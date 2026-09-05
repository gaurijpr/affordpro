import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to format Prisma Product into frontend expected structure
export const formatProduct = (p: any) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  shortDescription: p.shortDescription,
  fullDescription: p.fullDescription,
  category: p.category ? p.category.name : 'Digital Products',
  categorySlug: p.category ? p.category.slug : 'digital-products',
  productType: p.productType,
  images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
  video: p.video || undefined,
  price: p.price,
  compareAtPrice: p.compareAtPrice || undefined,
  discount: p.discount || undefined,
  currency: p.currency || '₹',
  rating: p.rating,
  reviewCount: p.reviewCount,
  features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
  whatIsIncluded: typeof p.whatIsIncluded === 'string' ? JSON.parse(p.whatIsIncluded) : p.whatIsIncluded,
  whoIsThisFor: typeof p.whoIsThisFor === 'string' ? JSON.parse(p.whoIsThisFor) : p.whoIsThisFor,
  requirements: typeof p.requirements === 'string' ? JSON.parse(p.requirements) : p.requirements,
  format: p.format || undefined,
  deliveryMethod: p.deliveryMethod || undefined,
  deliveryTime: p.deliveryTime || undefined,
  accessDuration: p.accessDuration || undefined,
  courseDuration: p.courseDuration || undefined,
  lessons: p.lessons || undefined,
  level: p.level || undefined,
  tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
  status: p.status,
  downloadable: p.downloadable,
  serviceBased: p.serviceBased,
  featured: p.featured,
  bestSeller: p.bestSeller,
  newArrival: p.newArrival,
  fileSize: p.fileSize || undefined,
  templateCount: p.templateCount || undefined,
  downloadUrl: p.downloadUrl || undefined,
  createdAt: p.createdAt.toISOString().split('T')[0],
  updatedAt: p.updatedAt.toISOString().split('T')[0],
});

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, type, q, sort, minPrice, maxPrice, minRating, bestseller } = req.query;

    let where: any = { active: true };

    if (category) {
      where.category = { slug: String(category) };
    }

    if (type && type !== 'ALL') {
      if (type === 'PRODUCTS_ONLY') {
        where.productType = { not: 'SERVICE' };
      } else {
        where.productType = String(type);
      }
    }

    if (bestseller === 'true') {
      where.bestSeller = true;
    }

    if (q) {
      const search = String(q).toLowerCase();
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { fullDescription: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (minRating) {
      where.rating = { gte: Number(minRating) };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    });

    res.json(products.map(formatProduct));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findFirst({
      where: { slug, active: true },
      include: { category: true },
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    res.json(formatProduct(product));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true, active: true },
      include: { category: true },
    });
    res.json(products.map(formatProduct));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestSellers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { bestSeller: true, active: true },
      include: { category: true },
    });
    res.json(products.map(formatProduct));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNewArrivals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { category: true },
    });
    res.json(products.map(formatProduct));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;
    const currentProduct = await prisma.product.findUnique({ where: { slug } });
    if (!currentProduct) {
      res.json([]);
      return;
    }

    const related = await prisma.product.findMany({
      where: {
        active: true,
        id: { not: currentProduct.id },
        OR: [
          { categoryId: currentProduct.categoryId },
          { productType: currentProduct.productType },
        ],
      },
      take: 4,
      include: { category: true },
    });

    res.json(related.map(formatProduct));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
