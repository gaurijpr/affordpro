import React, { useState, useEffect } from 'react';
import { Sparkles, Target, ShieldCheck, Heart, Zap, Award, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { pageService, PageContent } from '../services/pageService';

export const About: React.FC = () => {
  const [page, setPage] = useState<PageContent>(() => pageService.getPageContent('about'));

  useEffect(() => {
    setPage(pageService.getPageContent('about'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumb items={[{ label: page.title || 'About AffordPro' }]} />

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
          OUR STORY & MISSION
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-slate-600 text-base leading-relaxed">
            {page.subtitle}
          </p>
        )}
      </div>

      {/* Content Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 card-shadow whitespace-pre-wrap leading-relaxed text-slate-700 text-sm font-medium">
        {page.content}
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 card-shadow space-y-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Our Mission</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            To democratize access to world-class digital resources, ready-to-use social media graphics, video reels, and practical skills. We help creators, freelancers, and small business owners save hundreds of hours while growing their online presence.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 card-shadow space-y-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Our Values</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            We value uncompromising quality, transparency, instant customer access, and affordability. Every digital bundle and course in our marketplace is curated to deliver real, tangible ROI.
          </p>
        </div>
      </div>

      {/* Why Choose AffordPro */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-white">Why Choose AffordPro?</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            What sets us apart from generic stock websites and overpriced marketplaces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-slate-300">
          <div className="p-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-base">Instant Access</h3>
            <p className="text-xs leading-relaxed">Download your digital assets or start learning immediately upon payment verification.</p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-2">
            <Award className="w-6 h-6 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Battle-Tested Assets</h3>
            <p className="text-xs leading-relaxed">Every reel, template, and prompt pack is tested for high engagement & conversions.</p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700/60 rounded-2xl space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Commercial License</h3>
            <p className="text-xs leading-relaxed">Use our templates and reels for personal brand pages or client projects freely.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
