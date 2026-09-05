import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Accordion } from '../components/ui/Accordion';
import { pageService, PageContent } from '../services/pageService';

export const FAQ: React.FC = () => {
  const [page, setPage] = useState<PageContent>(() => pageService.getPageContent('faq'));

  useEffect(() => {
    setPage(pageService.getPageContent('faq'));
  }, []);

  // Parse Q&A from content string if formatted as Q: ... A: ...
  const rawContent = page.content || '';
  const qaPairs = rawContent.split(/\n\s*\n/).filter(Boolean);
  const faqItems = qaPairs.map((block, idx) => {
    const lines = block.split('\n');
    const qLine = lines.find((l) => l.startsWith('Q:')) || lines[0] || `Question ${idx + 1}`;
    const aLine = lines.filter((l) => !l.startsWith('Q:')).join(' ').replace(/^A:\s*/, '') || block;
    return {
      id: `faq-${idx + 1}`,
      title: qLine.replace(/^Q:\s*/, ''),
      content: aLine,
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: page.title || 'Frequently Asked Questions' }]} />

      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{page.title}</h1>
        {page.subtitle && <p className="text-slate-500 text-sm">{page.subtitle}</p>}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow">
        {faqItems.length > 0 ? (
          <Accordion items={faqItems} defaultOpenId="faq-1" />
        ) : (
          <div className="whitespace-pre-wrap leading-relaxed text-slate-700 text-sm">{page.content}</div>
        )}
      </div>
    </div>
  );
};
