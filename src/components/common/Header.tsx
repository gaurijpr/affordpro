import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User, Menu, X, LogOut, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from './SearchBar';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products?type=PRODUCTS_ONLY' },
    { name: 'Courses', path: '/products?type=COURSE' },
    { name: 'Services', path: '/products?type=SERVICE' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      {/* Top Banner Announcement (Compact) */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-indigo-600 text-white text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded">
          SPECIAL OFFER
        </span>
        <span>Get Flat 50% OFF on all Bundles & Templates! Use code <strong className="text-amber-300">WELCOME50</strong></span>
      </div>

      {/* Main Sticky Header with Reduced Top & Bottom Margins */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-header shadow-md border-b border-slate-200/80 py-0.5'
            : 'bg-white border-b border-slate-100 py-1'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Official AffordPro Logo (Transparent PNG background) */}
          <Link to="/" className="flex items-center group shrink-0 py-0.5">
            <img
              src="/affordpro-logo.png"
              alt="AffordPro — Premium Digital Products. Affordable Prices."
              className="h-10 sm:h-13 md:h-15 lg:h-16 max-w-[200px] sm:max-w-[280px] md:max-w-[340px] w-auto object-contain transition-transform group-hover:scale-102 drop-shadow-xs"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path.includes('type=') && location.search.includes(link.path.split('?')[1]));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search bar input (Desktop inline) */}
          <div className="hidden md:block max-w-xs w-full">
            <SearchBar placeholder="Search templates, reels, courses..." />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Search Icon Trigger for Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                  {totalItemCount}
                </span>
              )}
            </Link>

            {/* Auth / Account Profile */}
            {isAuthenticated ? (
              <Link
                to="/account"
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-600 text-slate-800 text-xs font-bold transition-colors shrink-0"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="line-clamp-1 max-w-[90px]">{user?.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Primary CTA Button */}
            <Link
              to="/products"
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pt-2 pb-2 border-t border-slate-100 animate-fadeIn">
            <SearchBar placeholder="Search digital products..." />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[100px] bg-white border-b border-slate-200 shadow-2xl z-50 p-6 space-y-4 animate-slideDown">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="px-4 py-3 rounded-xl text-base font-bold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      {user?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{user?.name}</div>
                      <div className="text-xs text-slate-500">{user?.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    className="w-full text-center py-3 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}

              <Link
                to="/products"
                className="w-full text-center py-3 bg-slate-900 text-white font-bold text-sm rounded-xl shadow-md whitespace-nowrap"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
