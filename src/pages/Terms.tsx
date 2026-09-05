import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { pageService, PageContent } from '../services/pageService';

export const Terms: React.FC = () => {
  const [page, setPage] = useState<PageContent>(() => pageService.getPageContent('terms'));

  useEffect(() => {
    setPage(pageService.getPageContent('terms'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: page.title || 'Terms & Conditions' }]} />

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 card-shadow space-y-6 text-slate-700 text-sm leading-relaxed">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-3xl font-black text-slate-900">{page.title}</h1>
          {page.subtitle && <p className="text-slate-500 text-sm mt-1">{page.subtitle}</p>}
          {page.lastUpdated && <p className="text-xs text-slate-400 mt-2 font-mono">Last updated: {page.lastUpdated}</p>}
        </div>

        <div className="whitespace-pre-wrap leading-relaxed text-slate-700 font-medium space-y-4">
          {page.content}
        </div>
      </div>
    </div>
  );
};
