import { Review } from '../types/review';
import { MOCK_REVIEWS } from '../mock/data';
import { fetchApi } from './api';
import { safeSetLocalStorage } from './productService';

const IN_MEMORY_CUSTOM_REVIEWS = new Map<string, Review[]>();

const DEFAULT_CREATOR_REVIEWS: Review[] = [
  {
    id: 'rev-def-1',
    productId: 'prod-1',
    userName: 'Priya Sharma',
    rating: 5,
    title: 'Gained 45k followers in 30 days!',
    comment: 'The 1000+ Viral Reels Bundle saved me hundreds of hours! Top notch video quality and 100% functional templates.',
    verifiedPurchase: true,
    date: '2026-03-15',
  },
  {
    id: 'rev-def-2',
    productId: 'prod-2',
    userName: 'Rohan Verma',
    rating: 5,
    title: 'My secret vault for high-converting templates',
    comment: 'AffordPro is my go-to store for Canva templates and marketing courses. Instant drive access right after payment!',
    verifiedPurchase: true,
    date: '2026-03-18',
  },
  {
    id: 'rev-def-3',
    productId: 'prod-3',
    userName: 'Ananya Patel',
    rating: 5,
    title: 'Instant clarity & 100% working assets',
    comment: 'Super easy to download and customize. The Meta ads course and prompt pack gave my business immediate sales momentum.',
    verifiedPurchase: true,
    date: '2026-03-22',
  },
  {
    id: 'rev-def-4',
    productId: 'prod-4',
    userName: 'Vikram Mehta',
    rating: 5,
    title: 'Outstanding quality and lifetime access',
    comment: 'The Canva bundle templates are super clean and easy to edit. Saved me so much time on client work!',
    verifiedPurchase: true,
    date: '2026-03-25',
  },
  {
    id: 'rev-def-5',
    productId: 'prod-5',
    userName: 'Sneha Roy',
    rating: 5,
    title: 'Unbelievable value for creators',
    comment: 'High engagement reel templates that boost reach naturally. My clients love the content generated from these bundles.',
    verifiedPurchase: true,
    date: '2026-03-28',
  },
  {
    id: 'rev-def-6',
    productId: 'prod-6',
    userName: 'Karan Malhotra',
    rating: 5,
    title: 'ROAS increased dramatically',
    comment: 'The ad templates and AI prompts are tailored for high conversion rates. Best digital investment this year.',
    verifiedPurchase: true,
    date: '2026-03-30',
  },
  {
    id: 'rev-def-7',
    productId: 'prod-7',
    userName: 'Neha Gupta',
    rating: 5,
    title: 'Fast instant download & zero hassle',
    comment: 'Got my download link right on screen and in my email. Templates work on free Canva accounts perfectly!',
    verifiedPurchase: true,
    date: '2026-04-01',
  },
  {
    id: 'rev-def-8',
    productId: 'prod-8',
    userName: 'Rahul Deshmukh',
    rating: 5,
    title: 'Crisp 4K video clips & reels',
    comment: 'Ready-made cartoon food & viral reel bundles are top quality. No watermarks, easy to use right away.',
    verifiedPurchase: true,
    date: '2026-04-02',
  },
  {
    id: 'rev-def-9',
    productId: 'prod-9',
    userName: 'Pooja Nair',
    rating: 5,
    title: 'Extremely helpful 24/7 support',
    comment: 'Had a quick question about unzipping files and support answered in 5 minutes. 100% recommended!',
    verifiedPurchase: true,
    date: '2026-04-03',
  },
  {
    id: 'rev-def-10',
    productId: 'prod-10',
    userName: 'Amitav Sengupta',
    rating: 5,
    title: 'Complete digital ecosystem in one place',
    comment: 'From e-books to Canva kits, AffordPro delivers genuine value. Will definitely purchase again!',
    verifiedPurchase: true,
    date: '2026-04-04',
  },
];

