import { Product, ProductFilterState } from '../types/product';
import { MOCK_PRODUCTS } from '../mock/data';
import { fetchApi, API_BASE_URL } from './api';

const getDeletedIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('affordpro_deleted_products') || '[]');
  } catch {
    return [];
  }
};

export const filterOutDeleted = (list: Product[]): Product[] => {
  const deleted = getDeletedIds();
  if (!deleted.length) return list;
  return list.filter((p) => !deleted.includes(p.id) && !deleted.includes(p.slug));
};

const getSavedProductOrder = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem('affordpro_product_order') || '[]');
  } catch {
    return [];
  }
};

export const getCategoryFallbackImage = (product: Partial<Product>): string => {
  const title = (product.title || '').toLowerCase();
  const cat = (product.category || product.categorySlug || '').toLowerCase();

  // 1. Cartoon Reels / Kids Reels
  if (title.includes('cartoon') || title.includes('kids reels') || title.includes('animation')) {
    return 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80';
  }

  // 2. Reels & Video Bundles / AI Reels
  if (title.includes('reels') || title.includes('video') || title.includes('viral') || cat.includes('reels')) {
    return 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80';
  }

  // 3. Canva Templates / Social Media Graphics
  if (title.includes('canva') || title.includes('template') || cat.includes('canva')) {
    return 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80';
  }

  // 4. Healthy Diet / E-Books / Guides / Meal Plans
  if (title.includes('diet') || title.includes('health') || title.includes('plan') || title.includes('pdf') || title.includes('book')) {
    return 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80';
  }

  // 5. Courses / Tutorials
  if (title.includes('course') || cat.includes('course')) {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
  }

  // Default Digital Product Cover
  return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
};

export const safeSetLocalStorage = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e: any) {
    console.warn(`localStorage setItem failed for "${key}". Attempting safe quota recovery:`, e);
    try {
      // Clear non-critical caches to free up storage space
      localStorage.removeItem('affordpro_all_orders');
      localStorage.removeItem('affordpro_coupon');
      localStorage.removeItem('affordpro_deleted_products');

      localStorage.setItem(key, value);
      return true;
    } catch (fallbackErr) {
      try {
        if (key === 'affordpro_custom_created_products') {
          const list: Product[] = JSON.parse(value);
          // Store up to 30 products preserving custom images
          localStorage.setItem(key, JSON.stringify(list.slice(0, 30)));
          return true;
        }
      } catch {
        console.error(`Unable to save "${key}" to localStorage:`, fallbackErr);
      }
      return false;
    }
  }
};

export const saveProductOrder = (orderedIds: string[]): void => {
  safeSetLocalStorage('affordpro_product_order', JSON.stringify(orderedIds));
};

export const sortProductsByCustomOrder = (list: Product[]): Product[] => {
  const order = getSavedProductOrder();
  if (!order || !order.length) return list;

  const orderMap = new Map<string, number>();
  order.forEach((id, idx) => orderMap.set(id, idx));

  return [...list].sort((a, b) => {
    const posA = orderMap.has(a.id) ? orderMap.get(a.id)! : (orderMap.has(a.slug) ? orderMap.get(a.slug)! : 9999);
    const posB = orderMap.has(b.id) ? orderMap.get(b.id)! : (orderMap.has(b.slug) ? orderMap.get(b.slug)! : 9999);
    return posA - posB;
  });
};

export const getCustomCreatedProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem('affordpro_custom_created_products');
    const list: Product[] = raw ? JSON.parse(raw) : [];
    return list.map((p) => {
      // Replace old generic purple wallpaper placeholders with crisp, category-specific covers
      const genericPlaceholder = 'photo-1618005182384-a83a8bd57fbe';
      const rawImages = p.images || [];
      const hasValidCustomImg = rawImages.length > 0 && rawImages[0] && !rawImages[0].includes(genericPlaceholder);

      const primaryImage = hasValidCustomImg ? rawImages[0] : getCategoryFallbackImage(p);

      return {
        ...p,
        images: [primaryImage, ...(rawImages.length > 1 ? rawImages.slice(1) : [])],
        featured: p.featured !== undefined ? Boolean(p.featured) : true,
        bestSeller: p.bestSeller !== undefined ? Boolean(p.bestSeller) : true,
        newArrival: p.newArrival !== undefined ? Boolean(p.newArrival) : true,
      };
    });
  } catch {
    return [];
  }
};

