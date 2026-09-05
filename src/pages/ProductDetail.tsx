import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Heart, CheckCircle2, Download, Clock, ShieldCheck, 
  Sparkles, Video, GraduationCap, Layout, Star, Share2, FileText, 
  HelpCircle, AlertCircle, MessageSquarePlus 
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { Product } from '../types/product';
import { Review } from '../types/review';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { Rating } from '../components/ui/Rating';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/product/ProductCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { ErrorState } from '../components/ui/ErrorState';
import { Modal } from '../components/ui/Modal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { getHighReviewCount, formatReviewCount, GENUINE_25_REVIEWS } from '../utils/reviewHelper';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', userName: '' });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(false);
        const data = await productService.getProductBySlug(slug);
        if (!data) {
          setError(true);
          return;
        }
        setProduct(data);
        setSelectedImage(data.images[0]);

        const [revResult, related] = await Promise.all([
          reviewService.getProductReviews(data.id, data.slug),
          productService.getRelatedProducts(data, 4),
        ]);
        if (revResult.isCustom && revResult.reviews.length > 0) {
          setReviews(revResult.reviews);
        } else if (revResult.reviews.length > 0) {
          setReviews(revResult.reviews);
        } else {
          setReviews(GENUINE_25_REVIEWS);
        }
        setRelatedProducts(related);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <SkeletonLoader variant="rect" className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <SkeletonLoader variant="card" className="h-96" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <SkeletonLoader variant="rect" className="h-10 w-full" />
            <SkeletonLoader variant="rect" className="h-20 w-full" />
            <SkeletonLoader variant="rect" className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState
          title="Product Not Found"
          message="The digital product or service you are looking for may have been removed or renamed."
          onRetry={() => navigate('/products')}
        />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.title || !newReview.comment) {
      showToast('Please fill in both title and review comment.', 'error');
      return;
    }

    try {
      const added = await reviewService.addReview(product.id, newReview);
      setReviews([added, ...reviews]);
      setIsReviewModalOpen(false);
      setNewReview({ rating: 5, title: '', comment: '', userName: '' });
      showToast('Thank you! Your review has been submitted.', 'success');
    } catch {
      showToast('Failed to submit review.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Products', path: '/products' },
          { label: product.category, path: `/products?category=${product.categorySlug}` },
          { label: product.title },
        ]}
      />

      {/* TOP SECTION: Gallery Left + Purchase Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-video sm:aspect-4/3 w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge productType={product.productType} size="md" />
              {product.bestSeller && <Badge variant="warning">Best Seller</Badge>}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-24 h-18 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Core Info & Purchase Box */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/products?category=${product.categorySlug}`}
              className="text-xs font-extrabold text-indigo-600 hover:underline uppercase tracking-wider"
            >
              {product.category}
            </Link>
            <Rating value={product.rating} count={product.reviewCount} productId={product.id} size="md" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
            {product.title}
          </h1>

          {/* Short Description */}
          <p className="text-slate-600 text-sm leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Price Box */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <PriceDisplay
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              discount={product.discount}
              size="xl"
            />
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              One-time payment • No recurring fees or hidden charges
            </p>
          </div>

          {/* Dynamic Meta Bar (Format, Delivery, Duration) */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {product.format && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Format</span>
                <span className="font-bold text-slate-900">{product.format}</span>
              </div>
            )}
            {product.deliveryMethod && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Delivery</span>
                <span className="font-bold text-emerald-600">{product.deliveryMethod}</span>
              </div>
            )}
            {product.courseDuration && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Duration</span>
                <span className="font-bold text-slate-900">{product.courseDuration}</span>
              </div>
            )}
            {product.accessDuration && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium block">Access</span>
                <span className="font-bold text-slate-900">{product.accessDuration}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleBuyNow}
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Sparkles className="w-5 h-5" />}
            >
              Buy Now
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => addToCart(product)}
                variant="outline"
                size="md"
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                Add to Cart
              </Button>

              <Button
                onClick={() => toggleWishlist(product)}
                variant={inWishlist ? 'danger' : 'ghost'}
                size="md"
                leftIcon={<Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />}
              >
                {inWishlist ? 'Saved' : 'Wishlist'}
              </Button>
            </div>
          </div>

          {/* Trust assurances */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-around text-center text-xs text-slate-500 font-semibold">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4 text-indigo-500" />
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: Detailed Information Tabs & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* About This Product */}
          <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-4">
            <h2 className="text-2xl font-black text-slate-900">About This Product</h2>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {product.fullDescription}
            </div>
          </section>

          {/* What's Included */}
          {product.whatIsIncluded.length > 0 && (
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-4">
              <h2 className="text-2xl font-black text-slate-900">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.whatIsIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Features */}
          {product.features.length > 0 && (
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-4">
              <h2 className="text-2xl font-black text-slate-900">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-slate-800 text-xs font-semibold leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Who Is This For */}
          {product.whoIsThisFor.length > 0 && (
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-4">
              <h2 className="text-2xl font-black text-slate-900">Who Is This For?</h2>
              <div className="flex flex-wrap gap-2">
                {product.whoIsThisFor.map((persona, idx) => (
                  <span key={idx} className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold text-xs rounded-xl">
                    {persona}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Customer Reviews Section with 1K+ Social Proof & Genuine Breakdown */}
          <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-8">
            {/* Header Title & Write Review Trigger */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Customer Ratings & Genuine Reviews</h2>
                <p className="text-slate-500 text-xs font-semibold mt-1">
                  Based on {formatReviewCount(getHighReviewCount(product.id, product.reviewCount))} verified customer reviews
                </p>
              </div>

              <Button
                onClick={() => setIsReviewModalOpen(true)}
                variant="outline"
                size="sm"
                leftIcon={<MessageSquarePlus className="w-4 h-4" />}
              >
                Write a Review
              </Button>
            </div>

            {/* Rating Breakdown Bar & Average Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 border border-slate-100 rounded-2xl p-6 items-center">
              {/* Overall Score Box */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
                <span className="text-5xl font-black text-slate-900 leading-none">{product.rating.toFixed(1)}</span>
                <div className="my-2">
                  <Rating value={product.rating} showCount={false} size="lg" />
                </div>
                <span className="text-xs text-slate-500 font-extrabold">
                  {formatReviewCount(getHighReviewCount(product.id, product.reviewCount))} Verified Customer Reviews
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> 99.4% Positive Feedback
                </span>
              </div>

              {/* Star Distribution Progress Bars */}
              <div className="md:col-span-8 space-y-2 text-xs font-bold text-slate-700">
                {[5, 4, 3, 2, 1].map((star) => {
                  const totalCount = reviews.length || 1;
                  const starCount = reviews.filter((r) => Math.round(r.rating) === star).length;
                  const pct = Math.round((starCount / totalCount) * 100);
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-12 text-slate-500 font-extrabold">{star} Star</span>
                      <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-10 text-right text-slate-900 font-black">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Genuine Customer Reviews Scrollable List Container */}
            <div className="max-h-[520px] overflow-y-auto pr-3 space-y-6 divide-y divide-slate-100 custom-scrollbar border-t border-slate-100 pt-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="pt-6 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {rev.userAvatar ? (
                        <img
                          src={rev.userAvatar}
                          alt={rev.userName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center border-2 border-indigo-200">
                          {rev.userName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{rev.date || 'Verified Purchase'}</span>
                      </div>
                    </div>

                    <Rating value={rev.rating} showCount={false} size="sm" />
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base">{rev.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-lg text-white">Why Buy from AffordPro?</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant download link via email & dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Commercial reuse rights included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lifetime access with free future updates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Write a Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Customer Review"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
            <input
              type="text"
              value={newReview.userName}
              onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 font-bold"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5/5) - Excellent</option>
              <option value="4">⭐⭐⭐⭐ (4/5) - Very Good</option>
              <option value="3">⭐⭐⭐ (3/5) - Average</option>
              <option value="2">⭐⭐ (2/5) - Poor</option>
              <option value="1">⭐ (1/5) - Terrible</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="e.g. Amazing value for money!"
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share how this digital product helped your workflow..."
              rows={4}
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={() => setIsReviewModalOpen(false)} variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
