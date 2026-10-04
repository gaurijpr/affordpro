import React from 'react';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  discount?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscountBadge?: boolean;
  isDark?: boolean;
  priceColorClass?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  compareAtPrice,
  discount,
  currency = '₹',
  size = 'md',
  showDiscountBadge = true,
  isDark = false,
  priceColorClass,
}) => {
  const calculatedDiscount =
    discount ||
    (compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0);

  const priceSizes = {
    sm: 'text-base font-black',
    md: 'text-lg font-black',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  const compareSizes = {
    sm: 'text-xs font-semibold',
    md: 'text-sm font-semibold',
    lg: 'text-base font-semibold',
    xl: 'text-lg font-semibold',
  };

  const defaultPriceColor = priceColorClass || (isDark ? 'text-white' : 'text-slate-900');

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`${defaultPriceColor} ${priceSizes[size]}`}>
        {currency}{price.toLocaleString('en-IN')}
      </span>

      {compareAtPrice && compareAtPrice > price && (
        <span className={`${isDark ? 'text-slate-400' : 'text-slate-400'} line-through ${compareSizes[size]}`}>
          {currency}{compareAtPrice.toLocaleString('en-IN')}
        </span>
      )}

      {showDiscountBadge && calculatedDiscount > 0 && (
        <span
          className={
            isDark
              ? 'bg-emerald-500/20 text-emerald-300 font-black text-xs px-2 py-0.5 rounded-md border border-emerald-500/30'
              : 'bg-rose-50 text-rose-600 font-extrabold text-xs px-2 py-0.5 rounded-md border border-rose-200'
          }
        >
          {calculatedDiscount}% OFF
        </span>
      )}
    </div>
  );
};
