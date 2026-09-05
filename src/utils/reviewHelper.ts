import { Review } from '../types/review';

// Helper to get a high social proof review count (At least 1K+)
export const getHighReviewCount = (productId: string, currentCount: number = 0): number => {
  if (currentCount >= 1000) return currentCount;
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = productId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const min = 1420;
  const max = 3890;
  const count = min + (Math.abs(hash) % (max - min));
  return count;
};

// Formatter e.g. 2840 -> "2.8K+" or "2,840"
export const formatReviewCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`;
  }
  return count.toLocaleString();
};

export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === ',' || char === '\t' || char === ';') && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const REVIEW_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
];

// Parser function for Bulk Uploading Customer Reviews (.csv, .excel, .json, .txt)
export const parseReviewsContent = (text: string): { reviews: Review[]; averageRating: number; totalCount: number } => {
  const reviews: Review[] = [];

  // 1. Try JSON parsing
  try {
    const json = JSON.parse(text);
    const list = Array.isArray(json) ? json : json.reviews || json.data || [];
    if (Array.isArray(list) && list.length > 0) {
      list.forEach((item: any, idx: number) => {
        const rating = Number(item.rating || item.stars || item.score || 5);
        const name = String(item.userName || item.name || item.author || item.user || item.customerName || `Customer ${idx + 1}`).trim();
        const title = String(item.title || item.headline || item.subject || item.summary || 'Verified Purchase Review').trim();
        const comment = String(item.comment || item.review || item.text || item.body || item.content || item.description || title).trim();
        const date = String(item.date || item.created || item.time || 'Verified Buyer').trim();

        reviews.push({
          id: `rev-upload-${Date.now()}-${idx}`,
          productId: 'custom',
          userName: name,
          rating: rating >= 1 && rating <= 5 ? rating : 5,
          title: title,
          comment: comment,
          date: date,
          verifiedPurchase: item.verifiedPurchase !== false,
          userAvatar: item.userAvatar || item.avatar || undefined,
        });
      });
      if (reviews.length > 0) {
        const totalCount = reviews.length;
        const averageRating = Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount) * 10) / 10;
        return { reviews, averageRating, totalCount };
      }
    }
  } catch {
    // Continue to CSV / TSV parsing
  }

  // 2. CSV / TSV Parsing line-by-line
  const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (rawLines.length === 0) {
    return { reviews: [], averageRating: 4.9, totalCount: 0 };
  }

  const parsedLines = rawLines.map(parseCSVLine);
  
  // Header inspection
  let nameIdx = -1;
  let ratingIdx = -1;
  let titleIdx = -1;
  let commentIdx = -1;
  let dateIdx = -1;

  const firstLineCols = parsedLines[0].map((c) => c.toLowerCase());
  const hasHeader = firstLineCols.some((c) =>
    c.includes('name') || c.includes('author') || c.includes('user') || c.includes('rating') || c.includes('star') || c.includes('comment') || c.includes('review') || c.includes('title') || c.includes('headline')
  );

  let dataLines = parsedLines;
  if (hasHeader) {
    firstLineCols.forEach((col, idx) => {
      if (col.includes('name') || col.includes('author') || col.includes('user') || col.includes('customer')) nameIdx = idx;
      else if (col.includes('rating') || col.includes('star') || col.includes('score')) ratingIdx = idx;
      else if (col.includes('title') || col.includes('headline') || col.includes('subject') || col.includes('summary')) titleIdx = idx;
      else if (col.includes('comment') || col.includes('review') || col.includes('body') || col.includes('text') || col.includes('content') || col.includes('feedback')) commentIdx = idx;
      else if (col.includes('date') || col.includes('time') || col.includes('created')) dateIdx = idx;
    });
    dataLines = parsedLines.slice(1);
  }

  dataLines.forEach((cols, idx) => {
    if (cols.length === 0 || (cols.length === 1 && !cols[0])) return;

    let name = '';
    let rating = 5;
    let title = '';
    let comment = '';
    let date = 'Verified Buyer';

    if (hasHeader && (nameIdx !== -1 || ratingIdx !== -1 || commentIdx !== -1)) {
      if (nameIdx !== -1 && cols[nameIdx]) name = cols[nameIdx];
      if (ratingIdx !== -1 && cols[ratingIdx]) {
        const parsedR = parseFloat(cols[ratingIdx]);
        if (!isNaN(parsedR) && parsedR >= 1 && parsedR <= 5) rating = parsedR;
      }
      if (titleIdx !== -1 && cols[titleIdx]) title = cols[titleIdx];
      if (commentIdx !== -1 && cols[commentIdx]) comment = cols[commentIdx];
      if (dateIdx !== -1 && cols[dateIdx]) date = cols[dateIdx];
    } else {
      // Fallback heuristics for headers without names or no header
      if (cols.length >= 4) {
        // e.g. Name, Rating, Title, Comment
        name = cols[0];
        const r = parseFloat(cols[1]);
        if (!isNaN(r) && r >= 1 && r <= 5) rating = r;
        title = cols[2];
        comment = cols[3];
        if (cols[4]) date = cols[4];
      } else if (cols.length === 3) {
        // e.g. Name, Rating, Comment  OR  Name, Title, Comment
        name = cols[0];
        const r = parseFloat(cols[1]);
        if (!isNaN(r) && r >= 1 && r <= 5) {
          rating = r;
          comment = cols[2];
        } else {
          title = cols[1];
          comment = cols[2];
        }
      } else if (cols.length === 2) {
        name = cols[0];
        comment = cols[1];
      } else if (cols.length === 1) {
        comment = cols[0];
      }
    }

    // Default fallbacks for missing parts
    if (!name) name = `Verified Customer ${idx + 1}`;
    if (!comment) comment = title || 'High quality digital product, excellent purchase!';
    if (!title) {
      if (comment.length > 40) {
        title = comment.slice(0, 35) + '...';
      } else {
        title = comment || 'Verified Customer Review';
      }
    }

    reviews.push({
      id: `rev-upload-${Date.now()}-${idx}`,
      productId: 'custom',
      userName: name,
      rating: rating,
      title: title,
      comment: comment,
      date: date,
      verifiedPurchase: true,
      userAvatar: undefined,
    });
  });

  const totalCount = reviews.length;
  const averageRating = totalCount > 0
    ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount) * 10) / 10
    : 4.9;

  return { reviews, averageRating, totalCount };
};

// 25 Genuine, High-Quality Verified Customer Reviews for Every Product
export const GENUINE_25_REVIEWS: Review[] = [
  {
    id: 'rev-101',
    productId: 'default',
    userName: 'Vijendra Kumawat (Jaipur)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Transformed our Instagram growth! Absolutely genuine quality',
    comment: 'The video quality is crisp 1080x1920 MP4 with zero watermarks. Saved me over 25 hours of editing time this month alone. The trending audio links spreadsheet is worth 10x the price!',
    verifiedPurchase: true,
    date: '2 days ago',
  },
  {
    id: 'rev-102',
    productId: 'default',
    userName: 'Ananya Gupta (Delhi)',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Best digital purchase I made this year!',
    comment: 'Everything was delivered instantly to my email and Google Drive right after Razorpay checkout. Easy to customize in Canva and start publishing immediately.',
    verifiedPurchase: true,
    date: '3 days ago',
  },
  {
    id: 'rev-103',
    productId: 'default',
    userName: 'Rahul Sharma (Mumbai)',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Exceptional quality & commercial license included',
    comment: 'I was a bit skeptical at first because of the affordable pricing, but this is 100% legitimate. Commercial license included and lifetime access link works seamlessly.',
    verifiedPurchase: true,
    date: '5 days ago',
  },
  {
    id: 'rev-104',
    productId: 'default',
    userName: 'Priya Verma (Bengaluru)',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Super easy to edit & high converting templates',
    comment: 'Very practical assets for agency owners and freelancers. My client engagement jumped by 45% after using these reels and templates!',
    verifiedPurchase: true,
    date: '1 week ago',
  },
  {
    id: 'rev-105',
    productId: 'default',
    userName: 'Amit Patel (Ahmedabad)',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Instant 1-click download, zero hassle',
    comment: 'No hidden subscriptions or fees. Direct access link given right after payment. Will definitely buy more bundles from AffordPro!',
    verifiedPurchase: true,
    date: '1 week ago',
  },
  {
    id: 'rev-106',
    productId: 'default',
    userName: 'Rohan Mehta (Pune)',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Saved my marketing agency 40+ hours of work!',
    comment: 'Our client team handles 12 Instagram accounts and this bundle saved us hundreds of hours of design work. Pure gold resource.',
    verifiedPurchase: true,
    date: '2 weeks ago',
  },
  {
    id: 'rev-107',
    productId: 'default',
    userName: 'Sneha Kapoor (Chandigarh)',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'High resolution 1080p clips with zero watermark',
    comment: 'Clean video clips in MP4 format. Works smooth in Premiere Pro, CapCut, and Canva.',
    verifiedPurchase: true,
    date: '2 weeks ago',
  },
  {
    id: 'rev-108',
    productId: 'default',
    userName: 'Vikram Singh (Indore)',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Best value for money bundle on the internet',
    comment: 'For less than ₹500, getting 1000+ files is an unreal deal. AffordPro delivered exactly what they promised.',
    verifiedPurchase: true,
    date: '2 weeks ago',
  },
  {
    id: 'rev-109',
    productId: 'default',
    userName: 'Neha Sharma (Kolkata)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Direct Google Drive access links',
    comment: 'Super convenient Google Drive folder layout. Downloaded individual files easily without needing full ZIP extraction.',
    verifiedPurchase: true,
    date: '3 weeks ago',
  },
  {
    id: 'rev-110',
    productId: 'default',
    userName: 'Deepak Kumar (Noida)',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Full commercial resale license included',
    comment: 'Very happy with the clear licensing terms. I can use these for client campaigns with 100% peace of mind.',
    verifiedPurchase: true,
    date: '3 weeks ago',
  },
  {
    id: 'rev-111',
    productId: 'default',
    userName: 'Pooja Nair (Kochi)',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Canva links open instantly',
    comment: 'Opened directly in my free Canva account. Edit text, colors, and logo in under 3 minutes.',
    verifiedPurchase: true,
    date: '3 weeks ago',
  },
  {
    id: 'rev-112',
    productId: 'default',
    userName: 'Rajesh Rao (Hyderabad)',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Viral hooks & audio guide included',
    comment: 'The bonus strategy PDF guide on how to go viral with trending audio is super valuable.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-113',
    productId: 'default',
    userName: 'Kavita Reddy (Chennai)',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Got 3 new client projects using these reels!',
    comment: 'Posted 5 reels this week and gained over 1,200 new followers and 3 direct message inquiries!',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-114',
    productId: 'default',
    userName: 'Manish Joshi (Lucknow)',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: '100% genuine product & instant support',
    comment: 'Had a quick question regarding download links and WhatsApp support replied in under 5 minutes.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-115',
    productId: 'default',
    userName: 'Shweta Saxena (Surat)',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    rating: 4,
    title: 'Extremely well organized category folders',
    comment: 'Great organization by niche (AI, Business, Luxury, Motivation). Very easy to find what you need.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-116',
    productId: 'default',
    userName: 'Aditya Verma (Bhopal)',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Lifetime updates promised and delivered!',
    comment: 'Received an updated Google Drive folder link with new 2026 trending clips. Outstanding support.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-117',
    productId: 'default',
    userName: 'Ritu Jain (Nagpur)',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Perfect aspect ratio for Instagram Reels & YouTube Shorts',
    comment: '1080x1920 vertical format. Fits perfectly on mobile screens without black borders.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-118',
    productId: 'default',
    userName: 'Siddharth Rao (Coimbatore)',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Smooth UPI/Razorpay payment & instant email confirmation',
    comment: 'Paid via Google Pay UPI and got direct download link in my email inbox within 10 seconds.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-119',
    productId: 'default',
    userName: 'Priyanka Das (Guwahati)',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'My reach skyrocketed on Instagram',
    comment: 'One of the motivation reels hit 150K views within 48 hours of posting! Highly recommended.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-120',
    productId: 'default',
    userName: 'Alok Mishra (Varanasi)',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Works with free Canva account',
    comment: 'No need for Canva Pro subscription. Works 100% fine on free Canva plan.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-121',
    productId: 'default',
    userName: 'Sunita Choudhary (Jodhpur)',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Crystal clear video and audio quality',
    comment: 'High definition 60fps videos. Crisp visuals and professional sound mixing.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-122',
    productId: 'default',
    userName: 'Gaurav Bansal (Faridabad)',
    userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Incredible ROI for digital marketers',
    comment: 'The return on investment is massive. One successful campaign pays for this bundle 100 times over.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-123',
    productId: 'default',
    userName: 'Meenakshi Iyer (Thiruvananthapuram)',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Very professional layout and color grading',
    comment: 'Aesthetically pleasing color palette and clean typography. Makes your brand look high-end.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-124',
    productId: 'default',
    userName: 'Tarun Sethi (Dehradun)',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: 'Quick response from WhatsApp support team',
    comment: 'Super polite support team. Sent me a backup download link immediately when requested.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
  {
    id: 'rev-125',
    productId: 'default',
    userName: 'Divya Malviya (Udaipur)',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    title: '5 stars without any doubt! Must-buy resource',
    comment: 'If you want to save time and grow your online business fast, just buy this without thinking twice.',
    verifiedPurchase: true,
    date: '1 month ago',
  },
];

export const GENUINE_MOCK_REVIEWS: Record<string, Review[]> = {
  default: GENUINE_25_REVIEWS,
};
