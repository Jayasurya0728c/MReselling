import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Lock,
  ExternalLink,
  Check,
  AlertTriangle,
  X,
  Eye,
  Layers,
  Sparkles,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { fetchProducts, saveProduct, deleteProduct, uploadImage } from '../lib/dataService';
import { categories } from '../data/products';
import { formatCurrency } from '../utils/orderUtils';

export default function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStock, setFilterStock] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const defaultFormData = {
    id: '',
    name: '',
    slug: '',
    category: 'Fashion Accessories',
    shortDescription: '',
    description: '',
    price: '',
    compareAtPrice: '',
    image: '',
    images: [],
    variants: [{ name: 'Option', options: ['Standard'] }],
    inStock: true,
    stockQuantity: 10,
    isFeatured: false,
    isTrending: false,
    isPublished: true,
    // Private Supplier Details
    supplierCost: '',
    supplierUrl: '',
    supplierSku: ''
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts({ isAdmin: true });
      setProducts(data);

      // Check if URL has ?action=add or ?edit=...
      const editId = searchParams.get('edit');
      const action = searchParams.get('action');

      if (editId) {
        const item = data.find(p => p.id === editId);
        if (item) openEditModal(item);
      } else if (action === 'add') {
        openAddModal();
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      slug: product.slug || '',
      category: product.category || 'Fashion Accessories',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      price: product.price,
      compareAtPrice: product.compareAtPrice || '',
      image: product.image || '',
      images: product.images || [product.image],
      variants: product.variants?.length > 0 ? product.variants : [{ name: 'Option', options: ['Standard'] }],
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || 0,
      isFeatured: Boolean(product.isFeatured),
      isTrending: Boolean(product.isTrending),
      isPublished: product.isPublished !== false,
      supplierCost: product.supplierCost || '',
      supplierUrl: product.supplierUrl || '',
      supplierSku: product.supplierSku || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    // Remove query params
    setSearchParams({});
  };

  // Image Upload Handler
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      if (res.success) {
        setFormData(prev => ({
          ...prev,
          image: res.url,
          images: [res.url, ...prev.images.filter(img => img !== res.url)]
        }));
        showToast('Image uploaded and preview updated!');
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Product name is required');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError('Please enter a valid selling price');
      return;
    }
    if (!formData.image.trim()) {
      setFormError('Main product image is required (upload or provide URL)');
      return;
    }

    setSaving(true);
    try {
      await saveProduct(formData);
      showToast(editingProduct ? 'Product updated successfully!' : 'New product created successfully!');
      closeModal();
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      showToast('Product deleted');
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    if (filterStock === 'inStock' && !p.inStock) return false;
    if (filterStock === 'outOfStock' && p.inStock) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-float text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Add, update prices, manage variants, and store private supplier costs.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product name..."
            className="w-full bg-warm-50 border border-warm-200 rounded-xl py-2 pl-9 pr-3 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category & Stock Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-warm-50 border border-warm-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="bg-warm-50 border border-warm-200 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none"
          >
            <option value="All">All Stock</option>
            <option value="inStock">In Stock Only</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products List Table */}
      <div className="bg-white rounded-3xl border border-warm-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-neutral-400">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-50 text-neutral-500 font-semibold uppercase tracking-wider text-[10px] border-b border-warm-100">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Selling Price</th>
                  <th className="py-3.5 px-3 text-brand-900 bg-brand-50/50">
                    <div className="flex items-center gap-1 font-bold">
                      <Lock className="w-3 h-3 text-brand-700" />
                      <span>Private Cost</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-3">Est. Margin</th>
                  <th className="py-3.5 px-3">Stock</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100">
                {filteredProducts.map((p) => {
                  const margin = p.supplierCost ? p.price - p.supplierCost : null;
                  const marginPercent = p.supplierCost ? Math.round((margin / p.price) * 100) : null;

                  return (
                    <tr key={p.id} className="hover:bg-warm-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-warm-100 border border-warm-200 flex-shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-neutral-900 truncate">{p.name}</div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                              {p.isTrending && <span className="text-amber-700 font-bold">Trending</span>}
                              {p.isFeatured && <span className="text-brand-700 font-bold">Featured</span>}
                              <span>Qty: {p.stockQuantity}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-neutral-700 font-medium">
                        {p.category}
                      </td>
                      <td className="py-3 px-3 font-bold text-neutral-900">
                        {formatCurrency(p.price)}
                        {p.compareAtPrice && (
                          <div className="text-[10px] text-neutral-400 line-through">
                            {formatCurrency(p.compareAtPrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 bg-brand-50/30">
                        {p.supplierCost ? (
                          <span className="font-mono font-bold text-neutral-800">
                            {formatCurrency(p.supplierCost)}
                          </span>
                        ) : (
                          <span className="text-neutral-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {margin !== null ? (
                          <span className="font-bold text-emerald-700">
                            +{formatCurrency(margin)} <span className="text-[10px]">({marginPercent}%)</span>
                          </span>
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {p.inStock ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            In Stock ({p.stockQuantity})
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-900 border border-red-300">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {p.isPublished !== false ? (
                          <span className="text-emerald-700 font-semibold text-[11px]">Published</span>
                        ) : (
                          <span className="text-neutral-400 font-semibold text-[11px]">Draft</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {p.supplierUrl && (
                            <a
                              href={p.supplierUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-800 hover:bg-warm-100"
                              title="Open Private Supplier (Meesho) Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-neutral-600 hover:text-brand-800 hover:bg-warm-100"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-neutral-900">Delete Product?</h3>
            <p className="text-xs text-neutral-600">
              Are you sure you want to remove this product from the storefront? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-warm-300 text-xs font-semibold text-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-warm-200">
              <div>
                <h2 className="font-display font-bold text-lg text-neutral-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-neutral-500">
                  Configure storefront details and private supplier verification data.
                </p>
              </div>
              <button onClick={closeModal} className="p-1.5 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kerala Palakka Necklace"
                    className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing in INR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Selling Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 499"
                    className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Optional Compare-At Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="e.g. 899 (for discount badge)"
                    className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>

              {/* PROTECTED PRIVATE SUPPLIER INFO (Admin Only) */}
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-brand-900">
                  <Lock className="w-4 h-4 text-brand-700" />
                  <span>Confidential Supplier Info (Never Shown to Customers)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Private Supplier Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.supplierCost}
                      onChange={(e) => setFormData({ ...formData, supplierCost: e.target.value })}
                      placeholder="e.g. 240 (Meesho cost)"
                      className="w-full bg-white border border-warm-300 rounded-xl p-2 text-xs text-neutral-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Private Supplier Product URL (Meesho / Wholesale link)
                    </label>
                    <input
                      type="url"
                      value={formData.supplierUrl}
                      onChange={(e) => setFormData({ ...formData, supplierUrl: e.target.value })}
                      placeholder="https://meesho.com/s/p/..."
                      className="w-full bg-white border border-warm-300 rounded-xl p-2 text-xs text-neutral-900"
                    />
                  </div>
                </div>
              </div>

              {/* Product Photos */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">
                  Main Product Image *
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload below"
                    className="flex-1 bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900"
                  />
                  <label className="px-3 py-2.5 rounded-xl border border-warm-300 bg-white hover:bg-warm-100 text-xs font-semibold text-neutral-700 cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-brand-700" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.image && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover bg-warm-100 border border-warm-200"
                    />
                    <span className="text-[11px] text-neutral-500">Live image preview</span>
                  </div>
                )}
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Short Highlight / Tagline
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="e.g. One-touch automatic wireless water pump for 20L cans."
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Full Description & Specifications
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed specifications, materials, battery life, usage tips..."
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-2.5 text-xs text-neutral-900"
                />
              </div>

              {/* Flags & Stock Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-warm-200 bg-warm-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded text-brand-700"
                  />
                  <span className="text-xs font-bold text-neutral-800">In Stock</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-warm-200 bg-warm-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="rounded text-brand-700"
                  />
                  <span className="text-xs font-bold text-neutral-800">Trending</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-warm-200 bg-warm-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-brand-700"
                  />
                  <span className="text-xs font-bold text-neutral-800">Featured</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-warm-200 bg-warm-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded text-brand-700"
                  />
                  <span className="text-xs font-bold text-neutral-800">Published</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-warm-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-warm-300 text-xs font-semibold text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
