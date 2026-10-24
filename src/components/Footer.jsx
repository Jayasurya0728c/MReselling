import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import storeConfig from '../config/storeConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-14 pb-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value props banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/40">
            <div className="p-3 rounded-xl bg-brand-900 text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Cash on Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1">Pay comfortably in cash only when your parcel reaches your doorstep.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/40">
            <div className="p-3 rounded-xl bg-brand-900 text-brand-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Pan-India Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1">Delivering across all 28 states & 8 union territories via trusted national couriers.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-800/40 border border-neutral-700/40">
            <div className="p-3 rounded-xl bg-brand-900 text-brand-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Fast Dispatch & Tracking</h4>
              <p className="text-xs text-neutral-400 mt-1">Real-time courier tracking updates from our team to your doorstep.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-base">
                NP
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Nammude<span className="text-brand-400">Picks</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Curated everyday finds, viral gadgets, kitchen essentials, and traditional accessories for smart homes across India.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={storeConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Follow us on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase text-xs">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Fashion%20Accessories" className="hover:text-white transition-colors">
                  Fashion Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Home%20%26%20Kitchen" className="hover:text-white transition-colors">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Everyday%20Gadgets" className="hover:text-white transition-colors">
                  Everyday Gadgets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Lifestyle%20Products" className="hover:text-white transition-colors">
                  Lifestyle Products
                </Link>
              </li>
              <li>
                <Link to="/shop?maxPrice=499" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Under ₹499 Finds
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase text-xs">
              Store Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/returns-policy" className="hover:text-white transition-colors">
                  Cancellation, Return & Refund
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Coverage */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase text-xs">
              Customer Support
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-neutral-300 font-medium">WhatsApp Assistance</div>
                  <a
                    href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    Click to Chat (10 AM - 8 PM)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-neutral-300 font-medium">Email</div>
                  <a href={`mailto:${storeConfig.contactEmail}`} className="hover:text-white">
                    {storeConfig.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-neutral-300 font-medium">Coverage</div>
                  <div className="text-neutral-400 text-[11px]">Pan-India (All 28 States & UTs)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimers & Copyright */}
        <div className="pt-8 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-4">
          <div className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50 text-neutral-300 leading-relaxed">
            <span className="font-semibold text-white">Independent Store Disclaimer:</span> {storeConfig.independentResellerDisclaimer}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400">
            <div>
              © {currentYear} {storeConfig.storeName}. All rights reserved. Curated for smart shoppers across India.
            </div>
            <div className="flex items-center gap-4 text-neutral-400 text-xs">
              <span>Delivering Across India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
