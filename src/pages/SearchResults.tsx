import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/ui/Button';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      try {
        setLoading(true);
        const results = await productService.getProducts({ searchQuery: query });
        setProducts(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Search Results' }]} />

      <div className="space-y-4 max-w-xl">
        <h1 className="text-3xl font-black text-slate-900">
          Search Results {query ? `for "${query}"` : ''}
        </h1>
        <SearchBar initialValue={query} placeholder="Search digital products, courses, services..." />
      </div>

      <div className="pt-2">
        <div className="text-xs font-bold text-slate-500 mb-6">
          {loading ? 'Searching catalog...' : `${products.length} products found`}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonLoader variant="card" count={4} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl inline-block">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No products found</h3>
            <p className="text-slate-500 text-sm">
              We couldn't find any digital resources matching "{query}". Try another keyword or browse our popular categories below.
            </p>
            <div className="pt-4 flex flex-wrap gap-2 justify-center">
              <Link to="/products?category=canva-templates" className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
                Canva Templates
              </Link>
              <Link to="/products?category=reels-bundles" className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
                Reels Bundles
              </Link>
              <Link to="/products?type=COURSE" className="px-3 py-1.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
                Online Courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
