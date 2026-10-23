import React, { useState } from 'react';
import { MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import storeConfig from '../config/storeConfig';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    
    // Redirect to WhatsApp with prefilled inquiry
    const text = `Hi Nammude Picks!\nMy Name: ${form.name}\nPhone: ${form.phone || 'N/A'}\nInquiry: ${form.message}`;
    const url = `https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900">
          Contact & Customer Care
        </h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          Need help with your order, product specifications, or delivery? We are here to help in Malayalam or English.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">WhatsApp Support</h3>
            <p className="text-xs text-neutral-600">
              For instant queries, order tracking, and delivery confirmations:
            </p>
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message {storeConfig.whatsappDisplay}</span>
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900">Email Address</h3>
            <p className="text-xs text-neutral-600">
              For business inquiries, collaborations, and formal requests:
            </p>
            <a
              href={`mailto:${storeConfig.contactEmail}`}
              className="text-sm font-semibold text-brand-800 hover:underline"
            >
              {storeConfig.contactEmail}
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-warm-200 shadow-soft space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
              <Clock className="w-4 h-4 text-brand-700" />
              <span>Customer Support Hours</span>
            </div>
            <p className="text-xs text-neutral-700">
              Monday to Saturday: <strong>9:30 AM – 8:30 PM</strong> <br />
              Sunday: <strong>11:00 AM – 6:00 PM</strong>
            </p>
          </div>
        </div>

        {/* Quick Message Box */}
        <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-8 space-y-5">
          <h2 className="font-display font-bold text-lg text-neutral-900 pb-2 border-b border-warm-100">
            Send Quick Inquiry
          </h2>

          {sent ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">WhatsApp Window Opened!</div>
              <p className="text-xs text-emerald-800">
                Please hit 'Send' in WhatsApp to complete your message to our support team.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul"
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit number"
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Your Message or Question
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Ask about a product, delivery time to your pincode, etc..."
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send to WhatsApp Support</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
