import { Review } from '../types/review';
import { MOCK_REVIEWS } from '../mock/data';
import { fetchApi } from './api';

export const reviewService = {
  getCustomReviews(idOrSlug: string): Review[] | null {
    if (!idOrSlug) return null;
    try {
      const stored = localStorage.getItem(`affordpro_custom_reviews_${idOrSlug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  },

  saveCustomReviews(id: string, slug: string | undefined, reviews: Review[]): void {
    if (!reviews || !reviews.length) return;
    const formatted = reviews.map((r, idx) => ({
      ...r,
      id: r.id || `rev-custom-${id}-${idx}`,
      productId: id,
    }));
    try {
      if (id) {
        localStorage.setItem(`affordpro_custom_reviews_${id}`, JSON.stringify(formatted));
      }
      if (slug) {
        localStorage.setItem(`affordpro_custom_reviews_${slug}`, JSON.stringify(formatted));
      }
    } catch (e) {
      console.warn('Failed to save custom reviews', e);
    }
  },

  async getProductReviews(productId: string, slug?: string): Promise<{ reviews: Review[]; isCustom: boolean }> {
    // 1. Check local custom reviews first
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
        return { reviews: apiRevs, isCustom: true };
      }
    } catch {
      // fallback
    }

    // 3. Fallback mock reviews
    const mock = MOCK_REVIEWS[productId] || (slug ? MOCK_REVIEWS[slug] : null) || [];
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
