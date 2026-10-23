import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import storeConfig from '../config/storeConfig';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);

  const categories = [
    {
      category: 'Ordering & Payment',
      questions: [
        {
          q: 'Do I have to pay anything in advance?',
          a: 'No! All orders on Nammude Picks are 100% Cash on Delivery (COD). You do not need a debit card, credit card, or advance UPI. You only pay the courier when the package reaches your house.'
        },
        {
          q: 'Why does the checkout redirect me to WhatsApp?',
          a: 'We operate a personal, verified fulfillment model. Sending the pre-filled WhatsApp message lets our customer team verify your shipping address, check live supplier stock, and confirm your order before dispatch.'
        },
        {
          q: 'Can I cancel my order if I change my mind?',
          a: 'Yes, you can cancel your order request at any time before dispatch by messaging our WhatsApp number. Once dispatched with a live courier tracking number, orders cannot be cancelled mid-transit.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery in Kerala',
      questions: [
        {
          q: 'How many days will it take for my order to reach Kerala?',
          a: 'Delivery typically takes 3 to 7 business days from order confirmation. City centers like Kochi, Kozhikode, and Thiruvananthapuram generally receive orders in 3 to 4 days, while rural and high-range areas take 5 to 7 days.'
        },
        {
          q: 'How much do you charge for shipping?',
          a: `Standard shipping across Kerala is flat ₹${storeConfig.deliveryFee}. However, if your cart subtotal is ₹${storeConfig.freeShippingThreshold} or higher, delivery is completely FREE!`
        },
        {
          q: 'Can I open the parcel before paying the courier?',
          a: 'Standard courier policies across India do not permit opening sealed outer parcels before paying the COD amount. However, if the item inside is defective or damaged, you are protected by our 5-day replacement policy.'
        }
      ]
    },
    {
      category: 'Returns & Product Quality',
      questions: [
        {
          q: 'What should I do when receiving my parcel?',
          a: 'Always record an unedited unboxing video on your phone starting from the sealed outer package showing the courier label clearly. This video is required if you ever need to report a transit damage or incorrect item.'
        },
        {
          q: 'How do replacements work?',
          a: 'If you receive a defective or incorrect product, send your unboxing video and order reference to our WhatsApp within 5 days of delivery. We will review and arrange a free replacement or approved UPI refund.'
        },
        {
          q: 'Are these products original quality?',
          a: 'Yes! We personally check supplier ratings, customer reviews, and actual product photos before listing any item on our website.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" /> Help Center
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          Everything you need to know about shopping, delivery across Kerala, and Cash on Delivery.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((cat, catIdx) => (
          <div key={cat.category} className="space-y-3">
            <h2 className="font-display font-bold text-lg text-neutral-900 pl-1">
              {cat.category}
            </h2>
            <div className="space-y-2.5">
              {cat.questions.map((item, itemIdx) => {
                const id = `${catIdx}-${itemIdx}`;
                const isOpen = openIdx === id;
                return (
                  <div
                    key={item.q}
                    className="bg-white border border-warm-200 rounded-2xl overflow-hidden shadow-soft transition-colors"
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-neutral-900 hover:text-brand-800"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? 'rotate-180 text-brand-700' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-warm-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
        <h3 className="font-bold text-neutral-900 text-base">Still have questions?</h3>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
          Our customer team is available on WhatsApp to answer any specific inquiries about products or delivery.
        </p>
        <a
          href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
