import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { formatProduct } from './productController.js';
import { formatOrder } from './orderController.js';

const prisma = new PrismaClient();

// Admin Dashboard Analytics Metrics
export const getAdminDashboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalProducts, totalCategories, totalOrders, totalUsers, totalRevenue] = await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.category.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'PAID' } }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    res.json({
      success: true,
      metrics: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue._sum.total || 0,
      },
      recentOrders: recentOrders.map(formatOrder),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Product Management (Create, Update, Delete/Deactivate)
export const createAdminProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      shortDescription,
      fullDescription,
      categorySlug,
      productType,
      images,
      price,
      compareAtPrice,
      features,
      whatIsIncluded,
      whoIsThisFor,
      requirements,
      format,
      deliveryMethod,
      deliveryTime,
      accessDuration,
      tags,
      status,
      downloadable,
      serviceBased,
      featured,
      bestSeller,
      newArrival,
      downloadUrl,
    } = req.body;

    if (!title || !price || !categorySlug) {
      res.status(400).json({ success: false, message: 'Title, price, and category are required.' });
      return;
    }

    let category = await prisma.category.findUnique({ where: { slug: String(categorySlug) } });
    if (!category) {
      category = await prisma.category.findFirst();
    }

    const slugStr = String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const imagesArray = Array.isArray(images) ? images : [images || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];
    const discountVal = compareAtPrice && Number(compareAtPrice) > Number(price) ? Math.round(((Number(compareAtPrice) - Number(price)) / Number(compareAtPrice)) * 100) : 0;

    const newProduct = await prisma.product.create({
      data: {
        slug: `${slugStr}-${Date.now().toString().slice(-4)}`,
        title: String(title),
        shortDescription: String(shortDescription || title),
        fullDescription: String(fullDescription || shortDescription || title),
        categoryId: category!.id,
        productType: String(productType || 'DIGITAL_PRODUCT'),
        images: JSON.stringify(imagesArray),
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        discount: discountVal,
        currency: '₹',
        rating: req.body.rating ? Number(req.body.rating) : 4.9,
        reviewCount: req.body.reviewCount ? Number(req.body.reviewCount) : Math.floor(Math.random() * 800) + 250,
        features: JSON.stringify(Array.isArray(features) ? features : String(features || '').split('\n').filter(Boolean)),
        whatIsIncluded: JSON.stringify(whatIsIncluded || []),
        whoIsThisFor: JSON.stringify(whoIsThisFor || []),
        requirements: JSON.stringify(requirements || []),
        tags: JSON.stringify(tags || []),
        format: format ? String(format) : 'ZIP',
        deliveryMethod: deliveryMethod ? String(deliveryMethod) : 'Instant Download',
        deliveryTime: deliveryTime ? String(deliveryTime) : 'Instant',
        accessDuration: accessDuration ? String(accessDuration) : 'Lifetime Access',
        status: status ? String(status) : 'IN_STOCK',
        downloadable: downloadable ?? true,
        serviceBased: serviceBased ?? false,
        featured: featured ?? true,
        bestSeller: bestSeller ?? false,
        newArrival: newArrival ?? true,
        downloadUrl: downloadUrl ? String(downloadUrl) : 'https://example.com/downloads/sample-product.zip',
        active: true,
      },
      include: { category: true },
    });

    res.json({
      success: true,
      message: 'Product created successfully!',
      product: formatProduct(newProduct),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      title,
      shortDescription,
      fullDescription,
      categorySlug,
      productType,
      images,
      price,
      compareAtPrice,
      rating,
      reviewCount,
      format,
      deliveryMethod,
      deliveryTime,
      accessDuration,
      features,
      whatIsIncluded,
      whoIsThisFor,
      requirements,
      tags,
      status,
      featured,
      bestSeller,
      newArrival,
      downloadUrl,
    } = req.body;

    const existingProd = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingProd) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const updateData: any = {};
    if (title) updateData.title = String(title);
    if (shortDescription !== undefined) updateData.shortDescription = String(shortDescription);
    if (fullDescription !== undefined) updateData.fullDescription = String(fullDescription);
    if (productType) updateData.productType = String(productType);
    if (price !== undefined) updateData.price = Number(price);
    if (compareAtPrice !== undefined) updateData.compareAtPrice = compareAtPrice ? Number(compareAtPrice) : null;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (reviewCount !== undefined) updateData.reviewCount = Number(reviewCount);
    if (format !== undefined) updateData.format = String(format);
    if (deliveryMethod !== undefined) updateData.deliveryMethod = String(deliveryMethod);
    if (deliveryTime !== undefined) updateData.deliveryTime = String(deliveryTime);
    if (accessDuration !== undefined) updateData.accessDuration = String(accessDuration);
    if (downloadUrl !== undefined) updateData.downloadUrl = String(downloadUrl);
    if (status) updateData.status = String(status);
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (bestSeller !== undefined) updateData.bestSeller = Boolean(bestSeller);
    if (newArrival !== undefined) updateData.newArrival = Boolean(newArrival);

    if (images) {
      updateData.images = JSON.stringify(Array.isArray(images) ? images : [images]);
    }
    if (features) {
      updateData.features = JSON.stringify(Array.isArray(features) ? features : String(features).split('\n').filter(Boolean));
    }
    if (whatIsIncluded) {
      updateData.whatIsIncluded = JSON.stringify(Array.isArray(whatIsIncluded) ? whatIsIncluded : String(whatIsIncluded).split('\n').filter(Boolean));
    }
    if (whoIsThisFor) {
      updateData.whoIsThisFor = JSON.stringify(Array.isArray(whoIsThisFor) ? whoIsThisFor : String(whoIsThisFor).split('\n').filter(Boolean));
    }
    if (requirements) {
      updateData.requirements = JSON.stringify(Array.isArray(requirements) ? requirements : String(requirements).split('\n').filter(Boolean));
    }
    if (tags) {
      updateData.tags = JSON.stringify(Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean));
    }

    if (categorySlug) {
      const cat = await prisma.category.findFirst({
        where: { OR: [{ slug: String(categorySlug) }, { name: String(categorySlug) }] },
      });
      if (cat) {
        updateData.categoryId = cat.id;
      }
    }

    if (updateData.price && updateData.compareAtPrice) {
      updateData.discount = Math.round(((updateData.compareAtPrice - updateData.price) / updateData.compareAtPrice) * 100);
    }

    const updated = await prisma.product.update({
      where: { id: existingProd.id },
      data: updateData,
      include: { category: true },
    });

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: formatProduct(updated),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (existing) {
      await prisma.product.delete({
        where: { id: existing.id },
      });
    }

    res.json({ success: true, message: 'Product deleted successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Order Management
export const getAdminOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    res.json(orders.map(formatOrder));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { orderStatus, paymentStatus } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        orderStatus: orderStatus ? String(orderStatus) : undefined,
        paymentStatus: paymentStatus ? String(paymentStatus) : undefined,
      },
      include: { items: true },
    });

    res.json({
      success: true,
      order: formatOrder(updated),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Category Management (Create & Edit)
export const createAdminCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, icon, image } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required.' });
      return;
    }

    const slugStr = String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newCategory = await prisma.category.create({
      data: {
        name: String(name),
        slug: `${slugStr}-${Date.now().toString().slice(-3)}`,
        description: description ? String(description) : `${name} category items`,
        icon: icon ? String(icon) : 'Folder',
        image: image ? String(image) : undefined,
        active: true,
      },
    });

    res.json({ success: true, message: 'Category created successfully!', category: newCategory });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, description, icon, image } = req.body;

    const existingCat = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingCat) {
      res.status(404).json({ success: false, message: 'Category not found in database' });
      return;
    }

    const updateData: any = {};
    if (name) {
      updateData.name = String(name);
    }
    if (description !== undefined) updateData.description = String(description);
    if (icon) updateData.icon = String(icon);
    if (image !== undefined) updateData.image = String(image);

    const updated = await prisma.category.update({
      where: { id: existingCat.id },
      data: updateData,
    });

    res.json({ success: true, message: 'Category updated successfully!', category: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdminCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existingCat = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingCat) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    await prisma.category.delete({
      where: { id: existingCat.id },
    });

    res.json({ success: true, message: 'Category deleted successfully!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
