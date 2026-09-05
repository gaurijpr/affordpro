import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Download, Award, CheckCircle, Flame, Star, Wrench } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { ProductCard } from '../components/product/ProductCard';
import { ServiceCard } from '../components/service/ServiceCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export const Home: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleRocketClick = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
    }, 2200);
  };

  // Typewriter Animation State
  const phrases = [
    'Create, Learn & Grow',
    'Scale Your Business',
    'Build Digital Products',
    'Automate Content Creation',
  ];
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(120);

  useEffect(() => {
    const i = loopNum % phrases.length;
    const fullText = phrases[i];

    const handleTyping = () => {
      setTypedText(
        isDeleting
          ? fullText.substring(0, typedText.length - 1)
          : fullText.substring(0, typedText.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 90);

      if (!isDeleting && typedText === fullText) {
        setTypingSpeed(2200); // Pause on completed text
        setIsDeleting(true);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(300); // Pause before typing next phrase
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bestData, allData, serviceData] = await Promise.all([
          productService.getBestSellers(),
          productService.getProducts(),
          productService.getServices(),
        ]);
        setBestSellers(bestData);
        setAllProducts(allData);
        setServices(serviceData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION WITH TYPEWRITER & SKY ROCKET LAUNCH ANIMATION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-xs font-extrabold shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>PREMIUM DIGITAL RESOURCES AT AFFORDABLE PRICES</span>
              </div>

              {/* Dynamic Animated Typewriter Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] min-h-[2.5em] sm:min-h-[2.2em]">
                Everything You Need to <br className="hidden sm:inline" />
                <span className="gradient-text inline-inline border-r-4 border-indigo-600 pr-1 animate-pulse">
                  {typedText}
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover affordable digital products, ready-to-use Canva templates, viral reels bundles, marketing courses, and done-for-you services designed to save you time and accelerate your business.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#best-sellers"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base rounded-2xl border-2 border-slate-200 shadow-sm transition-all"
                >
                  View Best Sellers
                </a>
              </div>

              {/* Quick proof badges */}
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Royalty Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>100% Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Right Sky Rocket Launch Animation (No Background Box!) */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[420px] py-4">
              {/* Floating Stars in Sky */}
              <div className="absolute top-2 left-6 text-amber-400 animate-star-1">
                <Sparkles className="w-5 h-5 fill-amber-400/30" />
              </div>
              <div className="absolute top-10 right-4 text-indigo-400 animate-star-2">
                <Sparkles className="w-6 h-6 fill-indigo-400/30" />
              </div>
              <div className="absolute bottom-16 left-2 text-purple-400 animate-star-3">
                <Sparkles className="w-4 h-4 fill-purple-400/30" />
              </div>

              {/* Stable Rocket & Below Launch Smoke Cloud */}
              <div className="relative flex flex-col items-center select-none">
                
                {/* 3D Rocket Graphic (Stable & Launches on click) */}
                <div
                  onClick={handleRocketClick}
                  className={`relative z-20 cursor-pointer group transition-transform ${
                    isLaunching ? 'animate-rocket-air-release z-50' : 'hover:scale-105 active:scale-95'
                  }`}
                  title="Click to Launch Rocket to Sky! 🚀"
                >
                  <svg className="w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 filter drop-shadow-2xl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Rocket Body */}
                    <path d="M100 20C100 20 135 60 135 120C135 135 125 145 100 145C75 145 65 135 65 120C65 60 100 20 100 20Z" fill="url(#rocketBodyGrad)" />
                    
                    {/* Nose Cone */}
                    <path d="M100 20C100 20 120 45 125 70H75C80 45 100 20 100 20Z" fill="url(#rocketNoseGrad)" />

                    {/* Left & Right Fins */}
                    <path d="M65 110L40 140C38 142 42 150 50 148L67 138" fill="#4F46E5" />
                    <path d="M135 110L160 140C162 142 158 150 150 148L133 138" fill="#4F46E5" />
                    
                    {/* Portal Window */}
                    <circle cx="100" cy="85" r="16" fill="#0F172A" stroke="#E2E8F0" strokeWidth="4" />
                    <circle cx="100" cy="85" r="10" fill="#38BDF8" />
                    <circle cx="97" cy="82" r="3" fill="white" opacity="0.8" />

                    {/* Thruster Nozzle */}
                    <path d="M85 145H115L110 155H90L85 145Z" fill="#1E293B" />

                    <defs>
                      <linearGradient id="rocketBodyGrad" x1="65" y1="20" x2="135" y2="145" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6366F1" />
                        <stop offset="0.5" stopColor="#4F46E5" />
                        <stop offset="1" stopColor="#3730A3" />
                      </linearGradient>
                      <linearGradient id="rocketNoseGrad" x1="75" y1="20" x2="125" y2="70" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#EC4899" />
                        <stop offset="1" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Realistic Multi-Layered Thruster Fire Flame (Fires when user clicks rocket!) */}
                  {isLaunching && (
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center animate-flame z-10 pointer-events-none">
                      {/* Outer Orange/Red Plasma Fire Plume */}
                      <div className="w-16 h-28 bg-gradient-to-b from-yellow-300 via-orange-500 to-rose-600 rounded-b-full shadow-[0_0_50px_rgba(249,115,22,0.9)] animate-pulse" />
                      
                      {/* Inner White-Hot Engine Thrust Core */}
                      <div className="absolute top-0 w-8 h-18 bg-gradient-to-b from-cyan-200 via-white to-amber-300 rounded-b-full shadow-[0_0_30px_rgba(255,255,255,1)]" />

                      {/* Spark Diamond Core */}
                      <div className="absolute top-2 w-4 h-10 bg-white rounded-b-full shadow-[0_0_20px_rgba(255,255,255,1)]" />
                    </div>
                  )}
                </div>

                {/* Below Rocket Base: Displays 'Trust is our first policy' (Releases lighter high smoke cloud burst when user clicks!) */}
                <div className="mt-4 flex flex-col items-center z-10 relative">
                  
                  {/* Towering Lighter Vapor Launch Smoke Cloud Burst (Releases during 1-sec air release phase!) */}
                  {isLaunching && (
                    <div className="absolute -top-20 inset-x-0 flex items-center justify-center animate-high-smoke pointer-events-none z-0">
                      {/* Base Lighter Slate/Indigo Vapor Cloud */}
                      <div className="w-96 h-36 bg-gradient-to-r from-slate-200/95 via-indigo-100/95 to-slate-200/95 rounded-full blur-md shadow-2xl" />
                      
                      {/* Left Billowing Lighter Smoke Puff */}
                      <div className="absolute -top-12 -left-4 w-44 h-44 bg-white/95 rounded-full blur-md" />
                      
                      {/* Right Billowing Pearl Smoke Puff */}
                      <div className="absolute -top-14 -right-4 w-48 h-48 bg-indigo-100/90 rounded-full blur-md" />
                      
                      {/* Center Fiery Glowing Launch Exhaust Vapor */}
                      <div className="absolute -top-6 w-60 h-32 bg-gradient-to-t from-amber-400/40 via-white/90 to-indigo-50/90 rounded-full blur-md" />
                    </div>
                  )}

                  {/* Trust Policy Pill Badge */}
                  <div className="px-6 py-3 bg-white/95 backdrop-blur-md border-2 border-emerald-400 rounded-full shadow-xl flex items-center gap-2.5 text-slate-900 z-10 transition-transform transform group-hover:scale-105">
                    <div className="p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 whitespace-nowrap">
                      Trust is our first policy
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / VALUE SECTION WITH HOVER ANIMATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Affordable Pricing */}
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-2 flex items-start gap-4 cursor-pointer relative overflow-hidden">
            <div className="p-3 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-12 rounded-xl shrink-0 transition-all duration-300 shadow-sm">
              <Zap className="w-6 h-6 transition-transform" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 text-base mb-1 transition-colors">Affordable Pricing</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
                Get premium quality resources without paying exorbitant agency prices.
              </p>
            </div>
          </div>

          {/* Card 2: Instant Digital Access */}
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-2 flex items-start gap-4 cursor-pointer relative overflow-hidden">
            <div className="p-3 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:translate-y-0.5 rounded-xl shrink-0 transition-all duration-300 shadow-sm">
              <Download className="w-6 h-6 transition-transform" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600 text-base mb-1 transition-colors">Instant Digital Access</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
                Download your files or access your courses immediately after payment.
              </p>
            </div>
          </div>

          {/* Card 3: Quality Resources */}
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 flex items-start gap-4 cursor-pointer relative overflow-hidden">
            <div className="p-3 bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-12 rounded-xl shrink-0 transition-all duration-300 shadow-sm">
              <Award className="w-6 h-6 transition-transform" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-purple-600 text-base mb-1 transition-colors">Quality Resources</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
                Carefully designed and battle-tested digital assets that drive real results.
              </p>
            </div>
          </div>

          {/* Card 4: Secure Payments */}
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 flex items-start gap-4 cursor-pointer relative overflow-hidden">
            <div className="p-3 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 rounded-xl shrink-0 transition-all duration-300 shadow-sm">
              <ShieldCheck className="w-6 h-6 transition-transform" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 text-base mb-1 transition-colors">Secure Payments</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
                Safe and trusted payment gateways with 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BEST SELLING PRODUCTS WITH ENHANCED ATTRACTIVE HEADER */}
      <section id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border border-rose-200 text-rose-600 font-black text-xs tracking-wider uppercase shadow-xs">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
              <span>TOP RATED & MOST POPULAR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Best Selling <span className="gradient-text">Products</span>
            </h2>
          </div>
          <Link to="/products?bestseller=true" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <SkeletonLoader variant="card" count={4} />
          ) : (
            bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 4. PROFESSIONAL CUSTOM SERVICES (STANDOUT HIGHLIGHTED DARK GRADIENT CONTAINER) */}
      <section className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-y border-indigo-900/50 py-16 sm:py-20 text-white shadow-2xl overflow-hidden">
        {/* Decorative Ambient Background Lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-extrabold text-xs tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>DONE-FOR-YOU SERVICES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Professional <span className="text-indigo-400">Custom Services</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Short on time? Let our certified experts handle custom graphic design, video reel editing, and Meta ad campaign setup for your business.
              </p>
            </div>

            <Link
              to="/products?type=SERVICE"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-indigo-600/30 transition-all shrink-0"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : (
              services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. ALL PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">OUR FULL CATALOG</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">All Products</h2>
          </div>
          <Link to="/products" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            <span>Explore Store</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <SkeletonLoader variant="card" count={8} />
          ) : (
            allProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 6. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Start Building Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Ready to Upgrade Your Digital Workflow?
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Join thousands of creators, marketers, and business owners leveraging AffordPro tools to grow faster.
            </p>
          </div>

          <Link
            to="/products"
            className="px-8 py-4 bg-white text-indigo-700 hover:bg-slate-100 font-extrabold text-base rounded-2xl shadow-lg shrink-0 transition-transform transform hover:scale-105"
          >
            Explore Marketplace
          </Link>
        </div>
      </section>
    </div>
  );
};
