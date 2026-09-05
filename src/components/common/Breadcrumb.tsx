import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold overflow-x-auto py-2">
      <Link to="/" className="hover:text-indigo-600 flex items-center gap-1 shrink-0">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-indigo-600 shrink-0">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-bold shrink-0 line-clamp-1 max-w-[200px]">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
