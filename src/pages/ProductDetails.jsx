import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Share2,
  Sparkles
} from 'lucide-react';
import { fetchProductBySlug, fetchProducts } from '../lib/dataService';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/orderUtils';
import storeConfig from '../config/storeConfig';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const found = await fetchProductBySlug(slug, { isAdmin: false });
        if (found) {
          setProduct(found);
          setSelectedImage(found.image);

          // Initialize variants
          if (found.variants && found.variants.length > 0) {
            const initial = {};
            found.variants.forEach((v) => {
              if (v.options && v.options.length > 0) {
                initial[v.name] = v.options[0];
              }
            });
            setSelectedVariants(initial);
          }

          // Fetch related
          const all = await fetchProducts({ isAdmin: false });
          const related = all
            .filter((p) => p.category === found.category && p.id !== found.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-white rounded-3xl h-96 border border-warm-200" />
          <div className="space-y-4">
            <div className="h-4 bg-warm-200 rounded w-1/4" />
            <div className="h-8 bg-warm-200 rounded w-3/4" />
            <div className="h-6 bg-warm-200 rounded w-1/3" />
            <div className="h-32 bg-warm-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-neutral-900">
          Product Not Found
        </h2>
        <p className="text-sm text-neutral-500">
          The item you are looking for may have been updated or moved.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-full bg-brand-800 text-white font-semibold text-xs"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Selected variant string for cart (e.g. "Emerald Green / Standard")
  const variantString = Object.values(selectedVariants).filter(Boolean).join(' / ');

  const handleAddToCart = () => {
    addToCart(product, variantString, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, variantString, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Nammude Picks!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-neutral-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-neutral-900">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-neutral-900 font-medium">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-warm-200/90 shadow-soft">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold px-3 py-1 rounded-xl shadow-sm">
                Save {discountPercent}%
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-neutral-700 hover:text-brand-800 shadow-sm transition-colors"
              title="Share product link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="absolute top-14 right-4 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                Link copied!
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-brand-700 ring-2 ring-brand-200'
                      : 'border-warm-200 hover:border-warm-300 opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Info (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Category */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              {product.isTrending && (
                <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Viral Pick
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-neutral-950 leading-tight">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-warm-100/60 border border-warm-200/80 flex items-baseline gap-3">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-950">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-neutral-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {discountPercent}% OFF
                </span>
              </>
            )}
            <span className="text-xs text-neutral-500 ml-auto font-medium">
              Taxes included
            </span>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.map((v) => (
            <div key={v.name} className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                Select {v.name}: <span className="text-brand-800 font-semibold">{selectedVariants[v.name]}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {v.options?.map((opt) => {
                  const isSelected = selectedVariants[v.name] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants({ ...selectedVariants, [v.name]: opt })}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'border-brand-700 bg-brand-800 text-white shadow-sm'
                          : 'border-warm-300 bg-white text-neutral-800 hover:bg-warm-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity Controls & Purchase Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Quantity:
              </label>
              <div className="flex items-center border border-warm-300 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 px-3 text-neutral-600 hover:bg-warm-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 px-3 text-neutral-600 hover:bg-warm-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            {product.inStock ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 rounded-2xl border-2 border-brand-800 text-brand-900 bg-brand-50 hover:bg-brand-100 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-800" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-2xl bg-brand-800 hover:bg-brand-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-card hover:shadow-float transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current text-amber-400" />
                  <span>Order with Cash on Delivery</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-neutral-100 text-neutral-500 font-bold text-sm text-center">
                Currently Out of Stock
              </div>
            )}
          </div>

          {/* Quick Pan-India COD & Trust Badges */}
          <div className="p-4 rounded-2xl bg-white border border-warm-200 shadow-soft space-y-3 text-xs">
            <div className="flex items-center gap-3 text-neutral-800 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>100% Cash on Delivery (COD):</strong> Pay cash when your parcel is delivered at home.
              </span>
            </div>
            <div className="flex items-center gap-3 text-neutral-800 font-medium">
              <Truck className="w-5 h-5 text-brand-700 flex-shrink-0" />
              <span>
                <strong>Pan-India Delivery:</strong> Ships across all states in India in 3 to 7 working days.
              </span>
            </div>
            <div className="flex items-center gap-3 text-neutral-800 font-medium">
              <RotateCcw className="w-5 h-5 text-brand-700 flex-shrink-0" />
              <span>
                <strong>5-Day Replacement:</strong> In case of defect (unedited unboxing video required).
              </span>
            </div>
          </div>

          {/* WhatsApp Direct Help */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Have questions about this product? Chat with customer support.</span>
            </div>
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Nammude Picks, I have a question about ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-emerald-800 hover:text-emerald-950 flex-shrink-0 ml-2"
            >
              Ask on WhatsApp
            </a>
          </div>

          {/* Full Description */}
          <div className="pt-4 border-t border-warm-200">
            <h3 className="font-display font-bold text-base text-neutral-900 mb-3">
              Product Overview & Specifications
            </h3>
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-3 whitespace-pre-line">
              {product.description}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-warm-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">You Might Also Like</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-900 mt-1">
                More from {product.category}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
