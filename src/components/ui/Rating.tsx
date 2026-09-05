import React from 'react';
import { Star } from 'lucide-react';
import { getHighReviewCount, formatReviewCount } from '../../utils/reviewHelper';

interface RatingProps {
  value: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  productId?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  count,
  showCount = true,
  size = 'sm',
  productId,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const realCount = getHighReviewCount(productId || 'prod-default', count || 0);
  const formattedCount = formatReviewCount(realCount);

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSizes[size]} ${
              star <= Math.round(value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-100 text-slate-300'
            }`}
          />
        ))}
      </div>
      <span className={`font-black text-slate-900 ${textSizes[size]}`}>
        {value.toFixed(1)}
      </span>
      {showCount && (
        <span className={`text-slate-500 font-bold ${textSizes[size]}`}>
          ({formattedCount} reviews)
        </span>
      )}
    </div>
  );
};
