import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, Plus, Edit2, Trash2, Shield, CheckCircle, RefreshCw, Sparkles, TrendingUp, FolderPlus, FolderCheck, Search, Upload, FileSpreadsheet, Star, MessageSquare, Flame, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { reviewService } from '../services/reviewService';
import { pageService, PageContent } from '../services/pageService';
import { orderService } from '../services/orderService';
import { API_BASE_URL } from '../services/api';
import { parseReviewsContent } from '../utils/reviewHelper';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { Review } from '../types/review';
import { Order } from '../types/order';

export const Admin: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'new-product' | 'edit-product' | 'reviews' | 'pages'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviewSearch, setReviewSearch] = useState('');
  const [selectedReviewProduct, setSelectedReviewProduct] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // CMS Page Content State
  const [activePageSlug, setActivePageSlug] = useState<string>('privacy-policy');
  const [cmsTitle, setCmsTitle] = useState('');
  const [cmsSubtitle, setCmsSubtitle] = useState('');
  const [cmsContent, setCmsContent] = useState('');
  const [cmsLastUpdated, setCmsLastUpdated] = useState('');
  const [cmsEmail, setCmsEmail] = useState('');
  const [cmsPhone, setCmsPhone] = useState('');
  const [cmsHours, setCmsHours] = useState('');

  const loadPageToCMS = (slug: string) => {
    setActivePageSlug(slug);
    const data = pageService.getPageContent(slug);
    setCmsTitle(data.title || '');
    setCmsSubtitle(data.subtitle || '');
    setCmsContent(data.content || '');
    setCmsLastUpdated(data.lastUpdated || '');
    setCmsEmail(data.email || 'support@affordpro.com');
    setCmsPhone(data.phone || '+91 98765 43210');
    setCmsHours(data.workingHours || 'Monday – Saturday: 9:00 AM – 8:00 PM IST');
  };

  useEffect(() => {
    loadPageToCMS('privacy-policy');
  }, []);

  const handleSaveCMSPage = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PageContent = {
      slug: activePageSlug,
      title: cmsTitle,
      subtitle: cmsSubtitle,
      content: cmsContent,
      lastUpdated: cmsLastUpdated,
      email: cmsEmail,
      phone: cmsPhone,
      workingHours: cmsHours,
    };
    pageService.savePageContent(activePageSlug, updated);
    showToast(`"${cmsTitle}" page content updated successfully!`, 'success');
  };

  // Category Modal & Edit State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // Search Filter State for All Products Catalog
  const [productSearch, setProductSearch] = useState('');

  // Edit Product Modal State
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCompareAtPrice, setEditCompareAtPrice] = useState('');
  const [editType, setEditType] = useState('DIGITAL_PRODUCT');
  const [editCategory, setEditCategory] = useState('');
  const [editFormat, setEditFormat] = useState('ZIP');
  const [editDeliveryMethod, setEditDeliveryMethod] = useState('Instant Download');
  const [editAccessDuration, setEditAccessDuration] = useState('Lifetime Access');
  const [editRating, setEditRating] = useState('4.9');
  const [editReviewCount, setEditReviewCount] = useState('1420');
  const [editShortDesc, setEditShortDesc] = useState('');
  const [editFullDesc, setEditFullDesc] = useState('');
  const [editFeaturesStr, setEditFeaturesStr] = useState('');
  const [editWhatIsIncludedStr, setEditWhatIsIncludedStr] = useState('');
  const [editWhoIsThisForStr, setEditWhoIsThisForStr] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDownloadUrl, setEditDownloadUrl] = useState('');
  const [editIsFeatured, setEditIsFeatured] = useState(true);
  const [editIsBestSeller, setEditIsBestSeller] = useState(false);
  const [isSubmittingProductEdit, setIsSubmittingProductEdit] = useState(false);

  // New Product Form Expanded State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCompareAtPrice, setNewCompareAtPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState('DIGITAL_PRODUCT');
  const [newFormat, setNewFormat] = useState('ZIP / Google Drive');
  const [newDeliveryMethod, setNewDeliveryMethod] = useState('Instant Download');
  const [newAccessDuration, setNewAccessDuration] = useState('Lifetime Access');
  const [newRating, setNewRating] = useState('4.9');
  const [newReviewCount, setNewReviewCount] = useState('1420');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [newFullDesc, setNewFullDesc] = useState('');
  const [newFeaturesStr, setNewFeaturesStr] = useState('');
  const [newWhatIsIncludedStr, setNewWhatIsIncludedStr] = useState('');
  const [newWhoIsThisForStr, setNewWhoIsThisForStr] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDownloadUrl, setNewDownloadUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Bulk Reviews Upload File State
  const [editUploadedReviewsInfo, setEditUploadedReviewsInfo] = useState<{ fileName: string; count: number; avgRating: number } | null>(null);
  const [newUploadedReviewsInfo, setNewUploadedReviewsInfo] = useState<{ fileName: string; count: number; avgRating: number } | null>(null);
  const [newUploadedReviews, setNewUploadedReviews] = useState<Review[] | null>(null);
  const [editUploadedReviews, setEditUploadedReviews] = useState<Review[] | null>(null);

  const handleReviewsFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseReviewsContent(content);
        if (parsed.totalCount === 0) {
          showToast('Could not parse any reviews from the file. Please check CSV/Excel file format.', 'error');
          return;
        }

        if (isEditMode) {
          setEditRating(String(parsed.averageRating));
          setEditReviewCount(String(parsed.totalCount));
          setEditUploadedReviewsInfo({
            fileName: file.name,
            count: parsed.totalCount,
            avgRating: parsed.averageRating,
          });
          setEditUploadedReviews(parsed.reviews);
        } else {
          setNewRating(String(parsed.averageRating));
          setNewReviewCount(String(parsed.totalCount));
          setNewUploadedReviewsInfo({
            fileName: file.name,
            count: parsed.totalCount,
            avgRating: parsed.averageRating,
          });
          setNewUploadedReviews(parsed.reviews);
        }

        showToast(`Successfully uploaded ${parsed.totalCount} customer reviews from ${file.name}! (Average Rating: ${parsed.averageRating} ★)`, 'success');
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [prods, cats, revs, ords] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
        reviewService.getAllReviews(),
        orderService.getAllOrders(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setAllReviews(revs);
      setOrders(ords);
      if (cats.length > 0) setNewCategory(cats[0].slug);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (review: Review) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${review.userName}"?`)) {
      return;
    }

    try {
      await reviewService.deleteReview(review.id, review.productId);
      setAllReviews((prev) => prev.filter((r) => r.id !== review.id));
      showToast(`Review by "${review.userName}" deleted successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete review', 'error');
    }
  };

  const handleClearAllOrders = async () => {
    if (!window.confirm('⚠️ Are you sure you want to CLEAR ALL CUSTOMER ORDERS & transaction history? This action cannot be undone.')) {
      return;
    }

    try {
      await orderService.clearAllOrders();
      setOrders([]);
      showToast('All customer orders and buyer transaction history cleared!', 'success');
    } catch (err: any) {
      showToast('Failed to clear orders', 'error');
    }
  };

  const handleMoveProductUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index <= 0) return;
    const updated = [...products];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;

    setProducts(updated);
    productService.saveProductOrder(updated.map((p) => p.id));
    showToast(`Moved "${updated[index - 1].title}" up to position #${index}`, 'success');
  };

  const handleMoveProductDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index >= products.length - 1) return;
    const updated = [...products];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;

    setProducts(updated);
    productService.saveProductOrder(updated.map((p) => p.id));
    showToast(`Moved "${updated[index + 1].title}" down to position #${index + 2}`, 'success');
  };

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }

    setIsSubmittingCat(true);
    try {
      if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory.id, {
          name: catName,
          description: catDesc,
        });

        // Immediately update React categories state
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id || c.slug === editingCategory.slug ? updated : c))
        );

        showToast(`Category "${updated.name}" updated successfully!`, 'success');
        if (updated.slug) setNewCategory(updated.slug);
      } else {
        const created = await categoryService.createCategory({
          name: catName,
          description: catDesc,
        });

        // Immediately update React categories state
        setCategories((prev) => [created, ...prev.filter((c) => c.id !== created.id && c.slug !== created.slug)]);

        showToast(`New Category "${created.name}" created successfully!`, 'success');
        if (created.slug) setNewCategory(created.slug);
      }

      setIsCategoryModalOpen(false);
      const latestCats = await categoryService.getCategories();
      setCategories(latestCats);
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setIsSubmittingCat(false);
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id && c.slug !== cat.slug));
      showToast(`Category "${cat.name}" deleted successfully!`, 'success');
      if (isCategoryModalOpen) setIsCategoryModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'DIGITAL_PRODUCT': return 'Digital Product';
      case 'TEMPLATE': return 'Canva Template';
      case 'BUNDLE': return 'Reels Bundle';
      case 'COURSE': return 'Course';
      case 'SERVICE': return 'Service';
      default: return String(type).replace('_', ' ');
    }
  };

  const handleDeleteProduct = async (prod: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete product "${prod.title}" from database?`)) {
      return;
    }

    try {
      await productService.deleteProduct(prod.id);
      setProducts((prev) => prev.filter((p) => p.id !== prod.id && p.slug !== prod.slug));
      showToast(`Product "${prod.title}" deleted successfully!`, 'success');
      if (activeTab === 'edit-product') {
        setActiveTab('products');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditTitle(prod.title);
    setEditPrice(String(prod.price));
    setEditCompareAtPrice(prod.compareAtPrice ? String(prod.compareAtPrice) : '');
    setEditType(prod.productType);
    setEditCategory(prod.categorySlug || prod.category);
    setEditFormat(prod.format || 'ZIP Archive (.zip)');
    setEditDeliveryMethod(prod.deliveryMethod || 'Instant Download');
    setEditAccessDuration(prod.accessDuration || 'Lifetime Access');
    setEditRating(String(prod.rating || 4.9));
    setEditReviewCount(String(prod.reviewCount || 1420));
    setEditShortDesc(prod.shortDescription || '');
    setEditFullDesc(prod.fullDescription || prod.shortDescription || '');
    setEditFeaturesStr(Array.isArray(prod.features) ? prod.features.join('\n') : '');
    setEditWhatIsIncludedStr(Array.isArray(prod.whatIsIncluded) ? prod.whatIsIncluded.join('\n') : '');
    setEditWhoIsThisForStr(Array.isArray(prod.whoIsThisFor) ? prod.whoIsThisFor.join('\n') : '');
    setEditImageUrl(prod.images?.[0] || '');
    setEditDownloadUrl(prod.downloadUrl || '');
    setEditIsFeatured(Boolean(prod.featured));
    setEditIsBestSeller(Boolean(prod.bestSeller));
    setEditUploadedReviewsInfo(null);
    setActiveTab('edit-product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editTitle || !editPrice) {
      showToast('Title and Price are required', 'error');
      return;
    }

    setIsSubmittingProductEdit(true);
    try {
      const updatedData: Partial<Product> = {
        title: editTitle,
        price: Number(editPrice),
        compareAtPrice: editCompareAtPrice ? Number(editCompareAtPrice) : undefined,
        productType: editType as any,
        categorySlug: editCategory,
        category: categories.find((c) => c.slug === editCategory)?.name || editCategory,
        format: editFormat,
        deliveryMethod: editDeliveryMethod,
        accessDuration: editAccessDuration,
        rating: Number(editRating) || 4.9,
        reviewCount: Number(editReviewCount) || 1420,
        shortDescription: editShortDesc,
        fullDescription: editFullDesc || editShortDesc,
        features: editFeaturesStr.split('\n').map((s) => s.trim()).filter(Boolean),
        whatIsIncluded: editWhatIsIncludedStr.split('\n').map((s) => s.trim()).filter(Boolean),
        whoIsThisFor: editWhoIsThisForStr.split('\n').map((s) => s.trim()).filter(Boolean),
        images: editImageUrl ? [editImageUrl] : editingProduct.images,
        downloadUrl: editDownloadUrl,
        featured: editIsFeatured,
        bestSeller: editIsBestSeller,
      };

      const updated = await productService.updateProduct(editingProduct.id, updatedData);

      if (editUploadedReviews && editUploadedReviews.length > 0) {
        reviewService.saveCustomReviews(editingProduct.id, editingProduct.slug, editUploadedReviews);
        setEditUploadedReviews(null);
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id || p.slug === editingProduct.slug ? { ...p, ...updated } : p))
      );

      showToast(`Product "${updated.title}" updated successfully!`, 'success');
      setActiveTab('products');
      fetchAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update product', 'error');
    } finally {
      setIsSubmittingProductEdit(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      showToast('Please fill in title and price', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem('affordpro_token') || localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          price: Number(newPrice),
          compareAtPrice: newCompareAtPrice ? Number(newCompareAtPrice) : undefined,
          categorySlug: newCategory || 'digital-products',
          productType: newType,
          format: newFormat,
          deliveryMethod: newDeliveryMethod,
          accessDuration: newAccessDuration,
          rating: Number(newRating) || 4.9,
          reviewCount: Number(newReviewCount) || 1420,
          shortDescription: newShortDesc || newTitle,
          fullDescription: newFullDesc || newShortDesc || newTitle,
          features: newFeaturesStr.split('\n').map((s) => s.trim()).filter(Boolean),
          whatIsIncluded: newWhatIsIncludedStr.split('\n').map((s) => s.trim()).filter(Boolean),
          whoIsThisFor: newWhoIsThisForStr.split('\n').map((s) => s.trim()).filter(Boolean),
          images: [newImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
          downloadUrl: newDownloadUrl || 'https://example.com/downloads/sample-bundle.zip',
          featured: isFeatured,
          bestSeller: isBestSeller,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const createdProd = data.product || data;
        if (createdProd && createdProd.id && newUploadedReviews && newUploadedReviews.length > 0) {
          reviewService.saveCustomReviews(createdProd.id, createdProd.slug, newUploadedReviews);
          setNewUploadedReviews(null);
        }

        showToast('New Product created successfully in Database!', 'success');
        setNewTitle('');
        setNewPrice('');
        setNewCompareAtPrice('');
        setNewShortDesc('');
        setNewFullDesc('');
        setNewFeaturesStr('');
        setNewWhatIsIncludedStr('');
        setNewWhoIsThisForStr('');
        setNewUploadedReviewsInfo(null);
        fetchAdminData();
        setActiveTab('products');
      } else {
        showToast(data.message || 'Failed to create product', 'error');
      }
    } catch (err: any) {
      showToast('Error connecting to backend server', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black">
            <Shield className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
                ADMIN CONTROL PANEL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">AffordPro Management</h1>
            <p className="text-slate-400 text-xs mt-0.5">Manage products, pricing, orders, and database metrics</p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh DB Data</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>All Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'categories' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reviews' ? 'bg-amber-600 text-white shadow-md' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Customer Reviews ({allReviews.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('pages');
            loadPageToCMS(activePageSlug);
          }}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pages' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Site Pages & Legal CMS</span>
        </button>

        <button
          onClick={() => setActiveTab('new-product')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'new-product' ? 'bg-emerald-600 text-white shadow-md' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{products.length}</div>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{categories.length}</div>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                <div className="text-2xl font-black text-slate-900 mt-1">12</div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹14,980</div>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ALL CUSTOMER ORDERS & USER DETAILS */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[10px] uppercase">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>CUSTOMER PURCHASES & TRANSACTION LOGS</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Customer Orders & Buyer Details ({orders.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every customer's full name, email address, mobile number, payment method, purchasing time, and purchased product.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Real-time Order Search Bar */}
              <div className="relative flex-1 md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search name, email, phone, order ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-2xs"
                />
              </div>

              {orders.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllOrders}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                  title="Clear all customer orders and transaction history"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Orders Data</span>
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Order ID</th>
                  <th className="p-3.5">Customer Details (Name & Email)</th>
                  <th className="p-3.5">Mobile Number</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Purchasing Time / Date</th>
                  <th className="p-3.5">Purchased Product(s)</th>
                  <th className="p-3.5 text-right rounded-r-xl">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {orders
                  .filter((ord) => {
                    if (!orderSearch.trim()) return true;
                    const q = orderSearch.toLowerCase();
                    return (
                      ord.orderNumber.toLowerCase().includes(q) ||
                      ord.customerName.toLowerCase().includes(q) ||
                      ord.customerEmail.toLowerCase().includes(q) ||
                      (ord.customerPhone && ord.customerPhone.toLowerCase().includes(q)) ||
                      ord.paymentMethod.toLowerCase().includes(q)
                    );
                  })
                  .map((ord) => (
                    <tr key={ord.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 text-[11px]">
                          {ord.orderNumber}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-extrabold text-slate-900 text-sm">{ord.customerName}</div>
                        <a href={`mailto:${ord.customerEmail}`} className="text-[11px] text-indigo-600 font-bold hover:underline block">
                          {ord.customerEmail}
                        </a>
                      </td>

                      <td className="p-3.5">
                        {ord.customerPhone && ord.customerPhone !== 'N/A' ? (
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                            📞 {ord.customerPhone}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">Not Provided</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-black text-[10px] border border-emerald-200 uppercase">
                          💳 {ord.paymentMethod}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-600 text-[11px]">
                        🕒 {ord.date}
                      </td>

                      <td className="p-3.5 max-w-[240px]">
                        {ord.items.map((item, i) => (
                          <div key={i} className="text-xs font-bold text-slate-800 line-clamp-1">
                            • {item.productTitle}
                          </div>
                        ))}
                      </td>

                      <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                        ₹{ord.total}
                      </td>
                    </tr>
                  ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-semibold">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS TABLE WITH AUTOMATIC CLICK-TO-EDIT & CATALOG SEARCH */}
      {activeTab === 'products' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Database Product Catalog ({products.length})</h2>
              <p className="text-slate-500 text-xs">Click any product row below to automatically open the full Edit Product window</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Catalog Search Bar */}
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search title, category, price, format..."
                  className="w-full pl-10 pr-8 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 shadow-xs"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={() => setActiveTab('new-product')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Product</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Order & Position</th>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Price & Compare</th>
                  <th className="p-3.5">Format & Access</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products
                  .filter((p) => {
                    if (!productSearch.trim()) return true;
                    const q = productSearch.toLowerCase();
                    return (
                      p.title.toLowerCase().includes(q) ||
                      p.category.toLowerCase().includes(q) ||
                      (p.format && p.format.toLowerCase().includes(q)) ||
                      String(p.price).includes(q) ||
                      p.productType.toLowerCase().includes(q)
                    );
                  })
                  .map((prod, idx) => (
                    <tr
                      key={prod.id}
                      onClick={() => handleOpenEditProduct(prod)}
                      className="hover:bg-indigo-50/70 transition-colors cursor-pointer group"
                      title="Click product row to edit features"
                    >
                      <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-7 h-7 text-center font-black text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-center text-xs shadow-xs">
                            #{idx + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={(e) => handleMoveProductUp(idx, e)}
                              className="p-1 bg-slate-100 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 rounded-md transition-colors text-[10px]"
                              title="Move post UP (towards top)"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === products.length - 1}
                              onClick={(e) => handleMoveProductDown(idx, e)}
                              className="p-1 bg-slate-100 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 rounded-md transition-colors text-[10px]"
                              title="Move post DOWN (towards end)"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.title} className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform" />
                        <div>
                          <div className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            <span>{prod.title}</span>
                            {prod.bestSeller && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[9px] rounded-full flex items-center gap-0.5 shrink-0">
                                <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-600" /> Best Seller
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">✏️ Click to Edit</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{prod.slug}</div>
                        </div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">{prod.category}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-[10px]">
                          {getProductTypeLabel(prod.productType)}
                        </span>
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900">
                        ₹{prod.price}
                        {prod.compareAtPrice && (
                          <span className="text-[10px] text-slate-400 line-through ml-1 font-normal">₹{prod.compareAtPrice}</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 font-semibold">
                        <div className="text-[11px] font-bold text-slate-800">{prod.format || 'ZIP / Digital'}</div>
                        <div className="text-[10px] text-slate-400">{prod.accessDuration || 'Lifetime'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1 font-extrabold text-amber-600">
                          <span>★ {prod.rating || 4.9}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({prod.reviewCount || 1420})</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const newStatus = !prod.bestSeller;
                                await productService.updateProduct(prod.id, { bestSeller: newStatus });
                                setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, bestSeller: newStatus } : p)));
                                showToast(newStatus ? `"${prod.title}" marked as Best Seller!` : `"${prod.title}" removed from Best Seller`, 'success');
                              } catch (err: any) {
                                showToast('Failed to update status', 'error');
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] inline-flex items-center gap-1 transition-colors border shadow-xs ${
                              prod.bestSeller ? 'bg-amber-500 text-white border-amber-600' : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border-slate-200'
                            }`}
                            title={prod.bestSeller ? 'Remove from Best Sellers' : 'Mark as Best Seller'}
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>{prod.bestSeller ? 'Best Seller ★' : '+ Best Seller'}</span>
                          </button>

                          <Link
                            to={`/product/${prod.slug}`}
                            target="_blank"
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                          >
                            View Live
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProduct(prod, e)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-extrabold text-[11px] inline-flex items-center gap-1 transition-colors border border-rose-100 shadow-xs"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW PRODUCT FORM WITH RICH FEATURES */}
      {activeTab === 'new-product' && (
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-black text-slate-900">Add New Product to Database</h2>
            <p className="text-slate-500 text-xs">Configure price, format, features, customer reviews & asset link</p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 2000+ AI Video Prompts Pack"
                className="w-full px-4 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="299"
                  className="w-full px-4 py-3 text-sm font-extrabold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  value={newCompareAtPrice}
                  onChange={(e) => setNewCompareAtPrice(e.target.value)}
                  placeholder="999"
                  className="w-full px-4 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Type *</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                >
                  <option value="DIGITAL_PRODUCT">Digital Product</option>
                  <option value="TEMPLATE">Canva Template</option>
                  <option value="BUNDLE">Reels Bundle</option>
                  <option value="COURSE">Course</option>
                  <option value="SERVICE">Service</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Format (File Type) *</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                >
                  <option value="ZIP Archive (.zip)">ZIP Archive (.zip)</option>
                  <option value="Canva Template Link">Canva Template Link</option>
                  <option value="Google Drive Access">Google Drive Folder Link</option>
                  <option value="PDF Document (.pdf)">PDF Document (.pdf)</option>
                  <option value="MP4 Video Pack (.mp4)">MP4 Video Pack (.mp4)</option>
                  <option value="Video Portal / Course Access">Video Portal / Course Access</option>
                  <option value="Custom Direct Link">Custom Direct Link</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Method *</label>
                <select
                  value={newDeliveryMethod}
                  onChange={(e) => setNewDeliveryMethod(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                >
                  <option value="Instant Download">Instant Download</option>
                  <option value="Google Drive Access">Google Drive Access</option>
                  <option value="Email Delivery">Email Delivery</option>
                  <option value="Direct Portal Access">Direct Portal Access</option>
                  <option value="Instant Canva Link Access">Instant Canva Link Access</option>
                </select>
              </div>
            </div>

            {/* Bulk Upload Genuine Customer Reviews (.CSV / Excel / JSON) */}
            <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <span>Bulk Upload Genuine Customer Reviews File (.CSV, .Excel, .JSON)</span>
                </label>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">Automatic Rating Parser</span>
              </div>

              <div className="p-4 bg-white border border-emerald-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <input
                  type="file"
                  id="new-reviews-file-picker"
                  accept=".csv,.xlsx,.xls,.json,.txt"
                  onChange={(e) => handleReviewsFileUpload(e, false)}
                  className="hidden"
                />
                <label
                  htmlFor="new-reviews-file-picker"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Reviews File (.CSV / Excel)</span>
                </label>

                {newUploadedReviewsInfo ? (
                  <div className="text-right text-xs">
                    <span className="font-extrabold text-emerald-950 block">📄 {newUploadedReviewsInfo.fileName}</span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {newUploadedReviewsInfo.count} Reviews Loaded • Average Rating: {newUploadedReviewsInfo.avgRating} ★
                    </span>
                  </div>
                ) : (
                  <div className="text-right text-xs text-slate-500 font-semibold">
                    Default Auto Rating: {newRating || '4.9'} ★ ({newReviewCount || '1420'} Reviews)
                  </div>
                )}
              </div>

              <p className="text-[11px] text-emerald-900/80 font-medium">
                💡 <strong>CSV Format:</strong> File should contain customer name, rating (1-5), and review text. e.g. <code>"Name, Rating, Comment, Date"</code>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
              <input
                type="text"
                value={newShortDesc}
                onChange={(e) => setNewShortDesc(e.target.value)}
                placeholder="High-converting digital template pack for social media growth"
                className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">About This Product (Full Description)</label>
              <textarea
                value={newFullDesc}
                onChange={(e) => setNewFullDesc(e.target.value)}
                placeholder="Detailed description of what this product offers, features, and benefits..."
                rows={4}
                className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Features (1 per line)</label>
                <textarea
                  value={newFeaturesStr}
                  onChange={(e) => setNewFeaturesStr(e.target.value)}
                  placeholder="1000+ HD Vertical Videos&#10;Watermark Free&#10;Instant Google Drive Link"
                  rows={4}
                  className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">What is Included (1 per line)</label>
                <textarea
                  value={newWhatIsIncludedStr}
                  onChange={(e) => setNewWhatIsIncludedStr(e.target.value)}
                  placeholder="1000+ MP4 Clips&#10;Viral Captions Guide&#10;Trending Audio Links Sheet"
                  rows={4}
                  className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Product Image Selection & Desktop Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Product Thumbnail / Image *</label>

              <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl transition-colors text-center space-y-2">
                <input
                  type="file"
                  id="desktop-image-upload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        showToast('File size must be under 5MB', 'error');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewImageUrl(reader.result as string);
                        showToast('Desktop image uploaded successfully!', 'success');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="desktop-image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Image from Desktop Gallery</span>
                </label>
                <p className="text-[11px] text-slate-500 font-semibold">Or enter image web URL below</p>
              </div>

              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />

              {newImageUrl && (
                <div className="relative aspect-video w-40 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-xs mt-2">
                  <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Preview</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Protected Download URL (Asset Link)</label>
              <input
                type="text"
                value={newDownloadUrl}
                onChange={(e) => setNewDownloadUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/... or https://example.com/downloads/bundle.zip"
                className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-6 pt-1 text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                Mark Best Seller
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isCreating}
            >
              Publish Product to Database
            </Button>
          </form>
        </div>
      )}

      {/* TAB 4: EDIT PRODUCT (SPACIOUS FULL-WIDTH PAGE WINDOW) */}
      {activeTab === 'edit-product' && editingProduct && (
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] uppercase rounded-md border border-indigo-100">
                  FULL EDIT WINDOW
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {editingProduct.id}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Edit Product: "{editingProduct.title}"</h2>
              <p className="text-slate-500 text-xs mt-0.5">Modify price, format dropdowns, delivery method, reviews CSV, desktop image & download link</p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>← Back to Catalog</span>
            </button>
          </div>

          <form onSubmit={handleSaveEditProduct} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-extrabold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  value={editCompareAtPrice}
                  onChange={(e) => setEditCompareAtPrice(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Type *</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                >
                  <option value="DIGITAL_PRODUCT">Digital Product</option>
                  <option value="TEMPLATE">Canva Template</option>
                  <option value="BUNDLE">Reels Bundle</option>
                  <option value="COURSE">Course</option>
                  <option value="SERVICE">Service</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Format (File Type) *</label>
                <select
                  value={editFormat}
                  onChange={(e) => setEditFormat(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                >
                  <option value="ZIP Archive (.zip)">ZIP Archive (.zip)</option>
                  <option value="Canva Template Link">Canva Template Link</option>
                  <option value="Google Drive Access">Google Drive Folder Link</option>
                  <option value="PDF Document (.pdf)">PDF Document (.pdf)</option>
                  <option value="MP4 Video Pack (.mp4)">MP4 Video Pack (.mp4)</option>
                  <option value="Video Portal / Course Access">Video Portal / Course Access</option>
                  <option value="Custom Direct Link">Custom Direct Link</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Method *</label>
                <select
                  value={editDeliveryMethod}
                  onChange={(e) => setEditDeliveryMethod(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-800"
                >
                  <option value="Instant Download">Instant Download</option>
                  <option value="Google Drive Access">Google Drive Access</option>
                  <option value="Email Delivery">Email Delivery</option>
                  <option value="Direct Portal Access">Direct Portal Access</option>
                  <option value="Instant Canva Link Access">Instant Canva Link Access</option>
                </select>
              </div>
            </div>

            {/* Bulk Upload Genuine Customer Reviews (.CSV / Excel / JSON) */}
            <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <span>Bulk Upload Genuine Customer Reviews File (.CSV, .Excel, .JSON)</span>
                </label>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">Automated Parser</span>
              </div>

              <div className="p-4 bg-white border border-emerald-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <input
                  type="file"
                  id="edit-reviews-file-picker"
                  accept=".csv,.xlsx,.xls,.json,.txt"
                  onChange={(e) => handleReviewsFileUpload(e, true)}
                  className="hidden"
                />
                <label
                  htmlFor="edit-reviews-file-picker"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Reviews File (.CSV / Excel)</span>
                </label>

                {editUploadedReviewsInfo ? (
                  <div className="text-right text-xs">
                    <span className="font-extrabold text-emerald-950 block">📄 {editUploadedReviewsInfo.fileName}</span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {editUploadedReviewsInfo.count} Reviews Loaded • Average Rating: {editUploadedReviewsInfo.avgRating} ★
                    </span>
                  </div>
                ) : (
                  <div className="text-right text-xs text-slate-500 font-semibold">
                    Current Rating: {editRating || '4.9'} ★ ({editReviewCount || '1420'} Reviews)
                  </div>
                )}
              </div>

              <p className="text-[11px] text-emerald-900/80 font-medium">
                💡 <strong>CSV Format:</strong> File should contain customer name, rating (1-5), and review text. e.g. <code>"Name, Rating, Comment, Date"</code>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
              <input
                type="text"
                value={editShortDesc}
                onChange={(e) => setEditShortDesc(e.target.value)}
                className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">About This Product (Full Description)</label>
              <textarea
                value={editFullDesc}
                onChange={(e) => setEditFullDesc(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Features (1 per line)</label>
                <textarea
                  value={editFeaturesStr}
                  onChange={(e) => setEditFeaturesStr(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">What is Included (1 per line)</label>
                <textarea
                  value={editWhatIsIncludedStr}
                  onChange={(e) => setEditWhatIsIncludedStr(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Edit Product Desktop Image Upload Gallery Picker */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Product Thumbnail / Image *</label>

              <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl transition-colors text-center space-y-2">
                <input
                  type="file"
                  id="edit-desktop-image-picker"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        showToast('File size must be under 5MB', 'error');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditImageUrl(reader.result as string);
                        showToast('Desktop image uploaded successfully!', 'success');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="edit-desktop-image-picker"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Image from Desktop Gallery</span>
                </label>
                <p className="text-[11px] text-slate-500 font-semibold">Or enter image web URL below</p>
              </div>

              <input
                type="text"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />

              {editImageUrl && (
                <div className="relative aspect-video w-40 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-xs mt-2">
                  <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Preview</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Protected Download URL (Asset Link)</label>
              <input
                type="text"
                value={editDownloadUrl}
                onChange={(e) => setEditDownloadUrl(e.target.value)}
                className="w-full px-4 py-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-6 pt-1 text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editIsBestSeller}
                  onChange={(e) => setEditIsBestSeller(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                Mark Best Seller
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDeleteProduct(editingProduct)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl transition-colors inline-flex items-center gap-2 border border-rose-100 shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  variant="ghost"
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmittingProductEdit}
                >
                  Save Product Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: SEPARATE CATEGORY MANAGEMENT SECTION */}
      {activeTab === 'categories' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] uppercase rounded-md border border-indigo-100">
                  DATABASE CATEGORIES MANAGEMENT
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Manage & Edit Categories ({categories.length})</h2>
              <p className="text-slate-500 text-xs mt-0.5">Add new digital categories or rename existing category names in database</p>
            </div>

            <Button
              onClick={openAddCategoryModal}
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Category
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Category Name</th>
                  <th className="p-3.5">Category Slug</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-black text-slate-900 flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <FolderPlus className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm">{cat.name}</span>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">{cat.description || 'Digital products & resources'}</td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors border border-indigo-100 shadow-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Rename / Edit Category</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors border border-rose-100 shadow-xs"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMER REVIEWS & RATINGS MANAGEMENT */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Customer Reviews & Ratings ({allReviews.length})</span>
              </h2>
              <p className="text-slate-500 text-xs">View user-submitted & uploaded customer reviews and delete any review</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Review Search Input */}
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="Search customer name, comment, title..."
                  className="w-full pl-10 pr-8 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 shadow-xs"
                />
                {reviewSearch && (
                  <button
                    onClick={() => setReviewSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Metric Summary Cards for Reviews */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Total Customer Reviews</span>
                <span className="text-2xl font-black text-amber-950 mt-0.5 block">{allReviews.length}</span>
              </div>
              <div className="p-3 bg-amber-200/60 text-amber-900 rounded-xl font-black text-sm">
                ★ {allReviews.length > 0 ? (allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length).toFixed(1) : '5.0'}
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">5-Star Ratings</span>
                <span className="text-2xl font-black text-emerald-950 mt-0.5 block">
                  {allReviews.filter((r) => r.rating === 5).length}
                </span>
              </div>
              <div className="p-3 bg-emerald-200/60 text-emerald-900 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block">Verified Buyers</span>
                <span className="text-2xl font-black text-indigo-950 mt-0.5 block">
                  {allReviews.filter((r) => r.verifiedPurchase).length}
                </span>
              </div>
              <div className="p-3 bg-indigo-200/60 text-indigo-900 rounded-xl">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Product-Wise Filter Bar */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Select Product to View Its Customer Reviews:
              </span>
              {selectedReviewProduct !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedReviewProduct('ALL')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Clear Product Filter (Show All)
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setSelectedReviewProduct('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border whitespace-nowrap ${
                  selectedReviewProduct === 'ALL'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                }`}
              >
                📦 All Products ({allReviews.length} Reviews)
              </button>

              {products.map((prod) => {
                const count = allReviews.filter((r) => r.productId === prod.id || r.productId === prod.slug).length;
                const isSelected = selectedReviewProduct === prod.id || selectedReviewProduct === prod.slug;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedReviewProduct(prod.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-2 whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                    }`}
                  >
                    <img src={prod.images[0]} alt="" className="w-5 h-5 rounded-md object-cover border border-slate-200" />
                    <span>{prod.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Reviews Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Product</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Review Headline</th>
                  <th className="p-3.5">Full Review Comment</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {allReviews
                  .filter((r) => {
                    if (selectedReviewProduct !== 'ALL') {
                      const targetProd = products.find((p) => p.id === selectedReviewProduct || p.slug === selectedReviewProduct);
                      if (targetProd) {
                        if (r.productId !== targetProd.id && r.productId !== targetProd.slug) return false;
                      } else if (r.productId !== selectedReviewProduct) {
                        return false;
                      }
                    }
                    if (!reviewSearch.trim()) return true;
                    const q = reviewSearch.toLowerCase();
                    return (
                      r.userName.toLowerCase().includes(q) ||
                      r.title.toLowerCase().includes(q) ||
                      r.comment.toLowerCase().includes(q)
                    );
                  })
                  .map((rev) => {
                    const matchedProd = products.find((p) => p.id === rev.productId || p.slug === rev.productId);
                    return (
                      <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-800">
                          {matchedProd ? (
                            <div className="flex items-center gap-2">
                              <img src={matchedProd.images[0]} alt="" className="w-6 h-6 rounded-md object-cover border border-slate-200" />
                              <span className="line-clamp-1 max-w-[140px]" title={matchedProd.title}>{matchedProd.title}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">General</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            {rev.userAvatar ? (
                              <img src={rev.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                                {rev.userName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-extrabold text-slate-900">{rev.userName}</div>
                              {rev.verifiedPurchase && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">Verified Buyer</span>
                              )}
                            </div>
                          </div>
                        </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 text-[11px]">
                          ★ {rev.rating} / 5
                        </span>
                      </td>

                      <td className="p-3.5 font-bold text-slate-900 max-w-[200px] truncate" title={rev.title}>
                        {rev.title}
                      </td>

                      <td className="p-3.5 text-slate-600 max-w-[320px] line-clamp-2" title={rev.comment}>
                        {rev.comment}
                      </td>

                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {rev.date || 'Verified Buyer'}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-extrabold text-[11px] inline-flex items-center gap-1 transition-colors border border-rose-100 shadow-xs"
                          title="Delete Customer Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {allReviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                      No customer reviews found yet. User reviews submitted on frontend will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CMS SITE PAGES & LEGAL POLICY MANAGER TAB */}
      {activeTab === 'pages' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-[10px] uppercase">
                <FileText className="w-3.5 h-3.5" />
                <span>DYNAMIC SITE CONTENT CMS</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Manage Website Pages & Legal Policies</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update Privacy Policy, Terms & Conditions, Refund Policy, About Us, Contact Us, and FAQ directly for instant updates on the frontend.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/${activePageSlug === 'privacy-policy' ? 'privacy' : activePageSlug === 'refund-policy' ? 'refund-policy' : activePageSlug}`}
                target="_blank"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 transition-colors"
              >
                <span>🔗 Preview Live Page</span>
              </Link>
            </div>
          </div>

          {/* Page Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { slug: 'privacy-policy', label: '🔒 Privacy Policy' },
              { slug: 'terms', label: '📜 Terms & Conditions' },
              { slug: 'refund-policy', label: '💸 Refund & Cancellation' },
              { slug: 'about', label: 'ℹ️ About Us' },
              { slug: 'contact', label: '📞 Contact Us' },
              { slug: 'faq', label: '❓ FAQ & Knowledge Base' },
            ].map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => loadPageToCMS(item.slug)}
                className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all border whitespace-nowrap ${
                  activePageSlug === item.slug
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Page Form */}
          <form onSubmit={handleSaveCMSPage} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Title *</label>
                <input
                  type="text"
                  required
                  value={cmsTitle}
                  onChange={(e) => setCmsTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Subtitle / Tagline</label>
                <input
                  type="text"
                  value={cmsSubtitle}
                  onChange={(e) => setCmsSubtitle(e.target.value)}
                  placeholder="e.g. How we protect your data"
                  className="w-full px-4 py-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Special Contact Fields if Contact page selected */}
            {activePageSlug === 'contact' && (
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-4">
                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider">Contact Info Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Support Email</label>
                    <input
                      type="email"
                      value={cmsEmail}
                      onChange={(e) => setCmsEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={cmsPhone}
                      onChange={(e) => setCmsPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Working Hours</label>
                    <input
                      type="text"
                      value={cmsHours}
                      onChange={(e) => setCmsHours(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Full Page Content *</label>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {activePageSlug === 'faq' ? 'Format each item as Q: Question ... A: Answer' : 'Supports paragraphs & bullet lists'}
                </span>
              </div>
              <textarea
                required
                rows={14}
                value={cmsContent}
                onChange={(e) => setCmsContent(e.target.value)}
                className="w-full px-4 py-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Last Updated Stamp</label>
              <input
                type="text"
                value={cmsLastUpdated}
                onChange={(e) => setCmsLastUpdated(e.target.value)}
                placeholder="e.g. August 2026"
                className="w-80 px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" leftIcon={<FileText className="w-5 h-5" />}>
                💾 Save Page Content
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Separate Add / Edit Category Name Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? `Rename / Edit Category: "${editingCategory.name}"` : 'Add New Category to Database'}
      >
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. AI Prompt Bundles or Video FX Packs"
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Brief description of digital items in this category"
              rows={3}
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {editingCategory ? (
              <button
                type="button"
                onClick={() => handleDeleteCategory(editingCategory)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-extrabold text-xs inline-flex items-center gap-1.5 transition-colors border border-rose-100"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Category</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingCat}
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
