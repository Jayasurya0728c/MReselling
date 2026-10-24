import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Flame,
  Tag,
  Layers
} from 'lucide-react';
import InstagramIcon from '../components/InstagramIcon';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/dataService';
import storeConfig from '../config/storeConfig';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts({ isAdmin: false });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products on home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const under499Products = products.filter(p => p.price <= 499).slice(0, 4);

  const categoriesList = [
    {
      name: 'Fashion Accessories',
      desc: 'Traditional jewelry, sunglasses & bags',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      path: '/shop?category=Fashion%20Accessories'
    },
    {
      name: 'Home & Kitchen',
      desc: 'Automatic pumps, slicers & mugs',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      path: '/shop?category=Home%20%26%20Kitchen'
    },
    {
      name: 'Everyday Gadgets',
      desc: 'Wireless mics, mini fans & mounts',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      path: '/shop?category=Everyday%20Gadgets'
    },
    {
      name: 'Lifestyle Products',
      desc: 'Jute totes, sunset lamps & tumblers',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
      path: '/shop?category=Lifestyle%20Products'
    }
  ];

  const faqs = [
    {
      q: 'How does Cash on Delivery (COD) work on Nammude Picks?',
      a: 'You can order without paying anything online! Simply add items to your bag, fill in your delivery address at checkout, and place your order. You pay only in cash or UPI when our courier delivers the package to your doorstep.'
    },
    {
      q: 'Do you deliver across all states in India?',
      a: 'Yes! We deliver across all 28 states and union territories in India. Standard delivery takes 3 to 7 business days depending on your postal PIN code.'
    },
    {
      q: 'How are orders confirmed and processed?',
      a: 'Your order is submitted directly through our website into our administrative order management system. Our team verifies stock, packages the item, and ships it via reliable courier partners with door-to-door tracking.'
    },
    {
      q: 'Is Nammude Picks an official Meesho website?',
      a: 'No. Nammude Picks is an independent curated shopping store. We handpick trending products and personally coordinate fulfillment with reliable verified suppliers across India (including manufacturers and reseller platforms like Meesho). We handle quality checks, customer support, and local communication directly.'
    },
    {
      q: 'What is your return policy if the item is damaged?',
      a: 'We offer hassle-free replacement for items received damaged or defective. We strictly require an unedited package unboxing video recorded from the moment the sealed parcel is opened to approve returns with our supplier partners.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-warm-100/70 via-warm-50 to-white pt-8 pb-16 md:py-20 border-b border-warm-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-900 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-brand-700" />
                <span>Curated for Smart Homes & Creators Across India</span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-neutral-950 tracking-tight leading-[1.15]">
                Nalla Finds. <br className="hidden sm:inline" />
                <span className="text-brand-700">Nalla Prices.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover useful, stylish and affordable finds for everyday life. Handpicked accessories, viral gadgets, and home essentials with 100% Cash on Delivery across India.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-800 hover:bg-brand-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-card hover:shadow-float transition-all active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-warm-100 border border-warm-300 text-neutral-800 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <ShoppingBag className="w-5 h-5 text-brand-700" />
                  <span>Explore Collection</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-warm-200/80 text-left">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-700 flex-shrink-0" />
                  <span className="text-xs text-neutral-700 font-medium">100% Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-700 flex-shrink-0" />
                  <span className="text-xs text-neutral-700 font-medium">Pan-India Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-700 flex-shrink-0" />
                  <span className="text-xs text-neutral-700 font-medium">Curated Quality</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
                  alt="Curated Indian Jewelry and Lifestyle Finds"
                  className="w-full h-[380px] sm:h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="bg-amber-400 text-neutral-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full w-max mb-2">
                    Curated Festive Pick
                  </span>
                  <h3 className="font-display font-bold text-lg">Traditional Palakka Choker</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-extrabold text-amber-300">₹349 <span className="text-xs text-neutral-300 line-through">₹599</span></span>
                    <Link
                      to="/product/kerala-palakka-motif-choker-necklace"
                      className="px-4 py-1.5 bg-white text-neutral-900 rounded-full text-xs font-bold hover:bg-neutral-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-4 -left-4 sm:left-2 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-float border border-warm-200 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-800 font-bold">
                  🌴
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900">Direct Delivery Across India</div>
                  <div className="text-[11px] text-neutral-500">Pay cash or UPI upon delivery at your door</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Handpicked Collections
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categoriesList.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group relative rounded-2xl overflow-hidden bg-white border border-warm-200 shadow-soft hover:shadow-card transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden bg-warm-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-brand-800 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{cat.desc}</p>
                <div className="mt-2 text-xs font-semibold text-brand-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Editor's Choice
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
              Featured Finds
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>See All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-72 border border-warm-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Trending Products Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 relative z-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-current" /> Viral On Instagram Reels
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
                Trending Across India
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md">
                Fast-moving gadgets, lifestyle products, and viral finds popular on Instagram and online creators.
              </p>
            </div>
            <Link
              to="/shop?sort=popular"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-3 sm:mt-0"
            >
              <span>Explore Trending</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Under ₹499 Value Corner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border border-amber-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> Pocket Friendly Finds
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
                Under ₹499 Corner
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                Everyday essentials that don't pinch your pocket. Perfect for adding to cart.
              </p>
            </div>
            <Link
              to="/shop?maxPrice=499"
              className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>View All Under ₹499</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {under499Products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Instagram & Malayalam Marketing Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border border-warm-200 rounded-3xl p-6 sm:p-10 bg-white shadow-soft text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold">
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Follow Our Malayalam Reels</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
              Watch Honest Demo Videos Before You Buy!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We test products and share real Malayalam video unboxings and Reels. Follow <strong>{storeConfig.instagramHandle}</strong> to catch flash drops, promo codes, and honest reviews.
            </p>
          </div>

          <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={storeConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow on Instagram</span>
            </a>
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask a Question</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. Verified Store Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Why Nammude Picks</span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
            Verified Shopping Experience
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Transparent curated commerce delivering across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-warm-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Zero Online Payment Risk</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Pay 100% in cash only after the package reaches your hands. No credit card or advance UPI required.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-warm-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Hand-Verified Products</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              We check supplier ratings, customer reviews, and actual product photos before listing any item on our store.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-warm-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Pan-India Delivery</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Fast courier dispatch to villages, towns, and cities across India within 3 to 7 working days.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-warm-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-neutral-900">Dedicated Support Care</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Have doubts about sizing, color, or delivery? Chat directly with our customer team on WhatsApp in English, Hindi, or Malayalam.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Clear Answers
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="bg-white border border-warm-200 rounded-2xl overflow-hidden transition-colors shadow-soft"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-neutral-900 hover:text-brand-800"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-warm-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
