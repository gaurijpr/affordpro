import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, GraduationCap, Sparkles, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../types/order';
import { Button } from '../components/ui/Button';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <SkeletonLoader variant="rect" className="h-16 w-16 mx-auto rounded-full" />
        <SkeletonLoader variant="rect" className="h-8 w-64 mx-auto" />
        <SkeletonLoader variant="card" className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
        <Link to="/" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Payment Successful!</h1>
        <p className="text-slate-500 text-base max-w-md mx-auto">
          Thank you for your purchase from AffordPro. Your digital products and access links are ready below.
        </p>
      </div>

      {/* Order Details Receipt Box */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Order ID</span>
            <span className="font-bold text-slate-900 text-sm">{order.orderNumber}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Order Date</span>
            <span className="font-bold text-slate-900 text-sm">{order.date}</span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Payment Status</span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
              {order.paymentStatus}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Amount Paid</span>
            <span className="font-black text-indigo-600 text-sm">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Purchased Items List & Actions */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Purchased Digital Items</h3>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded-xl shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.productTitle}</h4>
                    <span className="text-xs text-slate-500 font-medium">Type: {item.productType.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Conditional Action Buttons */}
                <div className="shrink-0">
                  {item.productType === 'COURSE' ? (
                    <Link
                      to="/account?tab=courses"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Start Learning
                    </Link>
                  ) : item.productType === 'SERVICE' ? (
                    <Link
                      to="/account?tab=orders"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      View Order Status
                    </Link>
                  ) : (
                    <a
                      href={item.downloadUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Files
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Dashboard Navigation */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/account?tab=orders"
            className="w-full sm:w-auto text-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Go to My Orders
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto text-center px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
