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

export const saveProductOrder = (orderedIds: string[]): void => {
  try {
    localStorage.setItem('affordpro_product_order', JSON.stringify(orderedIds));
  } catch (e) {
    console.warn('Failed to save product order', e);
  }
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
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const mergeProducts = (apiProds: Product[], mockProds: Product[]): Product[] => {
  const custom = getCustomCreatedProducts();
  const merged: Product[] = [...custom, ...apiProds];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const uniqueMerged: Product[] = [];

  merged.forEach((p) => {
    if (p && !seenIds.has(p.id) && !seenSlugs.has(p.slug)) {
      seenIds.add(p.id);
      seenSlugs.add(p.slug);
      uniqueMerged.push(p);
    }
  });

  mockProds.forEach((mp) => {
    if (mp && !seenIds.has(mp.id) && !seenSlugs.has(mp.slug)) {
      seenIds.add(mp.id);
      seenSlugs.add(mp.slug);
      uniqueMerged.push(mp);
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
      result = result.filter(p => p.categorySlug === filters.categorySlug);
    }

    if (filters?.productType && filters.productType !== 'ALL') {
      if (filters.productType === 'PRODUCTS_ONLY') {
        result = result.filter(p => p.productType !== 'SERVICE');
      } else {
        result = result.filter(p => p.productType === filters.productType);
      }
    }

    if (filters?.bestSellerOnly) {
      result = result.filter(p => p.bestSeller);
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.fullDescription.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
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
    return all.filter(p => p.featured);
  },

  async getBestSellers(): Promise<Product[]> {
    const all = await this.getProducts();
    return all.filter(p => p.bestSeller);
  },

  async getNewArrivals(): Promise<Product[]> {
    const all = await this.getProducts();
    return all.filter(p => p.newArrival || new Date(p.createdAt).getTime() > new Date('2026-01-15').getTime());
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
      localStorage.setItem('affordpro_custom_created_products', JSON.stringify(customStored));
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
    localStorage.setItem('affordpro_deleted_products', JSON.stringify(currentDeleted));

    const customStored = getCustomCreatedProducts().filter(p => p.id !== id && p.slug !== id);
    localStorage.setItem('affordpro_custom_created_products', JSON.stringify(customStored));

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
      const customStored = getCustomCreatedProducts();
      if (!customStored.some(p => p.id === createdProduct!.id || p.slug === createdProduct!.slug)) {
        customStored.unshift(createdProduct);
        localStorage.setItem('affordpro_custom_created_products', JSON.stringify(customStored));
      }
    }

    return createdProduct;
  }
};
