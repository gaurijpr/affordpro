import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();

export const downloadProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderId = req.params.orderId as string;
    const productId = req.params.productId as string;
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    // Verify order exists & payment status is PAID
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
        paymentStatus: 'PAID',
      },
      include: { items: true },
    });

    if (!order) {
      res.status(403).json({ success: false, message: 'Invalid or unpaid order. Download access denied.' });
      return;
    }

    // Verify order belongs to requesting user if logged in
    if (userId && order.userId && order.userId !== userId && order.customerEmail !== userEmail) {
      res.status(403).json({ success: false, message: 'Order does not belong to your account.' });
      return;
    }

    // Verify product exists in order items
    const orderItem = order.items.find((item: any) => item.productId === productId);
    if (!orderItem) {
      res.status(404).json({ success: false, message: 'Product not found in this order.' });
      return;
    }

    const downloadUrl = orderItem.downloadUrl || 'https://example.com/downloads/affordpro-digital-bundle.zip';

    res.json({
      success: true,
      downloadUrl,
      title: orderItem.productTitle,
      message: 'Download authorized successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
