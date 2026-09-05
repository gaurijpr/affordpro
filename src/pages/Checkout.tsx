import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

const loadCashfreeScript = (): Promise<any> => {
  return new Promise((resolve) => {
    if ((window as any).Cashfree) {
      resolve((window as any).Cashfree);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => {
      resolve((window as any).Cashfree);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

export const Checkout: React.FC = () => {
  const { cart, summary, clearCart, appliedCoupon, applyCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '123 Tech Park Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
  });

  const [paymentGateway, setPaymentGateway] = useState<'CASHFREE' | 'RAZORPAY' | 'UPI'>('CASHFREE');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      showToast('Please enter your full name and email address.', 'error');
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Create Order record
      const order = await orderService.createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cart,
        paymentMethod: paymentGateway === 'CASHFREE' ? 'Cashfree Payments (UPI/Cards)' : paymentGateway,
        couponCode: appliedCoupon?.code,
        totalAmount: summary.total,
      });

      // 2. Initialize Payment Session
      const session = await paymentService.createPaymentSession(order.id, summary.total, paymentGateway, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });

      // 3. Trigger Cashfree SDK Modal & Hosted Page Fallback
      if (session.gateway === 'CASHFREE' && session.sessionId && session.sessionId.startsWith('session_')) {
        const CashfreeSDK = await loadCashfreeScript();
        if (CashfreeSDK) {
          try {
            const cashfree = CashfreeSDK({ mode: session.environment === 'PRODUCTION' ? 'production' : 'sandbox' });
            cashfree.checkout({
              paymentSessionId: session.sessionId,
              redirectTarget: '_modal',
            });
            return;
          } catch (sdkErr) {
            console.warn('Cashfree SDK modal error, redirecting to hosted checkout', sdkErr);
            window.location.href = `https://payments.cashfree.com/order/#${session.sessionId}`;
            return;
          }
        } else {
          // Direct fallback redirect to Cashfree Hosted Payment Page
          window.location.href = `https://payments.cashfree.com/order/#${session.sessionId}`;
          return;
        }
      }

      // 4. Verify & Confirm Order
      const paymentRes = await paymentService.verifyPayment(`pay_${Date.now()}`, order.id);

      if (paymentRes.success) {
        clearCart();
        showToast('Payment successful! Redirecting to your downloads...', 'success');
        navigate(`/order-success/${order.id}`);
      }
    } catch (err: any) {
      showToast(err.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Cart', path: '/cart' }, { label: 'Checkout' }]} />

      <div>
        <h1 className="text-3xl font-black text-slate-900">Secure Checkout</h1>
        <p className="text-slate-500 text-sm mt-1">Complete your order for instant digital access</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Details & Payment Choice */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Information */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-4">
            <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">1</span>
              Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (for Digital Access) *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210 (Optional)"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateway Options */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-4">
            <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">2</span>
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cashfree Payments */}
              <label
                onClick={() => setPaymentGateway('CASHFREE')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentGateway === 'CASHFREE'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span>Cashfree Payments (Live)</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[9px] rounded-full uppercase">Instant UPI & Cards</span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Google Pay, PhonePe, Paytm, QR Code, Cards & NetBanking</div>
                  </div>
                </div>
                <input type="radio" checked={paymentGateway === 'CASHFREE'} readOnly className="w-4 h-4 text-indigo-600" />
              </label>

              {/* Direct UPI */}
              <label
                onClick={() => setPaymentGateway('UPI')}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentGateway === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Direct UPI / QR Code</div>
                    <div className="text-xs text-slate-500">Scan QR Code & Pay</div>
                  </div>
                </div>
                <input type="radio" checked={paymentGateway === 'UPI'} readOnly className="w-4 h-4 text-indigo-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Summary & Checkout Button */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
          <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-100">
            Order Review ({cart.length} item)
          </h2>

          {/* Cart Mini List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <img src={item.product.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg" />
                  <div>
                    <div className="font-bold text-slate-900 line-clamp-1">{item.product.title}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{item.product.deliveryMethod || 'Instant Access'}</div>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 shrink-0">₹{item.product.price}</span>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{summary.subtotal.toLocaleString('en-IN')}</span>
            </div>

            {summary.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Applied Discount ({appliedCoupon?.code})</span>
                <span className="font-extrabold">-₹{summary.couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-slate-200 text-slate-900 text-lg font-black">
              <span>Total Payable</span>
              <span className="text-indigo-600">₹{summary.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isProcessing}
            leftIcon={<Lock className="w-4 h-4" />}
          >
            Pay Securely ₹{summary.total.toLocaleString('en-IN')}
          </Button>

          <div className="text-center text-[11px] text-slate-400 font-medium space-y-1">
            <p>By clicking "Pay Securely", you agree to AffordPro's Terms & Conditions.</p>
            <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Instant Digital Product Delivery</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
