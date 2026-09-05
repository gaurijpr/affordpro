import React from 'react';
import { Filter, RotateCcw, Check, Star } from 'lucide-react';
import { ProductFilterState, ProductType } from '../../types/product';
import { Category } from '../../types/category';

interface FilterPanelProps {
  filters: ProductFilterState;
  categories: Category[];
  onChange: (newFilters: ProductFilterState) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  categories,
  onChange,
  onReset,
}) => {
  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₹199', value: 'under-199' },
    { label: '₹199 – ₹499', value: '199-499' },
    { label: '₹499 – ₹999', value: '499-999' },
    { label: '₹999+', value: '999-plus' },
  ];

  const productTypes: { label: string; value: ProductType | 'ALL' }[] = [
    { label: 'All Types', value: 'ALL' },
    { label: 'Downloadable Products', value: 'DIGITAL_PRODUCT' },
    { label: 'Canva & Graphic Templates', value: 'TEMPLATE' },
    { label: 'Online Courses', value: 'COURSE' },
    { label: 'Done-For-You Services', value: 'SERVICE' },
    { label: 'Reels & Media Bundles', value: 'BUNDLE' },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-extrabold text-slate-900 text-base">
          <Filter className="w-5 h-5 text-indigo-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onChange({ ...filters, categorySlug: undefined })}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
              !filters.categorySlug
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {!filters.categorySlug && <Check className="w-4 h-4 text-indigo-600" />}
          </button>
          {categories.map((cat) => {
            const isActive = filters.categorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onChange({ ...filters, categorySlug: cat.slug })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                {isActive && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Type Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
          Product Type
        </h4>
        <div className="space-y-1.5">
          {productTypes.map((type) => {
            const isActive =
              (!filters.productType && type.value === 'ALL') ||
              filters.productType === type.value;
            return (
              <button
                key={type.value}
                onClick={() =>
                  onChange({
                    ...filters,
                    productType: type.value === 'ALL' ? undefined : type.value,
                  })
                }
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{type.label}</span>
                {isActive && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
          Price Range
        </h4>
        <div className="space-y-1.5">
          {priceRanges.map((range) => {
            const isActive = (filters.priceRange || '') === range.value;
            return (
              <button
                key={range.value}
                onClick={() => onChange({ ...filters, priceRange: range.value || undefined })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{range.label}</span>
                {isActive && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map((rating) => {
            const isActive = filters.minRating === rating;
            return (
              <button
                key={rating}
                onClick={() =>
                  onChange({ ...filters, minRating: isActive ? undefined : rating })
                }
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-amber-50 text-amber-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{rating} Stars & Above</span>
                </div>
                {isActive && <Check className="w-4 h-4 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
