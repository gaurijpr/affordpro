import { fetchApi } from './api';
import { safeSetLocalStorage } from './productService';

export interface TestimonialItem {
  id: string;
  userName: string;
  role?: string;
  avatar?: string; // Photo URL or base64 image
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase?: boolean;
  active?: boolean;
  displayOrder?: number;
}

const DEFAULT_CREATOR_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'creator-def-1',
    userName: 'Priya Sharma',
    role: 'Content Creator & SMM',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Gained 45k followers in 30 days!',
    comment: 'The 1000+ Viral Reels Bundle saved me hundreds of hours! Top notch video quality and 100% functional templates.',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-2',
    userName: 'Rohan Verma',
    role: 'Digital Agency Owner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'My secret vault for high-converting templates',
    comment: 'AffordPro is my go-to store for Canva templates and marketing courses. Instant drive access right after payment!',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-3',
    userName: 'Ananya Patel',
    role: 'E-commerce Brand Founder',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Instant clarity & 100% working assets',
    comment: 'Super easy to download and customize. The Meta ads course and prompt pack gave my business immediate sales momentum.',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-4',
    userName: 'Vikram Mehta',
    role: 'Freelance Graphic Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Outstanding quality and lifetime access',
    comment: 'The Canva bundle templates are super clean and easy to edit. Saved me so much time on client work!',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-5',
    userName: 'Sneha Roy',
    role: 'Instagram Growth Coach',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Unbelievable value for creators',
    comment: 'High engagement reel templates that boost reach naturally. My clients love the content generated from these bundles.',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-6',
    userName: 'Karan Malhotra',
    role: 'Performance Marketer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'ROAS increased dramatically',
    comment: 'The ad templates and AI prompts are tailored for high conversion rates. Best digital investment this year.',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-7',
    userName: 'Neha Gupta',
    role: 'Small Business Owner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Fast instant download & zero hassle',
    comment: 'Got my download link right on screen and in my email. Templates work on free Canva accounts perfectly!',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-8',
    userName: 'Rahul Deshmukh',
    role: 'Video Editor & Producer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Crisp 4K video clips & reels',
    comment: 'Ready-made cartoon food & viral reel bundles are top quality. No watermarks, easy to use right away.',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-9',
    userName: 'Pooja Nair',
    role: 'Social Media Manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Extremely helpful 24/7 support',
    comment: 'Had a quick question about unzipping files and support answered in 5 minutes. 100% recommended!',
    verifiedPurchase: true,
  },
  {
    id: 'creator-def-10',
    userName: 'Amitav Sengupta',
    role: 'Course Creator & Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    title: 'Complete digital ecosystem in one place',
    comment: 'From e-books to Canva kits, AffordPro delivers genuine value. Will definitely purchase again!',
    verifiedPurchase: true,
  },
];

const LOCAL_STORAGE_KEY = 'affordpro_creator_testimonials';

export const testimonialService = {
  getLocalTestimonials(): TestimonialItem[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_CREATOR_TESTIMONIALS;
  },

  saveLocalTestimonials(items: TestimonialItem[]): void {
    try {
      safeSetLocalStorage(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save creator testimonials to localStorage', e);
    }
  },

  async getTestimonials(limit = 10): Promise<TestimonialItem[]> {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, limit);
        }
      } catch {
        // ignore
      }
    }

    try {
      const res = await fetchApi<{ success?: boolean; testimonials?: TestimonialItem[] }>(`/testimonials?limit=${limit}`);
      if (res && res.testimonials && Array.isArray(res.testimonials)) {
        return res.testimonials.slice(0, limit);
      }
    } catch {
      // fallback
    }

    const local = this.getLocalTestimonials();
    return local.slice(0, limit);
  },

  async createTestimonial(data: Omit<TestimonialItem, 'id'>): Promise<TestimonialItem> {
    const newId = `creator-${Date.now()}`;
    const newItem: TestimonialItem = {
      id: newId,
      ...data,
    };

    const local = this.getLocalTestimonials();
    const updated = [newItem, ...local];
    this.saveLocalTestimonials(updated);

    try {
      const res = await fetchApi<{ success?: boolean; testimonial?: TestimonialItem }>('/testimonials', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res && res.testimonial) {
        return res.testimonial;
      }
    } catch {
      // ignore
    }

    return newItem;
  },

  async updateTestimonial(id: string, data: Partial<TestimonialItem>): Promise<boolean> {
    const local = this.getLocalTestimonials();
    const updated = local.map((item) => (item.id === id ? { ...item, ...data } : item));
    this.saveLocalTestimonials(updated);

    try {
      await fetchApi(`/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      // ignore
    }

    return true;
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const local = this.getLocalTestimonials();
    const updated = local.filter((item) => item.id !== id);
    this.saveLocalTestimonials(updated);

    try {
      await fetchApi(`/testimonials/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // ignore
    }

    return true;
  },

  async deleteAllTestimonials(): Promise<boolean> {
    this.saveLocalTestimonials([]);

    try {
      await fetchApi('/testimonials', {
        method: 'DELETE',
      });
    } catch {
      // ignore
    }

    return true;
  }
};
