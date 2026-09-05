import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Layout, GraduationCap, Download, TrendingUp, Share2, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { Category } from '../../types/category';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const getIcon = () => {
    switch (category.icon) {
      case 'Video': return <Video className="w-6 h-6 text-indigo-600" />;
      case 'Layout': return <Layout className="w-6 h-6 text-purple-600" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-amber-600" />;
      case 'Download': return <Download className="w-6 h-6 text-emerald-600" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-rose-600" />;
      case 'Share2': return <Share2 className="w-6 h-6 text-sky-600" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-blue-600" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-violet-600" />;
      default: return <Sparkles className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 card-shadow card-hover flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:scale-110 transition-transform">
            {getIcon()}
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {category.productCount}+ Resources
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
          {category.name}
        </h3>

        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {category.description}
        </p>
      </div>

      <div className="flex items-center text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
        <span>Browse Category</span>
        <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
};
