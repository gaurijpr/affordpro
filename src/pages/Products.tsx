import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product, ProductFilterState, ProductType } from '../types/product';
import { Category } from '../types/category';
import { ProductCard } from '../components/product/ProductCard';
import { FilterPanel } from '../components/product/FilterPanel';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract query filters
  const categorySlug = searchParams.get('category') || undefined;
  const productType = (searchParams.get('type') as ProductType | 'PRODUCTS_ONLY') || undefined;
  const bestSellerOnly = searchParams.get('bestseller') === 'true';
  const searchQuery = searchParams.get('q') || undefined;
  const priceRange = searchParams.get('priceRange') || undefined;
  const sortBy = (searchParams.get('sort') as ProductFilterState['sortBy']) || 'featured';

  const [filters, setFilters] = useState<ProductFilterState>({
    categorySlug,
    productType,
    bestSellerOnly,
    searchQuery,
    priceRange,
    sortBy,
  });

  useEffect(() => {
    setFilters({
      categorySlug,
      productType,
      bestSellerOnly,
      searchQuery,
      priceRange,
      sortBy,
    });
  }, [categorySlug, productType, bestSellerOnly, searchQuery, priceRange, sortBy]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          productService.getProducts(filters),
          categoryService.getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const updateFilters = (newFilters: ProductFilterState) => {
    const params = new URLSearchParams();
    if (newFilters.categorySlug) params.set('category', newFilters.categorySlug);
    if (newFilters.productType && newFilters.productType !== 'ALL') params.set('type', newFilters.productType);
    if (newFilters.bestSellerOnly) params.set('bestseller', 'true');
    if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);
    if (newFilters.priceRange) params.set('priceRange', newFilters.priceRange);
    if (newFilters.sortBy) params.set('sort', newFilters.sortBy);
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  // Find active category
  const activeCat = categories.find((c) => c.slug === categorySlug);

  // Compute page heading & description dynamically based on filter context
  const getPageHeader = () => {
    if (bestSellerOnly) {
      return {
        title: '🔥 Best Selling Products',
        description: 'Explore our top-rated & most popular best seller digital products.',
      };
    }
    if (productType === 'PRODUCTS_ONLY') {
      return {
        title: '📦 Digital Products Catalog',
        description: 'Explore our complete catalog of digital templates, reels bundles, and prompt packs.',
      };
    }
    if (productType === 'SERVICE') {
      return {
        title: '✨ Professional Custom Services',
        description: 'Explore our done-for-you custom graphic design, video reel editing, and campaign setup services.',
      };
    }
    if (activeCat) {
      return {
        title: activeCat.name,
        description: activeCat.description || 'Explore digital products in this category.',
      };
    }
    if (productType) {
      return {
        title: `${productType.replace('_', ' ')}s`,
        description: `Explore our complete selection of ${productType.toLowerCase().replace('_', ' ')} items.`,
      };
    }
    return {
      title: 'All Products',
      description: 'Explore our complete catalog of digital templates, courses, and resources.',
    };
  };

  const { title: pageTitle, description: pageDescription } = getPageHeader();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Products' }]} />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {pageDescription}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={filters.sortBy || 'featured'}
              onChange={(e) => updateFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Grid & Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterPanel
            filters={filters}
            categories={categories}
            onChange={updateFilters}
            onReset={handleReset}
          />
        </div>

        {/* Products Grid Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Showing {products.length} Products</span>
            {categorySlug || productType || bestSellerOnly || priceRange ? (
              <button
                onClick={handleReset}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Clear active filters
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonLoader variant="card" count={6} />
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products match your criteria"
              description="Try clearing some filters or search for another term."
              actionText="Reset Filters"
              onAction={handleReset}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Filter Products</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              categories={categories}
              onChange={(f) => {
                updateFilters(f);
                setIsMobileFilterOpen(false);
              }}
              onReset={() => {
                handleReset();
                setIsMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
