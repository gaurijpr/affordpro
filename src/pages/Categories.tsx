import React, { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/category';
import { CategoryCard } from '../components/product/CategoryCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Categories' }]} />

      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          Product Categories
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Browse digital assets, courses, and services categorized by niche and workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <SkeletonLoader variant="rect" count={8} className="h-44" />
        ) : (
          categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))
        )}
      </div>
    </div>
  );
};
