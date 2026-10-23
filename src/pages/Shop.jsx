import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/dataService';
import { categories } from '../data/products';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters from query params
  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('q') || '';
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 1500;
  const sortParam = searchParams.get('sort') || 'default';
  const inStockOnly = searchParams.get('inStock') === 'true';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [onlyInStock, setOnlyInStock] = useState(inStockOnly);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts({ isAdmin: false });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync internal state when URL search params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSearchQuery(searchParams.get('q') || '');
    if (searchParams.get('maxPrice')) {
      setMaxPrice(Number(searchParams.get('maxPrice')));
    }
    if (searchParams.get('sort')) {
      setSortBy(searchParams.get('sort'));
    }
    setOnlyInStock(searchParams.get('inStock') === 'true');
  }, [searchParams]);

  // Update URL params
  const updateParams = (newParams) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '' || v === 'All' || (k === 'maxPrice' && v >= 1500)) {
        next.delete(k);
      } else {
        next.set(k, String(v));
      }
    });
    setSearchParams(next);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    updateParams({ category: cat });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ q: searchQuery.trim() });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    updateParams({ sort: e.target.value });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(1500);
    setSortBy('default');
    setOnlyInStock(false);
    setSearchParams({});
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) return false;
        }
        // Price filter
        if (p.price > maxPrice) {
          return false;
        }
        // Stock filter
        if (onlyInStock && !p.inStock) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'popular') return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
        return 0; // default order
      });
  }, [products, selectedCategory, searchQuery, maxPrice, onlyInStock, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Title & Mobile Filter Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-warm-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Curated Kerala Catalog
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900 mt-1">
            Shop All Finds
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Carefully selected products with guaranteed Cash on Delivery across Kerala.
          </p>
        </div>

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-warm-300 bg-white text-xs font-semibold text-neutral-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-700" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-medium text-neutral-600 hidden sm:inline">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="bg-white border border-warm-300 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              <option value="default">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Trending / Reels Favorites</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
        {/* Sidebar Filters (Desktop) */}
        <aside className={`md:block space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          {/* Search box inside filter */}
          <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-soft">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500 mb-3">
              Search Products
            </h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keywords..."
                className="w-full bg-warm-100 border border-warm-200 rounded-lg py-2 pl-9 pr-3 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Categories */}
          <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-soft">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500 mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200'
                      : 'text-neutral-700 hover:bg-warm-100'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                Max Price
              </h3>
              <span className="text-xs font-extrabold text-brand-800">
                ₹{maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMaxPrice(val);
                updateParams({ maxPrice: val });
              }}
              className="w-full accent-brand-700 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>₹200</span>
              <span>₹800</span>
              <span>₹1500+</span>
            </div>

            {/* Quick Price Pills */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {[299, 499, 699].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setMaxPrice(p);
                    updateParams({ maxPrice: p });
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border ${
                    maxPrice === p
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-warm-50 text-neutral-700 border-warm-200 hover:bg-warm-100'
                  }`}
                >
                  Under ₹{p}
                </button>
              ))}
            </div>
          </div>

          {/* Availability checkbox */}
          <div className="bg-white p-4 rounded-2xl border border-warm-200 shadow-soft">
            <label className="flex items-center gap-2.5 text-xs text-neutral-700 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => {
                  setOnlyInStock(e.target.checked);
                  updateParams({ inStock: e.target.checked });
                }}
                className="rounded text-brand-700 focus:ring-brand-700 h-4 w-4 accent-brand-700"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Reset Filters button */}
          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 px-4 rounded-xl border border-warm-300 text-neutral-600 hover:text-neutral-900 hover:bg-warm-100 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-3">
          {/* Active filter badges & count */}
          <div className="flex items-center justify-between mb-4 text-xs text-neutral-500">
            <div>
              Showing <strong className="text-neutral-900 font-bold">{filteredProducts.length}</strong> items
              {selectedCategory !== 'All' && <span> in <span className="font-semibold text-brand-800">{selectedCategory}</span></span>}
              {queryParam && <span> matching "<strong>{queryParam}</strong>"</span>}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-warm-200" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-warm-200 p-10 text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center mx-auto text-neutral-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg text-neutral-800">
                No products found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
                We couldn't find any items matching your current filters. Try resetting your search or price range.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
