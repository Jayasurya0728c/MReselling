import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/orderUtils';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has variants, navigate to details to pick variant
    if (product.variants && product.variants.length > 0 && product.variants[0].options?.length > 1) {
      navigate(`/product/${product.slug || product.id}`);
      return;
    }

    addToCart(product, product.variants?.[0]?.options?.[0] || '', 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 0 && product.variants[0].options?.length > 1) {
      navigate(`/product/${product.slug || product.id}`);
      return;
    }

    addToCart(product, product.variants?.[0]?.options?.[0] || '', 1);
    navigate('/checkout');
  };

  return (
    <div className="group bg-white rounded-2xl border border-warm-200/90 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image Container */}
      <Link
        to={`/product/${product.slug || product.id}`}
        className="block relative aspect-square overflow-hidden bg-warm-100"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {!product.inStock && (
            <span className="bg-neutral-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Out of Stock
            </span>
          )}

          {product.inStock && product.isTrending && (
            <span className="bg-amber-500 text-neutral-950 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" /> Trending
            </span>
          )}

          {product.inStock && !product.isTrending && product.isFeatured && (
            <span className="bg-brand-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}

          {product.price <= 499 && (
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Under ₹499
            </span>
          )}
        </div>

        {/* Savings Badge */}
        {hasDiscount && product.inStock && (
          <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-lg shadow-sm">
            Save {discountPercent}%
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider">
            {product.category}
          </span>

          <Link to={`/product/${product.slug || product.id}`}>
            <h3 className="font-semibold text-sm sm:text-base text-neutral-900 mt-1 line-clamp-2 hover:text-brand-800 transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
              {product.shortDescription}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-warm-100">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-extrabold text-neutral-900 font-display">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {product.inStock ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleQuickAdd}
                className="w-full py-2 px-2.5 rounded-xl border border-warm-300 hover:border-brand-700 text-neutral-800 hover:text-brand-800 bg-warm-50 hover:bg-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                title="Add to Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-2 px-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-sm"
              >
                <span>Buy COD</span>
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-semibold cursor-not-allowed text-center"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
