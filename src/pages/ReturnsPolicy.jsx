import React from 'react';
import { RotateCcw, AlertTriangle, Video, CheckCircle2, MessageCircle } from 'lucide-react';
import storeConfig from '../config/storeConfig';

export default function ReturnsPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900">
          Cancellation, Return & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Transparent, honest terms for {storeConfig.storeName} customers across India
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-10 space-y-8 text-neutral-700 text-sm leading-relaxed">
        {/* Unboxing Video Requirement Alert */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-amber-950">
          <div className="flex items-center gap-2 font-bold text-base text-amber-900">
            <Video className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <span>MANDATORY: 360° Parcel Unboxing Video Required</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            Because we fulfill orders via trusted Indian supplier networks, <strong>a single, continuous, unedited unboxing video</strong> recorded from the sealed outer packet is mandatory to process any claim for damaged, missing, or incorrect items. Please record your package opening on your mobile phone before unsealing.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-brand-700" />
            1. Order Cancellation Policy
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Before Dispatch:</strong> You may cancel your COD order request at zero charge by messaging us on WhatsApp before the supplier has dispatched the parcel.</li>
            <li><strong>After Dispatch:</strong> Once a parcel is handed over to the courier partner and a tracking ID is generated, the order cannot be cancelled in transit.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-700" />
            2. Eligible Return & Replacement Scenarios
          </h2>
          <p>
            Returns and replacements are accepted within <strong>5 calendar days</strong> from delivery date under the following circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Physical transit damage to the product.</li>
            <li>Manufacturing defects or non-functioning electronics.</li>
            <li>Wrong product, color, or variant received compared to what was ordered.</li>
            <li>Missing items from the parcel.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            3. Non-Returnable Items
          </h2>
          <p className="text-xs sm:text-sm">
            Due to hygiene and logistics constraints, personal hygiene products, items without original tags/packaging, or items damaged due to customer misuse cannot be returned.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            4. How to Initiate a Return or Replacement
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
            <li>Within 5 days of delivery, message us on WhatsApp: <strong>{storeConfig.whatsappDisplay}</strong>.</li>
            <li>Provide your <strong>Order Reference (e.g. NP-202610-XXXX)</strong> and phone number.</li>
            <li>Attach the <strong>clear unboxing video</strong> and photo of the parcel shipping label.</li>
            <li>Our team will verify with the supplier and arrange reverse pickup or send a free replacement.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            5. Refunds on COD Orders
          </h2>
          <p className="text-xs sm:text-sm">
            Since orders are paid in Cash on Delivery, approved refunds (if a replacement cannot be provided due to out-of-stock items) will be transferred directly to your Google Pay, PhonePe, or bank account via UPI within 2 to 4 working days after reverse pickup verification.
          </p>
        </section>

        <div className="pt-4 border-t border-warm-100 flex items-center justify-between">
          <span className="text-xs text-neutral-500">Need help with a delivered order?</span>
          <a
            href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Customer Care</span>
          </a>
        </div>
      </div>
    </div>
  );
}
