import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'rect';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
  count = 1,
}) => {
  const base = 'animate-pulse bg-slate-200 rounded-xl';

  const variants = {
    text: 'h-4 w-3/4 rounded',
    card: 'h-64 w-full rounded-2xl',
    avatar: 'h-12 w-12 rounded-full',
    rect: 'h-20 w-full rounded-xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${base} ${variants[variant]} ${className}`} />
      ))}
    </>
  );
};
