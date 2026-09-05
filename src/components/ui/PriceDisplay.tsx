import React from 'react';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  discount?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscountBadge?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  discount,
  currency = '₹',
  size = 'md',
  showDiscountBadge = true,
}) => {
  const calculatedDiscount =
    discount ||
    (compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0);

  const priceSizes = {
    sm: 'text-base font-extrabold',
    md: 'text-lg font-extrabold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-black',
  };

  const compareSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`text-slate-900 ${priceSizes[size]}`}>
        {currency}{price.toLocaleString('en-IN')}
      </span>

      {compareAtPrice && compareAtPrice > price && (
        <span className={`text-slate-400 line-through ${compareSizes[size]}`}>
          {currency}{compareAtPrice.toLocaleString('en-IN')}
        </span>
      )}

      {showDiscountBadge && calculatedDiscount > 0 && (
        <span className="bg-rose-50 text-rose-600 font-extrabold text-xs px-2 py-0.5 rounded-md border border-rose-200">
          {calculatedDiscount}% OFF
        </span>
      )}
    </div>
  );
};
