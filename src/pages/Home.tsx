import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Zap, ShieldCheck, Download, Award, CheckCircle, Flame, Star, 
  ChevronDown, ChevronLeft, ChevronRight, HelpCircle, Users, DownloadCloud, Lock, FileCheck, Headphones, Check, Layers, Play, X
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { testimonialService } from '../services/testimonialService';
import { Product } from '../types/product';
import { ProductCard } from '../components/product/ProductCard';
import { ServiceCard } from '../components/service/ServiceCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export const Home: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Product[]>([]);
  const [creatorReviews, setCreatorReviews] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
        const [bestData, allData, serviceData, reviewsData] = await Promise.all([
          productService.getBestSellers(),
          productService.getProducts(),
          productService.getServices(),
          testimonialService.getTestimonials(10),
        ]);
        setBestSellers(bestData);
        setAllProducts(allData);
        setServices(serviceData);
        setCreatorReviews(reviewsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const faqs = [
    {
      q: 'Are all digital products and courses 100% working & tested?',
      a: 'Yes, 100%! Every single Canva template, reels bundle, course, and resource in our catalog is thoroughly tested and verified by our team before listing. We guarantee 100% functional, ready-to-use digital assets.',
    },
    {
      q: 'How do I receive my files or course access after purchase?',
      a: 'Immediately after your payment is completed, an automated instant download page opens on your screen. You also receive an automated email containing your lifetime Google Drive / PDF access links.',
    },
    {
      q: 'Can I use these assets for my personal and client projects?',
      a: 'Absolutely! All our digital products include a commercial license. You can customize templates, produce client designs, or publish reels across your social media channels without paying extra royalties.',
    },
    {
      q: 'Do I need a paid Canva account to edit the Canva Templates?',
      a: 'No, all our Canva template bundles are specially crafted to work seamlessly with both Free and Pro Canva accounts. You can edit text, colors, images, and fonts with zero restrictions.',
    },
    {
      q: 'What if I need help downloading or customizing my resources?',
      a: 'Our dedicated customer support team is available 24/7 to assist you. If you ever have questions or need help with a download, simply contact us via WhatsApp or email for instant support.',
    },
    {
      q: 'Is my payment transaction safe and secure?',
      a: 'Yes, 100% safe. We utilize 256-bit SSL encryption and trusted payment gateways to ensure your transactions and payment details remain completely secure.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Content Creator & SMM',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      text: 'The 1000+ Viral Reels Bundle saved me hundreds of hours! The video quality is top notch and 100% working. My Instagram page gained 45k followers in just 30 days.',
      rating: 5,
    },
    {
      name: 'Rohan Verma',
      role: 'Digital Agency Owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      text: 'AffordPro is my secret vault for high-converting Canva templates and courses. Instant drive access right after payment. Absolutely worth every single rupee!',
      rating: 5,
    },
    {
      name: 'Ananya Patel',
      role: 'E-commerce Brand Founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text: 'Super easy to download and customize. The Meta ads course and prompt pack gave my business instant clarity. 100% working and highly recommended!',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 0. LIVE TOP TRUST ANNOUNCEMENT TICKER */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-900 text-white py-2.5 px-4 text-center text-xs font-extrabold tracking-wide flex items-center justify-center gap-3 shadow-sm select-none">
        <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full text-[10px]">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <span>VERIFIED 100% WORKING</span>
        </span>
        <span className="hidden sm:inline">🔥 10,000+ Digital Creators & Marketers Trust AffordPro</span>
        <span className="hidden md:inline">• ⚡ Instant Download & Lifetime Access Guaranteed</span>
      </div>

      {/* 1. HERO SECTION WITH TYPEWRITER & SKY ROCKET LAUNCH ANIMATION */}
      <section className="relative overflow-hidden pt-4 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-b border-slate-100">
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
                Discover affordable digital products, ready-to-use Canva templates, viral reels bundles, 100% working marketing courses, and done-for-you custom services designed to save you time and scale your online business.
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
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-bold">
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>100% Working Courses</span>
                </div>
                <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Instant Drive Access</span>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-xl">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Royalty Free License</span>
                </div>
              </div>
            </div>

            {/* Right Sky Rocket Launch Animation */}
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
                
                {/* 3D Rocket Graphic */}
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

                  {/* Realistic Thruster Flame */}
                  {isLaunching && (
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center animate-flame z-10 pointer-events-none">
                      <div className="w-16 h-28 bg-gradient-to-b from-yellow-300 via-orange-500 to-rose-600 rounded-b-full shadow-[0_0_50px_rgba(249,115,22,0.9)] animate-pulse" />
                      <div className="absolute top-0 w-8 h-18 bg-gradient-to-b from-cyan-200 via-white to-amber-300 rounded-b-full shadow-[0_0_30px_rgba(255,255,255,1)]" />
                      <div className="absolute top-2 w-4 h-10 bg-white rounded-b-full shadow-[0_0_20px_rgba(255,255,255,1)]" />
                    </div>
                  )}
                </div>

                {/* Below Rocket Base */}
                <div className="mt-4 flex flex-col items-center z-10 relative">
                  {isLaunching && (
                    <div className="absolute -top-20 inset-x-0 flex items-center justify-center animate-high-smoke pointer-events-none z-0">
                      <div className="w-96 h-36 bg-gradient-to-r from-slate-200/95 via-indigo-100/95 to-slate-200/95 rounded-full blur-md shadow-2xl" />
                      <div className="absolute -top-12 -left-4 w-44 h-44 bg-white/95 rounded-full blur-md" />
                      <div className="absolute -top-14 -right-4 w-48 h-48 bg-indigo-100/90 rounded-full blur-md" />
                      <div className="absolute -top-6 w-60 h-32 bg-gradient-to-t from-amber-400/40 via-white/90 to-indigo-50/90 rounded-full blur-md" />
                    </div>
                  )}

                  {/* Trust Policy Pill Badge */}
                  <div className="px-6 py-3 bg-white/95 backdrop-blur-md border-2 border-emerald-400 rounded-full shadow-xl flex items-center gap-2.5 text-slate-900 z-10 transition-transform transform group-hover:scale-105">
                    <div className="p-1.5 rounded-full bg-emerald-500 text-white shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-black text-xs sm:text-sm tracking-tight text-slate-900 whitespace-nowrap">
                      Trust is our first policy • 100% Working
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS & METRICS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400 tracking-tight">10,000+</div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Happy Creators</div>
            <p className="text-[11px] text-slate-400">Trusting our digital marketplace</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">100%</div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Working Courses</div>
            <p className="text-[11px] text-slate-400">Tested video lessons & guides</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">4.9 ★</div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Average Rating</div>
            <p className="text-[11px] text-slate-400">Over 14,200+ customer reviews</p>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-purple-400 tracking-tight">Instant</div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Automated Delivery</div>
            <p className="text-[11px] text-slate-400">Google Drive & direct download</p>
          </div>
        </div>
      </section>

      {/* 3. TRUST & VALUE CARDS SECTION WITH HOVER ANIMATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">WHY CREATORS CHOOSE US</span>
          <h2 className="text-3xl font-black text-slate-900">Guaranteed Quality & Working Resources</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: 100% Working Courses */}
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-2 flex items-start gap-4 cursor-pointer relative overflow-hidden">
            <div className="p-3 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-12 rounded-xl shrink-0 transition-all duration-300 shadow-sm">
              <FileCheck className="w-6 h-6 transition-transform" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 text-base mb-1 transition-colors">100% Working Courses</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
                Every course and template pack is thoroughly tested and guaranteed 100% functional.
              </p>
            </div>
          </div>

          {/* Card 2: Instant Digital Access */}
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-2 flex items-start gap-4 cursor-pointer relative overflow-hidden">
            <div className="p-3 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:translate-y-0.5 rounded-xl shrink-0 transition-all duration-300 shadow-sm">
              <DownloadCloud className="w-6 h-6 transition-transform" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600 text-base mb-1 transition-colors">Instant Drive Access</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
                Download your files or access your Google Drive folder immediately after purchase.
              </p>
            </div>
          </div>

          {/* Card 3: Commercial License */}
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-2 flex items-start gap-4 cursor-pointer relative overflow-hidden">
            <div className="p-3 bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-12 rounded-xl shrink-0 transition-all duration-300 shadow-sm">
              <Award className="w-6 h-6 transition-transform" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-purple-600 text-base mb-1 transition-colors">Royalty-Free License</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
                Use templates and reels for unlimited personal, business, and client projects.
              </p>
            </div>
          </div>

          {/* Card 4: 256-Bit SSL Checkout */}
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 flex items-start gap-4 cursor-pointer relative overflow-hidden">
            <div className="p-3 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 rounded-xl shrink-0 transition-all duration-300 shadow-sm">
              <Lock className="w-6 h-6 transition-transform" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 text-base mb-1 transition-colors">256-Bit SSL Checkout</h3>
              <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
                Safe and encrypted payments with instant automated order fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEST SELLING PRODUCTS SECTION */}
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
          ) : bestSellers.length > 0 ? (
            bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm font-bold text-slate-500">No Best Selling products added yet.</p>
              <p className="text-xs text-slate-400 mt-1">Upload products from the Admin Panel to display them here.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. 3-STEP PROCESS WORKFLOW SECTION */}
      <section className="bg-slate-50/80 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">HOW IT WORKS</span>
            <h2 className="text-3xl font-black text-slate-900">3 Easy Steps to Access Your Assets</h2>
            <p className="text-slate-500 text-sm">Start building your audience and scaling your business in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">1</span>
              <h3 className="text-xl font-extrabold text-slate-900">Browse & Select</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Pick from our collection of verified Canva templates, reels bundles, prompt kits, and marketing courses.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md">2</span>
              <h3 className="text-xl font-extrabold text-slate-900">Instant Checkout</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Pay securely using your preferred payment method. Transactions are protected with 256-bit SSL encryption.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative space-y-4">
              <span className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-md">3</span>
              <h3 className="text-xl font-extrabold text-slate-900">Download & Scale</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Receive instant one-click Google Drive access and PDF download links right on your screen and email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROFESSIONAL CUSTOM SERVICES SECTION */}
      <section className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-y border-indigo-900/50 py-16 sm:py-20 text-white shadow-2xl overflow-hidden">
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
            ) : services.length > 0 ? (
              services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <div className="col-span-full py-10 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-sm font-bold text-slate-400">No Custom Services added yet.</p>
                <p className="text-xs text-slate-500 mt-1">Upload service listings from the Admin Panel to display them here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. ALL PRODUCTS CATALOG SECTION */}
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
          ) : allProducts.length > 0 ? (
            allProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-sm font-bold text-slate-500">No products uploaded yet.</p>
              <p className="text-xs text-slate-400 mt-1">Uploaded products from the Admin Panel will immediately display here.</p>
            </div>
          )}
        </div>
      </section>

      {/* 8. VERIFIED CREATOR VIDEO REELS SHOWCASE - Vertical Card Layout matching user reference design */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-xs">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>CREATOR VIDEO STORIES & BUYER REVIEWS</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">What Our Creators Say</h2>
            <p className="text-slate-500 text-xs">Click play on any creator reel to watch their video story. Scroll right or left to explore all creators.</p>
          </div>

          {/* Carousel Scroll Buttons */}
          <div className="flex items-center gap-2 shrink-0 select-none">
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container for Vertical Reel Cards */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-4.5 py-4 px-1 scroll-smooth snap-x snap-mandatory items-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {creatorReviews.slice(0, 10).map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setActiveVideo(item)}
              className="group relative min-w-[230px] sm:min-w-[260px] lg:min-w-[270px] h-[400px] sm:h-[430px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 cursor-pointer snap-start transition-all transform hover:scale-[1.02] hover:shadow-2xl shrink-0 select-none"
            >
              {/* Background Creator Photo */}
              <img
                src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={item.userName || item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Verified Rating Star Badge in Top Left */}
              <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-black text-amber-300 flex items-center gap-1.5 shadow-md">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>5.0</span>
                <span className="text-slate-300 font-normal">| Verified</span>
              </div>

              {/* Top-Right Click Indicator Badge */}
              <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-extrabold text-white group-hover:bg-amber-500 group-hover:border-amber-400 transition-all shadow-md">
                View ↗
              </div>

              {/* Dark Gradient Overlay for Maximum Text Clarity */}
              <div className="absolute inset-x-0 bottom-0 pt-16 pb-5 px-4 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent backdrop-blur-[1px] flex flex-col justify-end space-y-2 text-left">
                {/* 1. FIRST: User Name Badge */}
                <div className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black text-xs shadow-lg shadow-orange-500/30 border border-amber-300/40 tracking-wide w-fit">
                  {item.userName || item.name}
                </div>

                {/* 2. SECOND: Highlight / Title */}
                {item.title && (
                  <h4 className="font-extrabold text-white text-xs sm:text-sm tracking-tight leading-snug drop-shadow-md line-clamp-2">
                    {item.title}
                  </h4>
                )}

                {/* 3. THIRD: Full Reviews / Comment */}
                <p className="text-slate-200 text-xs leading-relaxed italic line-clamp-3 font-semibold drop-shadow-sm">
                  "{item.comment || item.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FULL CREATOR REVIEW & VIDEO MODAL OVERLAY (Z-[9999]) */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 cursor-default text-left"
          >
            {/* Modal Header */}
            <div className="p-4 bg-slate-900/90 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={activeVideo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h4 className="font-black text-white text-base leading-snug">{activeVideo.userName || activeVideo.name}</h4>
                  <p className="text-amber-400 text-xs font-bold flex items-center gap-1">
                    <span>★ 5.0 / 5.0</span>
                    <span className="text-slate-400 font-normal">• {activeVideo.role || 'Verified Creator'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player or HD Creator Photo Showcase */}
            {activeVideo.videoUrl ? (
              <div className="relative aspect-[9/16] bg-black max-h-[440px] flex items-center justify-center overflow-hidden">
                {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={activeVideo.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    title={activeVideo.userName}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="relative aspect-video bg-slate-950 overflow-hidden border-y border-slate-800">
                <img
                  src={activeVideo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt=""
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  ✓ Verified Buyer Review
                </div>
              </div>
            )}

            {/* Modal Review Full Details */}
            <div className="p-5 bg-slate-900 text-slate-300 space-y-2">
              <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black rounded-lg">
                {activeVideo.userName || activeVideo.name}
              </div>
              {activeVideo.title && (
                <div className="font-black text-white text-base leading-snug">"{activeVideo.title}"</div>
              )}
              <p className="text-slate-300 text-xs leading-relaxed italic bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                "{activeVideo.comment || activeVideo.text}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>GOT QUESTIONS? WE HAVE ANSWERS</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm">Everything you need to know about our digital marketplace and instant downloads.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-slate-900 text-sm hover:text-indigo-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. ENHANCED CTA & GUARANTEE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Satisfaction & Working Guarantee</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Ready to Upgrade Your Digital Workflow?
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Join 10,000+ creators, marketers, and business owners leveraging AffordPro tools to grow faster with instant access.
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
