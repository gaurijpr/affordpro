import React from 'react';
import { ProductType } from '../../types/product';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'type';
  productType?: ProductType;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  productType,
  className = '',
  size = 'md',
}) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  if (productType) {
    const typeConfig: Record<ProductType, { bg: string; label: string }> = {
      DIGITAL_PRODUCT: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Digital Product' },
      TEMPLATE: { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Canva Template' },
      COURSE: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Course' },
      SERVICE: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Service' },
      BUNDLE: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Reels Bundle' },
    };

    const config = typeConfig[productType] || { bg: 'bg-slate-50 text-slate-700 border-slate-200', label: String(productType).replace('_', ' ') };

    return (
      <span className={`inline-flex items-center font-bold border rounded-lg ${config.bg} ${sizeStyles} ${className}`}>
        {children || config.label}
      </span>
    );
  }

  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    type: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-lg ${variants[variant]} ${sizeStyles} ${className}`}>
      {children}
    </span>
  );
};