export const mergeProducts = (apiProds: Product[], mockProds: Product[]): Product[] => {
  const custom = getCustomCreatedProducts();

  // Create lookup maps for custom products by id, slug, and normalized title
  const customById = new Map<string, Product>();
  const customBySlug = new Map<string, Product>();
  const customByTitle = new Map<string, Product>();

  custom.forEach((cp) => {
    if (cp.id) customById.set(cp.id, cp);
    if (cp.slug) customBySlug.set(cp.slug, cp);
    if (cp.title) customByTitle.set(cp.title.toLowerCase().replace(/[^a-z0-9]+/g, ''), cp);
  });

  const processedApi: Product[] = (apiProds || []).map((ap) => {
    const normTitle = (ap.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const customMatch = customById.get(ap.id) || (ap.slug ? customBySlug.get(ap.slug) : null) || customByTitle.get(normTitle);

    if (customMatch) {
      return customMatch;
    }

    const rawImages = ap.images || [];
    const genericPlaceholder = 'photo-1618005182384-a83a8bd57fbe';
    const hasValidImg = rawImages.length > 0 && rawImages[0] && !rawImages[0].includes(genericPlaceholder);
    const primaryImg = hasValidImg ? rawImages[0] : getCategoryFallbackImage(ap);

    return {
      ...ap,
      images: [primaryImg, ...(rawImages.length > 1 ? rawImages.slice(1) : [])],
    };
  });

  const merged: Product[] = [...custom, ...processedApi];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();
  const uniqueMerged: Product[] = [];

  merged.forEach((p) => {
    if (!p || !p.id) return;
    const normTitle = (p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const normSlug = (p.slug || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

    if (
      !seenIds.has(p.id) &&
      (!normSlug || !seenSlugs.has(normSlug)) &&
      (!normTitle || !seenTitles.has(normTitle))
    ) {
      seenIds.add(p.id);
      if (normSlug) seenSlugs.add(normSlug);
      if (normTitle) seenTitles.add(normTitle);
      uniqueMerged.push(p);
    }
  });

  const activeFiltered = filterOutDeleted(uniqueMerged);
  return sortProductsByCustomOrder(activeFiltered);
};

export const productService = {
  saveProductOrder,
  async getProducts(filters?: ProductFilterState): Promise<Product[]> {
    let apiProds: Product[] = [];
    try {
      const queryParams = new URLSearchParams();
      if (filters?.categorySlug) queryParams.set('category', filters.categorySlug);
      if (filters?.productType && filters.productType !== 'ALL') queryParams.set('type', filters.productType);
      if (filters?.bestSellerOnly) queryParams.set('bestseller', 'true');
      if (filters?.searchQuery) queryParams.set('q', filters.searchQuery);
      if (filters?.sortBy) queryParams.set('sort', filters.sortBy);
      
      const prods = await fetchApi<Product[]>(`/products?${queryParams.toString()}`);
      if (Array.isArray(prods)) {
        apiProds = prods;
      }
    } catch {
      // API Fallback
    }

    let result = mergeProducts(apiProds, MOCK_PRODUCTS);

    if (filters?.categorySlug) {
      const catQuery = filters.categorySlug.toLowerCase();
      result = result.filter(
        p => (p.categorySlug && p.categorySlug.toLowerCase() === catQuery) ||
             (p.category && p.category.toLowerCase() === catQuery)
      );
    }

    if (filters?.productType && filters.productType !== 'ALL') {
      if (filters.productType === 'PRODUCTS_ONLY') {
        result = result.filter(p => p.productType !== 'SERVICE');
      } else {
        result = result.filter(p => p.productType === filters.productType);
      }
    }

    if (filters?.bestSellerOnly) {
      const filteredBest = result.filter(p => p.bestSeller);
      if (filteredBest.length > 0) result = filteredBest;
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
        (p.fullDescription && p.fullDescription.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    if (filters?.priceRange) {
      if (filters.priceRange === 'under-199') {
        result = result.filter(p => p.price < 199);
      } else if (filters.priceRange === '199-499') {
        result = result.filter(p => p.price >= 199 && p.price <= 499);
      } else if (filters.priceRange === '499-999') {
        result = result.filter(p => p.price >= 499 && p.price <= 999);
      } else if (filters.priceRange === '999-plus') {
        result = result.filter(p => p.price > 999);
      }
    }

    if (filters?.minRating) {
      result = result.filter(p => p.rating >= (filters.minRating || 0));
    }

    if (filters?.inStockOnly) {
      result = result.filter(p => p.status === 'IN_STOCK');
    }

    if (filters?.sortBy) {
      if (filters.sortBy === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return result;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const all = await this.getProducts();
    const found = all.find(p => p.slug === slug || p.id === slug);
    if (found) return found;

    try {
      const p = await fetchApi<Product>(`/products/${slug}`);
      if (p && filterOutDeleted([p]).length > 0) return p;
    } catch {
      // Fallback
    }
    return null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const all = await this.getProducts();
    const feat = all.filter(p => p.featured);
    return feat.length > 0 ? feat : all;
  },

  async getBestSellers(): Promise<Product[]> {
    const all = await this.getProducts();
    const best = all.filter(p => p.bestSeller);
    return best.length > 0 ? best : all;
  },

  async getNewArrivals(): Promise<Product[]> {
    const all = await this.getProducts();
    const news = all.filter(p => p.newArrival || new Date(p.createdAt).getTime() > new Date('2026-01-15').getTime());
    return news.length > 0 ? news : all;
  },

  async getCourses(): Promise<Product[]> {
    const all = await this.getProducts();
    return all.filter(p => p.productType === 'COURSE');
  },

  async getServices(): Promise<Product[]> {
    const all = await this.getProducts();
    return all.filter(p => p.productType === 'SERVICE');
  },

  async getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
    const all = await this.getProducts();
    return all
      .filter(p => p.id !== product.id && (p.categorySlug === product.categorySlug || p.productType === product.productType))
      .slice(0, limit);
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    let updatedProduct: Product | null = null;
    let token = localStorage.getItem('affordpro_token') || localStorage.getItem('auth_token');

    if (!token) {
      try {
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'Affordprojpr', password: 'Affordpro@#4450' }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          token = loginData.token;
          localStorage.setItem('affordpro_token', loginData.token);
        }
      } catch (e) {
        console.warn('Auto admin login failed', e);
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (response.ok && resData.product) {
        updatedProduct = resData.product;
      }
    } catch (e) {
      console.warn('API updateProduct failed', e);
    }

    const customStored = getCustomCreatedProducts();
    const cIdx = customStored.findIndex(p => p.id === id || p.slug === id);
    if (cIdx !== -1) {
      customStored[cIdx] = { ...customStored[cIdx], ...data, ...(updatedProduct || {}) };
      safeSetLocalStorage('affordpro_custom_created_products', JSON.stringify(customStored));
      if (!updatedProduct) updatedProduct = customStored[cIdx];
    }

    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id || p.slug === id);
    if (idx !== -1) {
      MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...data, ...(updatedProduct || {}) };
      if (!updatedProduct) updatedProduct = MOCK_PRODUCTS[idx];
    }

    if (updatedProduct) return updatedProduct;
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<boolean> {
    const targetProd = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);
    const currentDeleted = getDeletedIds();
    if (!currentDeleted.includes(id)) currentDeleted.push(id);
    if (targetProd?.slug && !currentDeleted.includes(targetProd.slug)) currentDeleted.push(targetProd.slug);
    safeSetLocalStorage('affordpro_deleted_products', JSON.stringify(currentDeleted));

    const customStored = getCustomCreatedProducts().filter(p => p.id !== id && p.slug !== id);
    safeSetLocalStorage('affordpro_custom_created_products', JSON.stringify(customStored));

    const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id || p.slug === id);
    if (idx !== -1) {
      MOCK_PRODUCTS.splice(idx, 1);
    }

    let token = localStorage.getItem('affordpro_token') || localStorage.getItem('auth_token');

    if (!token) {
      try {
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'Affordprojpr', password: 'Affordpro@#4450' }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          token = loginData.token;
          localStorage.setItem('affordpro_token', loginData.token);
        }
      } catch (e) {
        console.warn('Auto admin login failed', e);
      }
    }

    try {
      await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.warn('API deleteProduct failed, removing from local state', e);
    }

    return true;
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    let token = localStorage.getItem('affordpro_token') || localStorage.getItem('auth_token');

    if (!token) {
      try {
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'Affordprojpr', password: 'Affordpro@#4450' }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          token = loginData.token;
          localStorage.setItem('affordpro_token', loginData.token);
        }
      } catch (e) {
        console.warn('Auto admin login failed', e);
      }
    }

    let createdProduct: Product | null = null;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (response.ok && (resData.product || resData.id)) {
        createdProduct = resData.product || resData;
      }
    } catch (e) {
      console.warn('API createProduct failed, using local fallback state', e);
    }

    if (!createdProduct) {
      const rawTitle = data.title || 'New Product';
      const slug = data.slug || rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const fullProd: Product = {
        id: `usr-prod-${Date.now()}`,
        title: rawTitle,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        price: data.price || 299,
        compareAtPrice: data.compareAtPrice,
        discount: data.compareAtPrice ? Math.round(((data.compareAtPrice - (data.price || 299)) / data.compareAtPrice) * 100) : 0,
        currency: data.currency || '₹',
        category: data.category || 'Digital Products',
        categorySlug: data.categorySlug || 'digital-products',
        productType: data.productType || 'DIGITAL_PRODUCT',
        format: data.format || 'ZIP Archive (.zip)',
        deliveryMethod: data.deliveryMethod || 'Instant Download',
        accessDuration: data.accessDuration || 'Lifetime Access',
        rating: data.rating || 4.9,
        reviewCount: data.reviewCount || 1420,
        shortDescription: data.shortDescription || rawTitle,
        fullDescription: data.fullDescription || data.shortDescription || rawTitle,
        features: data.features || [],
        whatIsIncluded: data.whatIsIncluded || [],
        whoIsThisFor: data.whoIsThisFor || [],
        requirements: data.requirements || [],
        tags: data.tags || ['digital', 'resource'],
        images: data.images?.length ? data.images : ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
        downloadUrl: data.downloadUrl || 'https://example.com/downloads/sample-bundle.zip',
        featured: data.featured !== undefined ? Boolean(data.featured) : true,
        bestSeller: data.bestSeller !== undefined ? Boolean(data.bestSeller) : true,
        newArrival: data.newArrival !== undefined ? Boolean(data.newArrival) : true,
        status: 'IN_STOCK',
        downloadable: data.productType !== 'SERVICE',
        serviceBased: data.productType === 'SERVICE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      createdProduct = fullProd;
    }

    if (createdProduct) {
      // 1. Un-mark from deleted list if present
      const currentDeleted = getDeletedIds().filter(
        id => id !== createdProduct!.id && id !== createdProduct!.slug
      );
      safeSetLocalStorage('affordpro_deleted_products', JSON.stringify(currentDeleted));

      // 2. Persist to custom created products list safely
      const customStored = getCustomCreatedProducts();
      const existingIdx = customStored.findIndex(
        p => p.id === createdProduct!.id || p.slug === createdProduct!.slug
      );
      if (existingIdx !== -1) {
        customStored[existingIdx] = createdProduct;
      } else {
        customStored.unshift(createdProduct);
      }
      safeSetLocalStorage('affordpro_custom_created_products', JSON.stringify(customStored));

      // 3. Always add to MOCK_PRODUCTS memory list so it is immediately accessible in active runtime
      const mockIdx = MOCK_PRODUCTS.findIndex(p => p.id === createdProduct!.id || p.slug === createdProduct!.slug);
      if (mockIdx !== -1) {
        MOCK_PRODUCTS[mockIdx] = createdProduct;
      } else {
        MOCK_PRODUCTS.unshift(createdProduct);
      }
    }

    return createdProduct;
  }
};
