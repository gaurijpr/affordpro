import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { EmptyState } from '../components/ui/EmptyState';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, appliedCoupon, applyCoupon, removeCoupon, summary } = useCart();
  const { toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput);
    setIsApplying(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={[{ label: 'Cart' }]} />
        <EmptyState
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any digital products or courses to your cart yet."
          actionText="Explore Digital Products"
          onAction={() => navigate('/products')}
          icon={<ShoppingBag className="w-10 h-10 text-indigo-600" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-slate-500 text-sm mt-0.5">{cart.length} item(s) ready for instant access</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 card-shadow flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Product Image */}
              <div className="w-full sm:w-28 aspect-video sm:aspect-square bg-slate-100 rounded-xl overflow-hidden shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-1.5 w-full">
                <div className="flex items-center gap-2">
                  <Badge productType={item.product.productType} size="sm" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.product.category}
                  </span>
                </div>

                <Link
                  to={`/product/${item.product.slug}`}
                  className="font-bold text-slate-900 text-base leading-snug hover:text-indigo-600 transition-colors line-clamp-1"
                >
                  {item.product.title}
                </Link>

                <div className="text-xs text-slate-500 font-medium">
                  {item.product.format && <span>Format: {item.product.format} • </span>}
                  <span className="text-emerald-600 font-bold">{item.product.deliveryMethod || 'Instant Download'}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      toggleWishlist(item.product);
                      removeFromCart(item.product.id);
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    Save for Later
                  </button>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-right shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <PriceDisplay
                  price={item.product.price * item.quantity}
                  compareAtPrice={(item.product.compareAtPrice || item.product.price) * item.quantity}
                  size="md"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 card-shadow space-y-6">
          <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h2>

          {/* Coupon Code Box */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>Coupon {appliedCoupon.code} Applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:underline text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter Coupon Code (e.g. WELCOME50)"
                  className="flex-1 px-3 py-2 text-xs font-semibold uppercase bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  isLoading={isApplying}
                >
                  Apply
                </Button>
              </form>
            )}
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-3 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-extrabold text-slate-900">₹{summary.subtotal.toLocaleString('en-IN')}</span>
            </div>

            {summary.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Product Savings</span>
                <span className="font-extrabold">-₹{summary.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {summary.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon Discount</span>
                <span className="font-extrabold">-₹{summary.couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-slate-200 text-slate-900 text-base font-black">
              <span>Final Total</span>
              <span className="text-indigo-600">₹{summary.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Button
            onClick={() => navigate('/checkout')}
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Proceed to Checkout
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit Encrypted SSL Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
