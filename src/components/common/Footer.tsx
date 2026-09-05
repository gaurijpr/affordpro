import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Globe, Video, Send, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info & Official Large Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <img
                src="/affordpro-logo.png"
                alt="AffordPro — Premium Digital Products"
                className="h-24 sm:h-32 w-auto max-w-[340px] sm:max-w-[420px] object-contain bg-white p-3.5 rounded-2xl shadow-xl transition-transform group-hover:scale-103"
              />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Premium digital products, ready-to-use Canva templates, viral reels bundles, online courses & marketing services at affordable prices to help creators and businesses grow.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Social Link" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Social Link" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors">
                <Video className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Social Link" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Social Link" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/products?category=reels-bundles" className="hover:text-white transition-colors">
                  Reels Bundles
                </Link>
              </li>
              <li>
                <Link to="/products?category=canva-templates" className="hover:text-white transition-colors">
                  Canva Templates
                </Link>
              </li>
              <li>
                <Link to="/products?type=COURSE" className="hover:text-white transition-colors">
                  Online Courses
                </Link>
              </li>
              <li>
                <Link to="/products?category=digital-products" className="hover:text-white transition-colors">
                  Digital Products & E-books
                </Link>
              </li>
              <li>
                <Link to="/products?type=SERVICE" className="hover:text-white transition-colors">
                  Done-For-You Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support Column */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About AffordPro
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ & Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Legal Policies
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© 2026 AffordPro. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Secure Checkout
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Instant Digital Access
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
