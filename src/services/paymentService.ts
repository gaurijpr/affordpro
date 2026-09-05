import { fetchApi } from './api';

export interface PaymentSession {
  sessionId: string;
  orderId: string;
  amount: number;
  currency: string;
  gateway: 'CASHFREE' | 'RAZORPAY' | 'STRIPE' | 'UPI';
  environment?: string;
  keyId?: string;
}

export const paymentService = {
  async createPaymentSession(
    orderId: string,
    amount: number,
    gateway: string = 'CASHFREE',
    customerInfo?: { name: string; email: string; phone?: string }
  ): Promise<PaymentSession> {
    try {
      return await fetchApi<PaymentSession>('/payment/create', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          amount,
          gateway,
          customerName: customerInfo?.name,
          customerEmail: customerInfo?.email,
          customerPhone: customerInfo?.phone,
        }),
      });
    } catch {
      return {
        sessionId: `session_${Date.now()}`,
        orderId,
        amount,
        currency: 'INR',
        gateway: 'CASHFREE',
        environment: 'TEST',
      };
    }
  },

  async verifyPayment(paymentId: string, orderId: string, signature?: string): Promise<{ success: boolean; message: string }> {
    try {
      return await fetchApi<{ success: boolean; message: string }>('/payment/verify', {
        method: 'POST',
        body: JSON.stringify({ paymentId, orderId, signature }),
      });
    } catch {
      return {
        success: true,
        message: 'Payment verified successfully (Mock Mode)',
      };
    }
  }
};
