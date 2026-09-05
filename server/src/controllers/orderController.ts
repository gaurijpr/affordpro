import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const formatOrder = (order: any) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  date: order.createdAt.toISOString().split('T')[0],
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone || undefined,
  items: order.items.map((item: any) => ({
    productId: item.productId,
    productTitle: item.productTitle,
    productImage: item.productImage,
    productType: item.productType,
    price: item.price,
    quantity: item.quantity,
    downloadUrl: item.downloadUrl || undefined,
    accessUrl: item.accessUrl || (item.productType === 'COURSE' ? '/account?tab=courses' : undefined),
  })),
  subtotal: order.subtotal,
  discount: order.discount,
  tax: order.tax,
  total: order.total,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  couponCode: order.couponCode || undefined,
});

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customerName, customerEmail, customerPhone, items, paymentMethod, couponCode, totalAmount } = req.body;

    if (!customerEmail || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Valid customer email and cart items are required.' });
      return;
    }

    const orderNumber = `AP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.product?.id || item.productId } });
      if (!product) continue;

      const price = product.price;
      const qty = item.quantity || 1;
      subtotal += price * qty;

      orderItemsData.push({
        productId: product.id,
        productTitle: product.title,
        productImage: typeof product.images === 'string' ? JSON.parse(product.images)[0] : product.images[0],
        productType: product.productType,
        price,
        quantity: qty,
        downloadUrl: product.downloadUrl,
        accessUrl: product.productType === 'COURSE' ? '/account?tab=courses' : undefined,
      });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: String(couponCode).toUpperCase() } });
      if (coupon && coupon.active) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const finalTotal = Math.max(0, subtotal - discount);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user?.id || undefined,
        customerName,
        customerEmail,
        customerPhone,
        subtotal,
        discount,
        tax: 0,
        total: finalTotal,
        paymentMethod: paymentMethod || 'RAZORPAY',
        paymentStatus: 'PAID',
        orderStatus: 'COMPLETED',
        couponCode: couponCode ? String(couponCode) : undefined,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    res.json(formatOrder(order));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: { items: true },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json(formatOrder(order));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const email = req.user?.email;

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: userId || undefined },
          { customerEmail: email || undefined },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    res.json(orders.map(formatOrder));
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
