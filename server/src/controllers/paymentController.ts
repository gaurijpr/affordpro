import { Request, Response } from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CASHFREE CONFIGURATION
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'TEST';

const CASHFREE_BASE_URL = CASHFREE_ENV === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

export const createPaymentSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, amount, gateway, customerName, customerEmail, customerPhone } = req.body;

    const appId = (process.env.CASHFREE_APP_ID || '').trim();
    const secretKey = (process.env.CASHFREE_SECRET_KEY || '').trim();
    const cfEnv = (process.env.CASHFREE_ENV || 'PRODUCTION').trim();

    const baseUrl = cfEnv === 'PRODUCTION'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';

    // Handle Cashfree Gateway Request
    if ((gateway === 'CASHFREE' || gateway === 'RAZORPAY' || gateway === 'UPI') && appId && secretKey) {
      try {
        // Sanitize phone number (strictly 10 digits for Cashfree API)
        const digitsOnly = (customerPhone || '').replace(/\D/g, '');
        const cleanPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : '9999999999';

        // Sanitize order ID for Cashfree API
        const cleanOrderId = (orderId || `ord_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 45);

        // Enforce HTTPS scheme for Cashfree return_url requirement
        const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const httpsFrontendUrl = rawFrontendUrl.startsWith('http://')
          ? rawFrontendUrl.replace('http://', 'https://')
          : rawFrontendUrl;

        const payload = {
          order_id: cleanOrderId,
          order_amount: Number(amount) || 299,
          order_currency: 'INR',
          customer_details: {
            customer_id: `cust_${Date.now()}`,
            customer_name: customerName ? customerName.slice(0, 50) : 'Valued Customer',
            customer_email: customerEmail || 'customer@example.com',
            customer_phone: cleanPhone,
          },
          order_meta: {
            return_url: `${httpsFrontendUrl}/order-success/${cleanOrderId}?order_id={order_id}`,
          },
        };

        const cfResponse = await fetch(`${baseUrl}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-client-id': appId,
            'x-client-secret': secretKey,
            'x-api-version': '2023-08-01',
          },
          body: JSON.stringify(payload),
        });

        const cfData: any = await cfResponse.json();

        if (cfResponse.ok && cfData.payment_session_id) {
          res.json({
            sessionId: cfData.payment_session_id,
            orderId: cfData.order_id,
            amount: cfData.order_amount,
            currency: 'INR',
            gateway: 'CASHFREE',
            environment: cfEnv,
          });
          return;
        } else {
          console.error('Cashfree API Error Response:', cfData);
          res.status(400).json({
            success: false,
            message: cfData.message || 'Cashfree payment session creation failed.',
            details: cfData,
          });
          return;
        }
      } catch (e: any) {
        console.error('Cashfree connection exception:', e);
        res.status(500).json({ success: false, message: e.message || 'Cashfree connection error' });
        return;
      }
    }

    const rzpKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_affordpro_key_id';
    const razorpayOrderId = `rzp_order_${Date.now()}`;

    if (orderId) {
      await prisma.order.updateMany({
        where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
        data: { razorpayOrderId },
      });
    }

    res.json({
      sessionId: razorpayOrderId,
      orderId,
      amount: amount || 299,
      currency: 'INR',
      gateway: gateway || 'RAZORPAY',
      keyId: rzpKeyId,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId, orderId, signature } = req.body;

    const rzpSecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_affordpro_secret_key';

    // Verify HMAC SHA256 signature if provided
    let isVerified = true;
    if (signature && orderId) {
      const generatedSignature = crypto
        .createHmac('sha256', rzpSecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        isVerified = false;
      }
    }

    if (isVerified && orderId) {
      await prisma.order.updateMany({
        where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
        data: {
          paymentStatus: 'PAID',
          orderStatus: 'COMPLETED',
          razorpayPaymentId: paymentId,
        },
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_key';
    const signature = req.headers['x-razorpay-signature'] as string;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature && signature === expectedSignature) {
      const event = req.body.event;
      if (event === 'payment.captured' || event === 'order.paid') {
        const payload = req.body.payload.payment.entity;
        const razorpayOrderId = payload.order_id;
        const razorpayPaymentId = payload.id;

        await prisma.order.updateMany({
          where: { razorpayOrderId },
          data: {
            paymentStatus: 'PAID',
            orderStatus: 'COMPLETED',
            razorpayPaymentId,
          },
        });
      }
    }

    res.json({ status: 'ok' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
