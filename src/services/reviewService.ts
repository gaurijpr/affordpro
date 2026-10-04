import { Review } from '../types/review';
import { MOCK_REVIEWS } from '../mock/data';
import { fetchApi } from './api';
import { safeSetLocalStorage } from './productService';

const IN_MEMORY_CUSTOM_REVIEWS = new Map<string, Review[]>();

export const reviewService = {
  getCustomReviews(idOrSlug: string): Review[] | null {
    if (!idOrSlug) return null;

    // 1. Direct in-memory lookup
    if (IN_MEMORY_CUSTOM_REVIEWS.has(idOrSlug)) {
      return IN_MEMORY_CUSTOM_REVIEWS.get(idOrSlug)!;
    }

    // Normalized search in in-memory map
    const norm = idOrSlug.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (norm) {
      for (const [key, list] of IN_MEMORY_CUSTOM_REVIEWS.entries()) {
        const normKey = key.toLowerCase().replace(/[^a-z0-9]+/g, '');
        if (normKey === norm || (norm.length > 5 && normKey.includes(norm)) || (normKey.length > 5 && norm.includes(normKey))) {
          return list;
        }
      }
    }

    // 2. LocalStorage lookup
    try {
      const stored = localStorage.getItem(`affordpro_custom_reviews_${idOrSlug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.map((r) => ({ ...r, userAvatar: undefined }));
          IN_MEMORY_CUSTOM_REVIEWS.set(idOrSlug, cleaned);
          return cleaned;
        }
      }

      // Fuzzy scan in localStorage keys
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
                const cleaned = parsed.map((r) => ({ ...r, userAvatar: undefined }));
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
    // Omit userAvatar as requested by user ("I didn't want any image in reviews")
    const formatted = reviews.map((r, idx) => ({
      id: r.id || `rev-custom-${id}-${idx}`,
      productId: id,
      userName: r.userName || `Verified Customer ${idx + 1}`,
      rating: Number(r.rating) || 5,
      title: r.title || 'Verified Purchase Review',
      comment: r.comment || r.title || 'High quality digital product!',
      date: r.date || 'Verified Buyer',
      verifiedPurchase: r.verifiedPurchase !== false,
      userAvatar: undefined,
    }));

    // Cache in memory for instant retrieval
    if (id) IN_MEMORY_CUSTOM_REVIEWS.set(id, formatted);
    if (slug) IN_MEMORY_CUSTOM_REVIEWS.set(slug, formatted);

    const normId = id.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (normId) IN_MEMORY_CUSTOM_REVIEWS.set(normId, formatted);
    if (slug) {
      const normSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (normSlug) IN_MEMORY_CUSTOM_REVIEWS.set(normSlug, formatted);
    }

    // Save to localStorage safely
    try {
      const jsonStr = JSON.stringify(formatted);
      if (id) safeSetLocalStorage(`affordpro_custom_reviews_${id}`, jsonStr);
      if (slug && slug !== id) safeSetLocalStorage(`affordpro_custom_reviews_${slug}`, jsonStr);
    } catch (e) {
      console.warn('Failed to save custom reviews to localStorage', e);
    }
  },

  async getProductReviews(productId: string, slug?: string): Promise<{ reviews: Review[]; isCustom: boolean }> {
    // 1. Check local / memory custom reviews first
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

    // 2. Fetch from API
    try {
      const apiRevs = await fetchApi<Review[]>(`/products/${productId}/reviews`);
      if (apiRevs && apiRevs.length > 0) {
        const cleanedApi = apiRevs.map((r) => ({ ...r, userAvatar: undefined }));
        return { reviews: cleanedApi, isCustom: true };
      }
    } catch {
      // fallback
    }

    // 3. Fallback mock reviews (with userAvatar removed)
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
    };

    // Add to custom reviews list if present
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

  async getAllReviews(): Promise<(Review & { productTitle?: string })[]> {
    const all: (Review & { productTitle?: string })[] = [];
    const seenIds = new Set<string>();

    // 1. Scan localStorage for custom / uploaded / user-submitted reviews
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
                  all.push(r);
                }
              });
            }
          }
        } catch {
          // ignore
        }
      }
    }

    // 2. Collect from MOCK_REVIEWS
    Object.keys(MOCK_REVIEWS).forEach((prodId) => {
      MOCK_REVIEWS[prodId].forEach((r) => {
        if (!seenIds.has(r.id)) {
          seenIds.add(r.id);
          all.push(r);
        }
      });
    });

    return all;
  },

  async deleteReview(reviewId: string, productId?: string): Promise<boolean> {
    // 1. Update localStorage custom reviews
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

    // 2. Remove from MOCK_REVIEWS
    if (productId && MOCK_REVIEWS[productId]) {
      MOCK_REVIEWS[productId] = MOCK_REVIEWS[productId].filter((r) => r.id !== reviewId);
    } else {
      Object.keys(MOCK_REVIEWS).forEach((k) => {
        MOCK_REVIEWS[k] = MOCK_REVIEWS[k].filter((r) => r.id !== reviewId);
      });
    }

    // 3. Optional backend API call
    try {
      await fetchApi(`/admin/reviews/${reviewId}`, { method: 'DELETE' });
    } catch {
      // ignore
    }

    return true;
  }
};
