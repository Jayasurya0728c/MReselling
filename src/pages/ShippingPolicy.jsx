import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';
import storeConfig from '../config/storeConfig';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Last updated: October 2026 • Applicable across all districts in Kerala
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-10 space-y-8 text-neutral-700 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-700" />
            1. Delivery Coverage Area
          </h2>
          <p>
            <strong>{storeConfig.storeName}</strong> delivers to addresses across all 14 districts in Kerala, including municipal city areas, taluks, and village panchayats served by major Indian courier networks (Delhivery, Shadowfax, Xpressbees, Ekart, India Post).
          </p>
          <div className="p-3.5 bg-warm-50 rounded-xl border border-warm-200 text-xs font-medium text-neutral-600">
            Operating Districts: {storeConfig.operatingDistricts.join(', ')}.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-700" />
            2. Estimated Delivery Time
          </h2>
          <p>
            Because we personally verify supplier inventory and handle quality checks before order dispatch:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Order Verification & Processing:</strong> 24 to 48 hours after customer confirms WhatsApp message.</li>
            <li><strong>Estimated Transit Time:</strong> 3 to 7 business days from dispatch date to reach your Kerala address.</li>
            <li>Remote or high-range hill areas (e.g. interior Wayanad, Idukki ghats) may take 1 to 2 additional days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-700" />
            3. Cash on Delivery (COD) Rules
          </h2>
          <p>
            To provide maximum peace of mind to our shoppers, we operate on a Cash on Delivery model:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>No advance payment or digital transfer is required prior to delivery.</li>
            <li>Please ensure exact cash is kept ready when the delivery executive arrives.</li>
            <li>Couriers do not allow opening sealed outer packages before payment is handed over. However, if the item inside is found defective after unboxing, our 5-day replacement policy protects you completely.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-700" />
            4. Shipping Charges
          </h2>
          <p>
            Standard shipping across Kerala is flat <strong>₹{storeConfig.deliveryFee}</strong> per order request. Orders above <strong>₹{storeConfig.freeShippingThreshold}</strong> automatically qualify for <strong>FREE Delivery</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            5. Tracking and Notifications
          </h2>
          <p>
            Once your order is verified and dispatched by the supplier, we will send you the courier tracking link via WhatsApp so you can monitor parcel movement in real-time.
          </p>
        </section>
      </div>
    </div>
  );
}
