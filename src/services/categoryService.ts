import { Category } from '../types/category';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../mock/data';
import { fetchApi, API_BASE_URL } from './api';

const STORAGE_KEY = 'affordpro_category_overrides';

const getStoredOverrides = (): Record<string, Category> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveOverride = (idOrSlug: string, category: Category) => {
  try {
    const current = getStoredOverrides();
    current[category.id] = category;
    if (category.slug) current[category.slug] = category;
    if (idOrSlug) current[idOrSlug] = category;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to save category override', e);
  }
};

let localCategories = [...MOCK_CATEGORIES];

// Apply any stored localStorage overrides on initial script load
const storedOverrides = getStoredOverrides();
localCategories = localCategories.map((c) => {
  const override = storedOverrides[c.id] || storedOverrides[c.slug];
  if (override) {
    return { ...c, ...override };
  }
  return c;
});

// Also apply overrides to MOCK_PRODUCTS initial category names
localCategories.forEach((cat) => {
  MOCK_PRODUCTS.forEach((p) => {
    if (p.categorySlug === cat.slug) {
      p.category = cat.name;
    }
  });
});

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const overrides = getStoredOverrides();
    try {
      const cats = await fetchApi<Category[]>('/categories');
      if (cats && cats.length > 0) {
        // Apply user overrides on top of backend categories
        const merged = cats.map((c) => {
          const ov = overrides[c.id] || overrides[c.slug];
          if (ov) {
            return { ...c, name: ov.name, description: ov.description || c.description };
          }
          return c;
        });

        // Add any newly created categories stored in overrides
        Object.values(overrides).forEach((ovCategory: any) => {
          if (ovCategory?.id && !merged.some((c) => c.id === ovCategory.id || c.slug === ovCategory.slug)) {
            merged.unshift(ovCategory as Category);
          }
        });

        return merged;
      }
    } catch {
      // Fallback
    }

    return localCategories;
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const cats = await this.getCategories();
    const cat = cats.find((c) => c.slug === slug);
    return cat || null;
  },

  async createCategory(data: { name: string; description?: string }): Promise<Category> {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let token = localStorage.getItem('affordpro_token') || localStorage.getItem('auth_token');

    if (!token) {
      try {
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@affordpro.com', password: 'Password123' }),
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

    let createdCat: Category | null = null;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (response.ok && resData.category) {
        createdCat = resData.category;
      }
    } catch (e) {
      console.warn('API category creation failed, using local fallback', e);
    }

    if (!createdCat) {
      createdCat = {
        id: `cat-${Date.now()}`,
        name: data.name,
        slug: `${slug}-${Date.now().toString().slice(-3)}`,
        description: data.description || `${data.name} items`,
        icon: 'Folder',
        productCount: 0,
        featured: true,
      };
    }

    // Save to localStorage & local array
    saveOverride(createdCat.id, createdCat);
    localCategories = [createdCat, ...localCategories.filter((c) => c.id !== createdCat!.id && c.slug !== createdCat!.slug)];

    return createdCat;
  },

  async updateCategory(id: string, data: { name?: string; description?: string }): Promise<Category> {
    let token = localStorage.getItem('affordpro_token') || localStorage.getItem('auth_token');

    if (!token) {
      try {
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@affordpro.com', password: 'Password123' }),
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

    let updatedCat: Category | null = null;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (response.ok && resData.category) {
        updatedCat = resData.category;
      }
    } catch (e) {
      console.warn('API category update failed, using local fallback', e);
    }

    const index = localCategories.findIndex((c) => c.id === id || c.slug === id);
    if (!updatedCat && index !== -1) {
      updatedCat = {
        ...localCategories[index],
        name: data.name || localCategories[index].name,
        description: data.description !== undefined ? data.description : localCategories[index].description,
      };
    }

    if (updatedCat) {
      // Save override to localStorage so it is preserved across all reloads
      saveOverride(id, updatedCat);
      if (updatedCat.slug) saveOverride(updatedCat.slug, updatedCat);

      if (index !== -1) {
        localCategories[index] = updatedCat;
      } else {
        localCategories.unshift(updatedCat);
      }

      // Sync updated category name across MOCK_PRODUCTS
      if (data.name) {
        const targetSlug = updatedCat.slug;
        MOCK_PRODUCTS.forEach((p) => {
          if (p.categorySlug === targetSlug || p.category.toLowerCase() === (data.name || '').toLowerCase()) {
            p.category = data.name!;
          }
        });
      }

      return updatedCat;
    }

    throw new Error('Category not found');
  },

  async deleteCategory(id: string): Promise<boolean> {
    let token = localStorage.getItem('affordpro_token') || localStorage.getItem('auth_token');

    if (!token) {
      try {
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@affordpro.com', password: 'Password123' }),
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
      await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.warn('API category deletion failed, using local fallback', e);
    }

    localCategories = localCategories.filter((c) => c.id !== id && c.slug !== id);

    const overrides = getStoredOverrides();
    delete overrides[id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));

    return true;
  },
};
