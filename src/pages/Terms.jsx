import React from 'react';
import storeConfig from '../config/storeConfig';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Terms of service and independent reseller disclosures
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-10 space-y-8 text-neutral-700 text-sm leading-relaxed">
        {/* Core Independent Reseller Disclaimer */}
        <div className="p-5 rounded-2xl bg-warm-100/80 border border-warm-200 space-y-2 text-xs text-neutral-800">
          <h3 className="font-bold uppercase tracking-wider text-neutral-900">
            Independent Storefront Disclosure
          </h3>
          <p>
            {storeConfig.independentResellerDisclaimer}
          </p>
          <p>
            Product names, descriptions, and packaging may refer to third-party manufacturers. {storeConfig.storeName} acts solely as an independent retail curator and reseller. We do not claim any official affiliation, joint venture, or endorsement from Meesho Inc. or any third-party brand unless explicitly documented.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            1. Nature of Order Requests
          </h2>
          <p>
            Submitting a checkout form on this website generates a <strong>Cash on Delivery (COD) order request</strong>. It does not constitute a legally binding sale until our team verifies:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Current stock availability with our wholesale supplier partners.</li>
            <li>Accurate selling price and delivery eligibility for your postal PIN code.</li>
            <li>Customer confirmation via WhatsApp.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            2. Pricing & Currency
          </h2>
          <p>
            All prices listed on this website are in Indian Rupees (INR - ₹). We reserve the right to modify prices, discontinue products, or correct typographical errors at any time prior to order confirmation. If a product price or stock status changes before order placement on the supplier platform, we will notify the customer via WhatsApp before fulfilling the order.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            3. Delivery & Courier Performance
          </h2>
          <p>
            While we make every effort to ensure packages arrive within our estimated 3 to 7 working days, delivery timelines are dependent on third-party courier services and regional conditions (such as severe monsoon weather or public holidays in Kerala). {storeConfig.storeName} is not liable for incidental delays caused by courier logistics.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            4. Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm">
            {storeConfig.storeName} shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use products purchased through our store. Our total liability is strictly limited to the purchase amount paid for the specific item in question.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-lg text-neutral-900">
            5. Governing Law & Jurisdiction
          </h2>
          <p className="text-xs sm:text-sm">
            These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts in Kerala, India.
          </p>
        </section>
      </div>
    </div>
  );
}
