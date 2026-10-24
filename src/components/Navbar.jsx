import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ArrowRight, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import storeConfig from '../config/storeConfig';

export default function Navbar() {
  const { itemCount, setIsCartOpen, notification } = useCart();
  const { settings } = useStore();
  const config = settings || storeConfig;
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navCategories = [
    { name: 'All Products', path: '/shop' },
    { name: 'Fashion Accessories', path: '/shop?category=Fashion%20Accessories' },
    { name: 'Home & Kitchen', path: '/shop?category=Home%20%26%20Kitchen' },
    { name: 'Everyday Gadgets', path: '/shop?category=Everyday%20Gadgets' },
    { name: 'Lifestyle Products', path: '/shop?category=Lifestyle%20Products' },
    { name: 'Under ₹499', path: '/shop?maxPrice=499', highlight: true }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-200">
      {/* Toast notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-float flex items-center gap-3 text-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. Announcement Bar */}
      {config.showAnnouncement !== false && config.announcementText && (
        <div className="bg-brand-800 text-white text-xs sm:text-sm py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="bg-brand-600 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                All India
              </span>
              <span className="font-medium truncate">{config.announcementText}</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-brand-100 flex-shrink-0">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-300" /> 100% Cash on Delivery
              </span>
              <a
                href={`https://wa.me/${(config.whatsappNumber || storeConfig.whatsappNumber).replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" /> Need Help? Chat Support
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-neutral-700 hover:text-brand-800 rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-800 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-brand-700 transition-colors">
              NP
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-neutral-900 flex items-center gap-1">
                Nammude<span className="text-brand-700">Picks</span>
              </span>
              <span className="hidden sm:block text-[10.5px] font-medium text-neutral-500 tracking-wide uppercase">
                {storeConfig.tagline}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gadgets, home finds, accessories..."
              className="w-full bg-warm-100/80 border border-warm-200 rounded-full py-2 pl-10 pr-4 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-brand-800 rounded-full"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Customer Support Help */}
          <a
            href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Support</span>
          </a>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-brand-800 hover:bg-brand-700 text-white px-3.5 py-2 rounded-full text-sm font-semibold transition-transform active:scale-95 shadow-sm"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {itemCount > 0 && (
              <span className="bg-amber-400 text-neutral-950 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center -ml-0.5">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-warm-100 bg-white">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 1000+ products across India..."
              className="w-full bg-warm-100 border border-warm-200 rounded-lg py-2.5 pl-10 pr-10 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand-800"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 3. Category Navigation Bar (Desktop) */}
      <nav className="hidden md:block border-t border-warm-100 bg-warm-50/70">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className={`font-medium transition-colors whitespace-nowrap ${
                  cat.highlight
                    ? 'text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-full font-bold hover:bg-amber-200'
                    : 'text-neutral-700 hover:text-brand-800'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="text-xs text-neutral-500 font-medium">
            Fast Pan-India Delivery • 100% Cash on Delivery
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[108px] bottom-0 bg-white z-50 overflow-y-auto p-5 border-t border-warm-200">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider font-bold text-neutral-400">
              Categories
            </div>
            <div className="space-y-2">
              {navCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl font-medium text-base ${
                    cat.highlight
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-neutral-800 hover:bg-warm-100'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <hr className="border-warm-200 my-4" />

            <div className="text-xs uppercase tracking-wider font-bold text-neutral-400">
              Customer Info
            </div>
            <div className="space-y-2 text-sm">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-neutral-700 hover:bg-warm-100 rounded-lg"
              >
                About Nammude Picks
              </Link>
              <Link
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-neutral-700 hover:bg-warm-100 rounded-lg"
              >
                Frequently Asked Questions
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-neutral-700 hover:bg-warm-100 rounded-lg"
              >
                Contact & Support
              </Link>
              <Link
                to="/returns-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-neutral-700 hover:bg-warm-100 rounded-lg"
              >
                Returns & Cancellation
              </Link>
            </div>

            <div className="pt-4">
              <a
                href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
