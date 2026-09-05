import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Download, Sparkles, Video, GraduationCap, Layout } from 'lucide-react';
import { Product } from '../../types/product';
import { PriceDisplay } from '../ui/PriceDisplay';
import { Rating } from '../ui/Rating';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const getProductTypeIcon = () => {
    switch (product.productType) {
      case 'BUNDLE': return <Video className="w-3.5 h-3.5" />;
      case 'TEMPLATE': return <Layout className="w-3.5 h-3.5" />;
      case 'COURSE': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'SERVICE': return <Sparkles className="w-3.5 h-3.5" />;
      default: return <Download className="w-3.5 h-3.5" />;
    }
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'DIGITAL_PRODUCT': return 'Digital Product';
      case 'TEMPLATE': return 'Canva Template';
      case 'BUNDLE': return 'Reels Bundle';
      case 'COURSE': return 'Course';
      case 'SERVICE': return 'Service';
      default: return type.replace('_', ' ');
    }
  };

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden card-shadow card-hover flex flex-col h-full">
      {/* Thumbnail Container */}
      <div className="relative aspect-video sm:aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <Badge productType={product.productType} size="sm">
            <span className="flex items-center gap-1">
              {getProductTypeIcon()}
              {getProductTypeLabel(product.productType)}
            </span>
          </Badge>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Format tag badge */}
        {product.format && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
              {product.format}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <span className="text-indigo-600 font-bold uppercase tracking-wider text-[11px]">
            {product.category}
          </span>
          <Rating value={product.rating} count={product.reviewCount} productId={product.id} size="sm" />
        </div>

        {/* Title */}
        <Link to={`/product/${product.slug}`} className="group-hover:text-indigo-600 transition-colors">
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.shortDescription}
        </p>

        {/* Price & CTA Section */}
        <div className="pt-3 border-t border-slate-100 mt-auto flex flex-col gap-3">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            discount={product.discount}
            size="md"
          />

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Details
            </Link>

            <button
              onClick={() => addToCart(product)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
