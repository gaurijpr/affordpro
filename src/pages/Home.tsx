import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Download,
  Award,
  CheckCircle,
  Flame,
  Star,
  Clock,
  BookOpen,
  GraduationCap,
  Layers,
  FileText,
  Layout,
  Video,
  ShoppingBag,
  Users,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  Smartphone,
  Laptop,
  Lock,
  Headphones,
  Search,
  RefreshCw,
  Sliders,
  Check,
  Package,
  Globe,
  Briefcase
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCard } from '../components/product/CategoryCard';
import { CourseCard } from '../components/course/CourseCard';
import { ServiceCard } from '../components/service/ServiceCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Accordion } from '../components/ui/Accordion';

export const Home: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Product[]>([]);
  const [services, setServices] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
        setTypingSpeed(2200);
        setIsDeleting(true);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(300);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bestData, allData, featData, newData, courseData, serviceData, catData] = await Promise.all([
          productService.getBestSellers(),
          productService.getProducts(),
          productService.getFeaturedProducts(),
          productService.getNewArrivals(),
          productService.getCourses(),
          productService.getServices(),
          categoryService.getCategories(),
        ]);
        setBestSellers(bestData);
        setAllProducts(allData);
        setFeaturedProducts(featData);
        setNewArrivals(newData);
        setCourses(courseData);
        setServices(serviceData);
        setCategories(catData);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // FAQ Items Data
  const faqItems = [
    {
      id: 'faq-1',
      title: 'How do I purchase a product?',
      content: (
        <p>
          Simply browse through our catalog or categories, choose the product, course, or service you need, and click <strong>Add to Cart</strong> or <strong>Buy Now</strong>. Proceed through our secure checkout process to complete your order.
        </p>
      ),
    },
    {
      id: 'faq-2',
      title: 'How do I receive a digital product?',
      content: (
        <p>
          After a successful purchase, eligible digital products and templates can be accessed or downloaded immediately from your order confirmation screen and inside your <strong>My Dashboard / Orders</strong> section.
        </p>
      ),
    },
    {
      id: 'faq-3',
      title: 'Can I access my purchased products later?',
      content: (
        <p>
          Yes! All your orders and digital links are safely linked to your account. Log in anytime and navigate to your account dashboard to view and access your past purchases.
        </p>
      ),
    },
    {
      id: 'faq-4',
      title: 'What information is available on a product page?',
      content: (
        <p>
          Every product page includes comprehensive details including format, inclusions, features, preview images, delivery methods, price breakdown, and instructions on how to use it.
        </p>
      ),
    },
    {
      id: 'faq-5',
      title: 'How do courses work?',
      content: (
        <p>
          Our digital courses provide structured learning resources, module outlines, lesson guides, and practical skill materials. Upon enrollment, you can access course resources directly from your dashboard.
        </p>
      ),
    },
    {
      id: 'faq-6',
      title: 'How are services delivered?',
      content: (
        <p>
          For done-for-you custom services (such as Canva designs, Reels editing, or ad setups), our team initiates work according to the specified delivery timeline (typically 2-3 business days) and communicates updates through your order details.
        </p>
      ),
    },
    {
      id: 'faq-7',
      title: 'What payment methods are available?',
      content: (
        <p>
          We support standard secure payment options including UPI, Credit/Debit Cards, Net Banking, and Wallet payments through integrated payment gateway providers.
        </p>
      ),
    },
    {
      id: 'faq-8',
      title: 'How can I contact AffordPro?',
      content: (
        <p>
          You can reach our team via our <strong>Contact Us</strong> page or by emailing support. We aim to respond to inquiries promptly during business hours.
        </p>
      ),
    },
    {
      id: 'faq-9',
      title: 'What happens if I have a problem with my order?',
      content: (
        <p>
          If you encounter any issues downloading your files or accessing your course/service, please contact our support team with your Order ID for immediate assistance.
        </p>
      ),
    },
  ];

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
                Explore affordable templates, courses, digital resources and creative services designed for creators, businesses and everyday users to save time and accelerate growth.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/categories"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base rounded-2xl border-2 border-slate-200 shadow-sm transition-all"
                >
                  Browse Categories
                </Link>
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

            {/* Right Side: Interactive 3D Digital Marketplace Studio & Orbiting Resource Cards */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[440px] py-6 select-none">
              
              {/* Ambient Background Glow Lights */}
              <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
              <div className="absolute w-60 h-60 bg-purple-500/15 rounded-full blur-2xl -bottom-4 right-2 pointer-events-none" />

              {/* Orbiting Card 1 (Top Left - Canva & Reels Bundle) */}
              <div className="absolute -top-4 -left-4 sm:top-2 sm:-left-6 z-20 animate-float-slow">
                <div className="p-3 bg-white/95 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-xl shadow-indigo-500/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Viral Reels & Canva</h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">1080p HD Ready</span>
                  </div>
                </div>
              </div>

              {/* Orbiting Card 2 (Top Right - Online Courses) */}
              <div className="absolute -top-6 -right-4 sm:top-0 sm:-right-4 z-20 animate-float-delayed">
                <div className="p-3 bg-white/95 backdrop-blur-md border border-amber-100 rounded-2xl shadow-xl shadow-amber-500/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Digital Masterclass</h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>4.9 (Self-Paced)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting Card 3 (Bottom Left - Instant Download E-Books) */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-6 sm:-left-6 z-20 animate-float-reverse">
                <div className="p-3 bg-white/95 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Instant Download</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Royalty Free</span>
                  </div>
                </div>
              </div>

              {/* Orbiting Card 4 (Bottom Right - Done-For-You Services) */}
              <div className="absolute -bottom-6 -right-4 sm:bottom-4 sm:-right-4 z-20 animate-float-slow">
                <div className="p-3 bg-white/95 backdrop-blur-md border border-sky-100 rounded-2xl shadow-xl shadow-sky-500/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">Custom Services</h4>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">2-3 Day Delivery</span>
                  </div>
                </div>
              </div>

              {/* Central Digital Product Studio Tablet / Workspace Hub Container */}
              <div
                onClick={handleRocketClick}
                className="relative z-10 w-full max-w-sm bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-3xl border-2 border-indigo-500/30 shadow-2xl hover:border-indigo-400 transition-all cursor-pointer group"
                title="Click to interact with AffordPro Digital Hub ✨"
              >
                {/* Header bar of Central Studio */}
                <div className="flex items-center justify-between pb-3 border-b border-indigo-900/60 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-extrabold">
                    <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>AFFORDPRO HUB ACTIVE</span>
                  </div>
                </div>

                {/* Main Card Content Viewport */}
                <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-indigo-900/80 overflow-hidden flex flex-col items-center justify-center p-4 text-center group-hover:scale-[1.02] transition-transform">
                  
                  {/* Subtle Shimmer Beam */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent -translate-x-full animate-shimmer-beam pointer-events-none" />

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 mb-3 group-hover:rotate-6 transition-transform">
                    <Layout className="w-7 h-7" />
                  </div>

                  <h3 className="font-black text-white text-sm tracking-tight mb-1">
                    Digital Creation Studio
                  </h3>
                  <p className="text-[11px] text-slate-400 max-w-[200px] leading-snug">
                    Templates, Courses, Reels & Custom Services
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Instant Access Ready</span>
                  </div>
                </div>

                {/* Pulse wave when user clicks */}
                {isLaunching && (
                  <div className="absolute inset-0 rounded-3xl border-2 border-indigo-400 animate-ping pointer-events-none" />
                )}
              </div>

              {/* Trust Badge Below Central Hub */}
              <div className="mt-6 flex flex-col items-center z-10 relative">
                <div className="px-6 py-2.5 bg-white/95 backdrop-blur-md border-2 border-emerald-400 rounded-full shadow-xl flex items-center gap-2.5 text-slate-900 transition-transform hover:scale-105">
                  <div className="p-1 rounded-full bg-emerald-500 text-white shadow-md">
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
      </section>

      {/* 2. TRUST / VALUE STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
            <div className="p-3.5 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white rounded-xl shrink-0 transition-colors shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Quality Resources</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Carefully selected digital products, templates, and useful resources.
              </p>
            </div>
          </div>

          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
            <div className="p-3.5 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white rounded-xl shrink-0 transition-colors shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Affordable Prices</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Practical digital solutions designed at accessible, fair pricing.
              </p>
            </div>
          </div>

          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
            <div className="p-3.5 bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white rounded-xl shrink-0 transition-colors shadow-sm">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Easy Access</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Access your eligible digital products immediately after successful checkout.
              </p>
            </div>
          </div>

          <div className="group p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 flex items-start gap-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white rounded-xl shrink-0 transition-colors shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Secure Payments</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Protected transactions processed through supported checkout gateways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT IS AFFORDPRO? (INFORMATIONAL BRAND SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-extrabold text-xs tracking-wider uppercase">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>ABOUT AFFORDPRO MARKETPLACE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Everything You Need in <span className="text-indigo-400">One Digital Store</span>
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                AffordPro brings together digital products, templates, courses and creative services in one simple marketplace. Whether you're a content creator, student, freelancer, entrepreneur or small business owner, discover resources designed to help you save time and get more done.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">For Content Creators</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Ready-made reels, templates, and social media graphics.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">For Businesses & Startups</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Marketing courses, custom design services, and ad setups.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>Learn More About AffordPro</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Graphic Mockup Composition */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-2xl backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">affordpro.shop</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-indigo-600/30 border border-indigo-500/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layout className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs font-bold text-white">Canva & Reels Bundles</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">Ready</span>
                  </div>

                  <div className="p-3 bg-purple-600/30 border border-purple-500/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-purple-400" />
                      <span className="text-xs font-bold text-white">Online Digital Courses</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">Active</span>
                  </div>

                  <div className="p-3 bg-blue-600/30 border border-blue-500/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                      <span className="text-xs font-bold text-white">Custom Done-For-You Services</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">BROWSE BY NICHE</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Explore Categories</h2>
          </div>
          <Link to="/categories" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <SkeletonLoader variant="rect" count={4} className="h-44" />
          ) : (
            categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))
          )}
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS / PICKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">CURATED SELECTION</span>
            <h2 className="text-3xl font-black text-slate-900">Featured Picks</h2>
            <p className="text-slate-500 text-xs">Explore some of the top-rated resources currently available on AffordPro.</p>
          </div>
          <Link to="/products" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            <span>View All Products →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <SkeletonLoader variant="card" count={4} />
          ) : (
            (featuredProducts.length > 0 ? featuredProducts : allProducts).slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 6. PRODUCT TYPE EXPLAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">RESOURCE TYPES</span>
          <h2 className="text-3xl font-black text-slate-900">What Can You Find on AffordPro?</h2>
          <p className="text-slate-600 text-sm">Four main categories of practical digital solutions designed for every workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Digital Products */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Digital Products</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Ready-to-use e-books, guides, PDF resources, and digital assets for your everyday needs.
              </p>
            </div>
            <Link to="/products?category=digital-products" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2">
              <span>Browse Digital Products</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* 2. Templates */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Templates</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Editable Canva designs, social media graphics, and content bundles that help you create faster.
              </p>
            </div>
            <Link to="/products?category=canva-templates" className="inline-flex items-center text-xs font-bold text-purple-600 hover:text-purple-700 pt-2">
              <span>Browse Templates</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* 3. Courses */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Courses</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Learn practical skills through structured digital learning modules and guided resources.
              </p>
            </div>
            <Link to="/products?type=COURSE" className="inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 pt-2">
              <span>Browse Courses</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* 4. Services */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Services</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Get creative design, video editing, and marketing execution done with professional assistance.
              </p>
            </div>
            <Link to="/products?type=SERVICE" className="inline-flex items-center text-xs font-bold text-sky-600 hover:text-sky-700 pt-2">
              <span>Browse Services</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. VISUAL PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              DIGITAL PRODUCTIVITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Create More. Learn More. Grow More.
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Discover practical digital resources built to save time and make your creative and business work easier.
            </p>
          </div>

          <Link
            to="/products"
            className="px-8 py-4 bg-white text-indigo-700 hover:bg-slate-100 font-extrabold text-base rounded-2xl shadow-lg shrink-0 transition-transform transform hover:scale-105"
          >
            Explore the Collection
          </Link>
        </div>
      </section>

      {/* 8. BEST SELLERS / POPULAR RIGHT NOW */}
      <section id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-black text-xs uppercase">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
              <span>TOP TRENDING</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Popular Right Now
            </h2>
            <p className="text-slate-500 text-xs">Explore products that are getting attention from AffordPro visitors.</p>
          </div>
          <Link to="/products?bestseller=true" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            <span>View All Popular Products</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <SkeletonLoader variant="card" count={4} />
          ) : (
            bestSellers.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 9. COURSES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">STRUCTURED SKILL BUILDING</span>
            <h2 className="text-3xl font-black text-slate-900">Learn Skills That Move You Forward</h2>
            <p className="text-slate-500 text-xs">Explore practical courses and learning resources designed to help you build useful digital skills.</p>
          </div>
          <Link to="/products?type=COURSE" className="inline-flex items-center text-sm font-bold text-amber-600 hover:text-amber-700">
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : (
            (courses.length > 0 ? courses : allProducts.filter(p => p.productType === 'COURSE')).slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      </section>

      {/* 10. SERVICES SECTION (DARK HIGHLIGHT CONTAINER) */}
      <section className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-y border-indigo-900/50 py-16 sm:py-20 text-white shadow-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-extrabold text-xs tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>EXPERT CREATIVE EXECUTION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Need It Done for You?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Explore creative and digital services available through AffordPro, including Canva design, Reels video editing, social media assets, and Facebook ad campaign setup.
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
              services.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 11. WHY CHOOSE AFFORDPRO? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">OUR ADVANTAGES</span>
          <h2 className="text-3xl font-black text-slate-900">Why Choose AffordPro?</h2>
          <p className="text-slate-600 text-sm">Designed from the ground up to support creators, business owners, and digital learners.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-3">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Simple</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Easy browsing, clear categories, and straightforward product discovery.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Affordable</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Digital resources designed with practical, accessible pricing.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Practical</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Resources focused on useful everyday and business workflow needs.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Convenient</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Explore digital products, courses and services all from one unified place.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Secure</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Shop with confidence using our supported secure checkout process.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Growing Collection</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              New products and digital resources are continuously updated through our platform.
            </p>
          </div>
        </div>
      </section>

      {/* 12. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">SIMPLE PROCESS</span>
            <h2 className="text-3xl font-black text-slate-900">How It Works</h2>
            <p className="text-slate-600 text-sm">Four easy steps to get your digital products, courses, or services.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
              <span className="text-3xl font-black text-indigo-600/30 block">01</span>
              <h3 className="font-extrabold text-slate-900 text-base">Explore</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Browse through our wide range of products, courses, and custom services.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
              <span className="text-3xl font-black text-indigo-600/30 block">02</span>
              <h3 className="font-extrabold text-slate-900 text-base">Choose</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Open the product page to review features, inclusions, and delivery info.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
              <span className="text-3xl font-black text-indigo-600/30 block">03</span>
              <h3 className="font-extrabold text-slate-900 text-base">Purchase</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Complete your transaction securely through supported payment gateways.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 relative">
              <span className="text-3xl font-black text-indigo-600/30 block">04</span>
              <h3 className="font-extrabold text-slate-900 text-base">Access</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Access your digital items, courses, or service updates directly from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 13. SHOP WITH CONFIDENCE (TRUST & SECURITY SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">BUYER PROTECTION</span>
          <h2 className="text-3xl font-black text-slate-900">Shop With Confidence</h2>
          <p className="text-slate-600 text-sm">We ensure transparency, security, and dedicated support for every transaction.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Secure Checkout</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Payments are processed safely through supported encryption infrastructure.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto sm:mx-0">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Clear Product Info</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Review features, inclusions, and access instructions before buying.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto sm:mx-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Order Tracking</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              View your complete order history and access links anytime in your account.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Customer Support</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Get prompt assistance whenever you need help with an order or product.
            </p>
          </div>
        </div>
      </section>

      {/* 14. DIGITAL PRODUCT VISUAL SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-50 via-white to-slate-50 border border-indigo-100 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">VISUAL SHOWCASE</span>
            <h2 className="text-3xl font-black text-slate-900">Explore Our Resource Formats</h2>
            <p className="text-slate-600 text-sm">Crafted for seamless integration into your content creation and business workflow.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <Layout className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Canva Templates</h4>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Viral Reels</h4>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Online Courses</h4>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">PDF E-books</h4>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Marketing Assets</h4>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-2 hover:border-indigo-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Custom Services</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 15. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">JUST ADDED</span>
            <h2 className="text-3xl font-black text-slate-900">Freshly Added</h2>
            <p className="text-slate-500 text-xs">Discover recently added resources and services on AffordPro.</p>
          </div>
          <Link to="/products?sort=newest" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            <span>Explore All New Arrivals</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <SkeletonLoader variant="card" count={4} />
          ) : (
            (newArrivals.length > 0 ? newArrivals : allProducts).slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 16. CONTENT & RESOURCE SECTION (STATIC TIPS & EDUCATIONAL CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">CREATOR INSIGHTS</span>
            <h2 className="text-3xl font-black text-slate-900">Ideas, Tips & Digital Resources</h2>
            <p className="text-slate-500 text-xs">Practical guides and ideas to help you streamline content and digital projects.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Content Creation Workflow</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              How batching reels templates and pre-made Canva graphics can save up to 10 hours every week.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Designing with Canva</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Tips for customizing pre-built digital templates while keeping your unique brand identity intact.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Digital Skill Building</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Why structured short courses and practical guides accelerate digital marketing success.
            </p>
          </div>
        </div>
      </section>

      {/* 17. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">GOT QUESTIONS?</span>
          <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm">Find quick answers to common questions about AffordPro products, delivery, and payments.</p>
        </div>

        <Accordion items={faqItems} defaultOpenId="faq-1" />

        <div className="mt-8 text-center">
          <Link to="/faq" className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700">
            <span>View Complete FAQ Knowledge Base</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </section>

      {/* 18. FINAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Start Exploring Now
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Find Something Useful for Your Next Project
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Browse digital products, templates, courses and services available on AffordPro today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 hover:bg-slate-100 font-extrabold text-base rounded-2xl shadow-lg transition-transform transform hover:scale-105 text-center"
            >
              Explore Products
            </Link>
            <Link
              to="/categories"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-800/80 hover:bg-indigo-800 text-white border border-indigo-500/50 font-extrabold text-base rounded-2xl transition-colors text-center"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
