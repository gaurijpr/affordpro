import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

interface PurchaseEvent {
  id: string;
  name: string;
  location: string;
  productTitle: string;
  productSlug: string;
  image: string;
  timeAgo: string;
}

const SAMPLE_PURCHASES: Omit<PurchaseEvent, 'id'>[] = [
  {
    name: 'Vijendra Kumawat',
    location: 'Jaipur',
    productTitle: '1000+ Viral Reels Bundle (Without Watermark)',
    productSlug: '1000-viral-reels-bundle',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=150&q=80',
    timeAgo: 'just now',
  },
  {
    name: 'Priya Verma',
    location: 'Mumbai',
    productTitle: '500+ Premium Canva Social Media Templates',
    productSlug: '500-canva-social-media-templates',
    image: 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=150&q=80',
    timeAgo: '1 min ago',
  },
  {
    name: 'Rahul Sharma',
    location: 'Delhi',
    productTitle: '5000+ AI Prompts Master Pack',
    productSlug: 'ai-prompt-engineer-master-bundle',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=150&q=80',
    timeAgo: 'just now',
  },
  {
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    productTitle: '1000+ Viral Reels Bundle',
    productSlug: '1000-viral-reels-bundle',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=150&q=80',
    timeAgo: '2 mins ago',
  },
  {
    name: 'Amit Patel',
    location: 'Ahmedabad',
    productTitle: 'Facebook & Instagram Ads Masterclass 2026',
    productSlug: 'facebook-instagram-ads-masterclass',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80',
    timeAgo: '3 mins ago',
  },
  {
    name: 'Ananya Gupta',
    location: 'Bangalore',
    productTitle: 'Custom Canva Graphic Design Service',
    productSlug: 'custom-canva-graphic-design-service',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80',
    timeAgo: 'just now',
  },
];

export const LivePurchaseToast: React.FC = () => {
  const [currentPurchase, setCurrentPurchase] = useState<PurchaseEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show initial toast after 2.5 seconds
    const initialTimer = setTimeout(() => {
      triggerNewToast();
    }, 2500);

    // Trigger toast loop every 9 seconds
    const interval = setInterval(() => {
      triggerNewToast();
    }, 9000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  const triggerNewToast = () => {
    const randomIdx = Math.floor(Math.random() * SAMPLE_PURCHASES.length);
    const sample = SAMPLE_PURCHASES[randomIdx];

    setCurrentPurchase({
      ...sample,
      id: `${Date.now()}-${randomIdx}`,
    });
    setVisible(true);

    // Hide toast after 4.5 seconds
    setTimeout(() => {
      setVisible(false);
    }, 4500);
  };

  if (!currentPurchase || !visible || dismissed) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 animate-bounce-short transition-all transform ease-out duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-800 rounded-2xl p-3.5 shadow-2xl max-w-sm flex items-start gap-3.5 relative group">
        {/* Dismiss Button */}
        <button
          onClick={() => {
            setVisible(false);
            setDismissed(true);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full flex items-center justify-center border border-slate-700 transition-colors shadow-md"
          title="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Product Image Thumbnail */}
        <Link to={`/product/${currentPurchase.productSlug}`} className="shrink-0 relative">
          <img
            src={currentPurchase.image}
            alt={currentPurchase.productTitle}
            className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Purchase Info */}
        <div className="space-y-0.5 text-xs pr-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <span>{currentPurchase.name}</span>
            <span className="text-[10px] text-slate-400 font-medium">({currentPurchase.location})</span>
          </div>

          <p className="text-slate-300 text-[11px] font-semibold line-clamp-1">
            purchased <span className="text-indigo-400 font-extrabold">{currentPurchase.productTitle}</span>
          </p>

          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-400 pt-0.5">
            <ShoppingBag className="w-3 h-3" />
            <span>Verified Purchase • {currentPurchase.timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
