import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';
import storeConfig from '../config/storeConfig';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          How we handle customer data with integrity and respect
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-10 space-y-8 text-neutral-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-700" />
            1. What Information We Collect
          </h2>
          <p>
            When you place an order request on <strong>{storeConfig.storeName}</strong>, we collect only the necessary details required to complete physical shipping and communication:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Your full name.</li>
            <li>Your 10-digit Indian mobile / contact phone number.</li>
            <li>Your complete postal delivery address across India (house/flat name, locality, city/town, state, and 6-digit PIN code).</li>
            <li>Any specific delivery instructions you provide.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-brand-700" />
            2. No Local Storage of Personal Address Data
          </h2>
          <p>
            In accordance with high privacy standards, <strong>we do not save your delivery address, phone number, or names inside browser cookies or localStorage</strong>. Only your shopping bag items (product IDs and quantities) are saved in localStorage to persist your bag across refreshes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-700" />
            3. How Your Information Is Used
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>To verify your order request and check product availability.</li>
            <li>To submit shipping details to our fulfillment supplier and logistics courier.</li>
            <li>To send you WhatsApp updates regarding order confirmation and courier tracking.</li>
            <li><strong>We NEVER sell, rent, or trade your personal information to third-party telemarketers or advertisers.</strong></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            4. Order Placement & Third-Party Platforms
          </h2>
          <p className="text-xs sm:text-sm">
            Orders are placed directly on our website and securely stored in our backend order management system. If you contact our support team via WhatsApp, your interactions on that platform are governed by Meta's privacy policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            5. Contacting Us About Your Data
          </h2>
          <p className="text-xs sm:text-sm">
            If you wish to request the deletion of your order contact history from our customer records, please email us at <strong>{storeConfig.contactEmail}</strong> or message us on WhatsApp.
          </p>
        </section>
      </div>
    </div>
  );
}