export const reviewService = {
  getCustomReviews(idOrSlug: string): Review[] | null {
    if (!idOrSlug) return null;

    if (IN_MEMORY_CUSTOM_REVIEWS.has(idOrSlug)) {
      return IN_MEMORY_CUSTOM_REVIEWS.get(idOrSlug)!;
    }

    const norm = idOrSlug.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (norm) {
      for (const [key, list] of IN_MEMORY_CUSTOM_REVIEWS.entries()) {
        const normKey = key.toLowerCase().replace(/[^a-z0-9]+/g, '');
        if (normKey === norm || (norm.length > 5 && normKey.includes(norm)) || (normKey.length > 5 && norm.includes(normKey))) {
          return list;
        }
      }
    }

    try {
      const stored = localStorage.getItem(`affordpro_custom_reviews_${idOrSlug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.map((r: Review) => ({ ...r, userAvatar: undefined }));
          IN_MEMORY_CUSTOM_REVIEWS.set(idOrSlug, cleaned);
          return cleaned;
        }
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('affordpro_custom_reviews_')) {
          const keyParam = key.replace('affordpro_custom_reviews_', '');
          const normKeyParam = keyParam.toLowerCase().replace(/[^a-z0-9]+/g, '');
          if (norm && normKeyParam && (normKeyParam === norm || norm.includes(normKeyParam) || normKeyParam.includes(norm))) {
            const item = localStorage.getItem(key);
            if (item) {
              const parsed = JSON.parse(item);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const cleaned = parsed.map((r: Review) => ({ ...r, userAvatar: undefined }));
                IN_MEMORY_CUSTOM_REVIEWS.set(idOrSlug, cleaned);
                return cleaned;
              }
            }
          }
        }
      }
    } catch {
      // ignore
    }
    return null;
  },

  saveCustomReviews(id: string, slug: string | undefined, reviews: Review[]): void {
    if (!reviews || !reviews.length) return;
    const formatted: Review[] = reviews.map((r, idx) => ({
      id: r.id || `rev-custom-${id}-${idx}`,
      productId: id,
      userName: r.userName || `Verified Customer ${idx + 1}`,
      rating: Number(r.rating) || 5,
      title: r.title || 'Verified Purchase Review',
      comment: r.comment || r.title || 'High quality digital product!',
      date: r.date || 'Verified Buyer',
      verifiedPurchase: r.verifiedPurchase !== false,
      userAvatar: undefined, // No image in reviews as requested by user
    }));

    if (id) IN_MEMORY_CUSTOM_REVIEWS.set(id, formatted);
    if (slug) IN_MEMORY_CUSTOM_REVIEWS.set(slug, formatted);

    const normId = id.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (normId) IN_MEMORY_CUSTOM_REVIEWS.set(normId, formatted);
    if (slug) {
      const normSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (normSlug) IN_MEMORY_CUSTOM_REVIEWS.set(normSlug, formatted);
    }

    try {
      const jsonStr = JSON.stringify(formatted);
      if (id) safeSetLocalStorage(`affordpro_custom_reviews_${id}`, jsonStr);
      if (slug && slug !== id) safeSetLocalStorage(`affordpro_custom_reviews_${slug}`, jsonStr);
    } catch (e) {
      console.warn('Failed to save custom reviews to localStorage', e);
    }
  },

  // Get 10 reviews for homepage "What Our Creators Say" section
  async getFeaturedReviews(limit = 10): Promise<(Review & { role?: string })[]> {
    try {
      const apiRevs = await fetchApi<Review[]>(`/reviews/featured?limit=${limit}`);
      if (apiRevs && Array.isArray(apiRevs)) {
        const cleaned: (Review & { role?: string })[] = apiRevs.map((r) => ({
          ...r,
          userAvatar: undefined, // ensure no images
          role: (r as any).role || 'Verified Creator',
        }));

        return cleaned.slice(0, limit);
      }
    } catch {
      // fallback
    }

    const allLocal = await this.getAllReviews();
    const cleanedLocal: (Review & { role?: string })[] = allLocal.map((r) => ({ ...r, userAvatar: undefined }));
    
    let combined = [...cleanedLocal];
    if (combined.length < limit) {
      const needed = limit - combined.length;
      combined = [...combined, ...DEFAULT_CREATOR_REVIEWS.slice(0, needed)];
    }

    return combined.slice(0, limit);
  },

  async getProductReviews(productId: string, slug?: string): Promise<{ reviews: Review[]; isCustom: boolean }> {
    const customById = this.getCustomReviews(productId);
    if (customById && customById.length > 0) {
      return { reviews: customById, isCustom: true };
    }
    if (slug) {
      const customBySlug = this.getCustomReviews(slug);
      if (customBySlug && customBySlug.length > 0) {
        return { reviews: customBySlug, isCustom: true };
      }
    }

    try {
      const apiRevs = await fetchApi<Review[]>(`/products/${productId}/reviews`);
      if (apiRevs && Array.isArray(apiRevs)) {
        const cleanedApi = apiRevs.map((r) => ({ ...r, userAvatar: undefined }));
        return { reviews: cleanedApi, isCustom: true };
      }
    } catch {
      // fallback
    }

    const rawMock = MOCK_REVIEWS[productId] || (slug ? MOCK_REVIEWS[slug] : null) || [];
    const mock = rawMock.map((r) => ({ ...r, userAvatar: undefined }));
    return { reviews: mock, isCustom: false };
  },

  async addReview(productId: string, review: { rating: number; title: string; comment: string; userName: string }): Promise<Review> {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: review.userName || 'Verified Buyer',
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      userAvatar: undefined,
    };

    const existingCustom = this.getCustomReviews(productId) || [];
    const updatedCustom = [newRev, ...existingCustom];
    this.saveCustomReviews(productId, undefined, updatedCustom);

    try {
      await fetchApi<Review>(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review),
      });
    } catch {
      // ignore
    }

    return newRev;
  },

  async updateReview(reviewId: string, updateData: Partial<Review>): Promise<boolean> {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('affordpro_custom_reviews_')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed: Review[] = JSON.parse(item);
            if (Array.isArray(parsed)) {
              let updated = false;
              const newList = parsed.map((r) => {
                if (r.id === reviewId) {
                  updated = true;
                  return { ...r, ...updateData, userAvatar: undefined };
                }
                return r;
              });

              if (updated) {
                localStorage.setItem(key, JSON.stringify(newList));
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }

    try {
      await fetchApi(`/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...updateData, userAvatar: undefined }),
      });
    } catch {
      // ignore
    }

    return true;
  },

  async getAllReviews(): Promise<(Review & { productTitle?: string })[]> {
    const all: (Review & { productTitle?: string })[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('affordpro_custom_reviews_')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed: Review[] = JSON.parse(item);
            if (Array.isArray(parsed)) {
              parsed.forEach((r) => {
                if (!seenIds.has(r.id)) {
                  seenIds.add(r.id);
                  all.push({ ...r, userAvatar: undefined });
                }
              });
            }
          }
        } catch {
          // ignore
        }
      }
    }

    try {
      const apiRevs = await fetchApi<Review[]>('/reviews/featured?limit=50');
      if (apiRevs && Array.isArray(apiRevs)) {
        apiRevs.forEach((r) => {
          if (!seenIds.has(r.id)) {
            seenIds.add(r.id);
            all.push({ ...r, userAvatar: undefined });
          }
        });
      }
    } catch {
      // ignore
    }

    Object.keys(MOCK_REVIEWS).forEach((prodId) => {
      MOCK_REVIEWS[prodId].forEach((r) => {
        if (!seenIds.has(r.id)) {
          seenIds.add(r.id);
          all.push({ ...r, userAvatar: undefined });
        }
      });
    });

    return all;
  },

  async deleteReview(reviewId: string, productId?: string): Promise<boolean> {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('affordpro_custom_reviews_')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed: Review[] = JSON.parse(item);
            if (Array.isArray(parsed)) {
              const filtered = parsed.filter((r) => r.id !== reviewId);
              if (filtered.length < parsed.length) {
                if (filtered.length > 0) {
                  localStorage.setItem(key, JSON.stringify(filtered));
                } else {
                  localStorage.removeItem(key);
                }
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }

    if (productId && MOCK_REVIEWS[productId]) {
      MOCK_REVIEWS[productId] = MOCK_REVIEWS[productId].filter((r) => r.id !== reviewId);
    } else {
      Object.keys(MOCK_REVIEWS).forEach((k) => {
        MOCK_REVIEWS[k] = MOCK_REVIEWS[k].filter((r) => r.id !== reviewId);
      });
    }

    try {
      await fetchApi(`/reviews/${reviewId}`, { method: 'DELETE' });
    } catch {
      // ignore
    }

    return true;
  }
};
