import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Truck, MessageCircle } from 'lucide-react';
import storeConfig from '../config/storeConfig';

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Our Story
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900">
          About {storeConfig.storeName}
        </h1>
        <p className="text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Bringing carefully curated, affordable lifestyle finds, viral gadgets, and quality fashion right to your doorstep across India.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-10 space-y-8 text-neutral-700 text-sm leading-relaxed">
        <div className="space-y-3">
          <h2 className="font-display font-bold text-xl text-neutral-900">
            Who We Are
          </h2>
          <p>
            Welcome to <strong>{storeConfig.storeName}</strong> ("Our Picks"). We are an independent Indian online reselling and curated lifestyle initiative. In a crowded internet filled with low-quality copies and unreliable delivery promises, our mission is simple: <em>we spend hours researching, testing, and selecting only genuinely useful and stylish products that offer honest value for money</em>.
          </p>
          <p>
            Whether it's a traditional Palakka necklace for an upcoming family wedding, a smart automatic water can pump for your kitchen, or a wireless lapel microphone for your Instagram content creation, we make sure each product is worth your hard-earned money.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-warm-100">
          <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Curated with Care</h3>
            <p className="text-xs text-neutral-600">
              We don't list thousands of random items. Every item on our store is handpicked based on real customer feedback, quality materials, and affordability.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-neutral-900 text-base">100% Cash on Delivery</h3>
            <p className="text-xs text-neutral-600">
              Zero online payment risk. You only pay in cash when the delivery courier delivers the parcel safely to your doorstep.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Direct Customer Updates</h3>
            <p className="text-xs text-neutral-600">
              No robotic support tickets. You receive prompt personal updates from our team for order confirmation, dispatch, and courier tracking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-warm-50 border border-warm-200 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Pan-India Delivery</h3>
            <p className="text-xs text-neutral-600">
              Across all 28 states and 8 union territories, our national courier partners ensure reliable Cash on Delivery within 3 to 7 working days.
            </p>
          </div>
        </div>

        {/* Independent Reseller Notice */}
        <div className="p-5 rounded-2xl bg-warm-100/70 border border-warm-200 space-y-2 text-xs">
          <h4 className="font-bold text-neutral-900 uppercase tracking-wider">
            Transparency & Fulfilment Model
          </h4>
          <p>
            {storeConfig.independentResellerDisclaimer}
          </p>
          <p>
            When you place an order request on our site, we manually verify stock availability and pricing with our verified suppliers (including manufacturers and trusted reselling platforms like Meesho). Once verified, we place the order on your behalf and monitor courier delivery until it reaches your hands.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500">
            Have questions or want to collaborate?
          </div>
          <a
            href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
