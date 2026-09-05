import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, BarChart, GraduationCap, PlayCircle } from 'lucide-react';
import { Product } from '../../types/product';
import { PriceDisplay } from '../ui/PriceDisplay';
import { Rating } from '../ui/Rating';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';

interface CourseCardProps {
  course: Product;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden card-shadow card-hover flex flex-col h-full">
      {/* Course Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        <img
          src={course.images[0]}
          alt={course.title}
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <PlayCircle className="w-8 h-8 fill-white/20" />
          </div>
        </div>

        {/* Level badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="warning" size="sm">
            {course.level || 'All Levels'}
          </Badge>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            Online Course
          </span>
          <Rating value={course.rating} count={course.reviewCount} size="sm" />
        </div>

        <Link to={`/product/${course.slug}`}>
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>
        </Link>

        {/* Meta Stats */}
        <div className="grid grid-cols-2 gap-2 py-2 px-3 bg-slate-50 rounded-xl text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.courseDuration || 'Self-paced'}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.lessons ? `${course.lessons} Lessons` : 'Multiple Modules'}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <PriceDisplay
            price={course.price}
            compareAtPrice={course.compareAtPrice}
            discount={course.discount}
            size="md"
          />

          <Link
            to={`/product/${course.slug}`}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
};
