import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Product } from '../../types/product';
import { PriceDisplay } from '../ui/PriceDisplay';
import { Rating } from '../ui/Rating';
import { useCart } from '../../context/CartContext';

interface ServiceCardProps {
  service: Product;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="group relative bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl overflow-hidden shadow-xl card-hover flex flex-col h-full border border-slate-800">
      {/* Service Header / Banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <img
          src={service.images[0]}
          alt={service.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="bg-indigo-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            Done-For-You Service
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Rating value={service.rating} count={service.reviewCount} size="sm" />
          <span className="flex items-center gap-1 text-xs text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800 px-2.5 py-0.5 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            {service.deliveryTime || '2-3 Days'}
          </span>
        </div>

        <Link to={`/product/${service.slug}`}>
          <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
            {service.title}
          </h3>
        </Link>

        <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-1">
          {service.shortDescription}
        </p>

        {/* Feature bullets */}
        {service.features.length > 0 && (
          <ul className="space-y-1.5 mb-4 text-xs text-slate-300">
            {service.features.slice(0, 2).map((feat, idx) => (
              <li key={idx} className="flex items-center gap-1.5 line-clamp-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Starting at</span>
            <PriceDisplay
              price={service.price}
              compareAtPrice={service.compareAtPrice}
              discount={service.discount}
              size="md"
              showDiscountBadge={false}
            />
          </div>

          <Link
            to={`/product/${service.slug}`}
            className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
          >
            <span>View Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
