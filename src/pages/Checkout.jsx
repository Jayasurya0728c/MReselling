import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { createOrder } from '../lib/dataService';
import { formatCurrency, formatWhatsAppOrderMessage, buildWhatsAppOrderUrl } from '../utils/orderUtils';
import storeConfig from '../config/storeConfig';

export default function Checkout() {
  const { cart, subtotal, shippingFee, totalCODAmount, clearCart } = useCart();
  const { settings } = useStore();
  const config = settings || storeConfig;
  const navigate = useNavigate();

  // Form state (NEVER saved to localStorage to protect privacy)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    houseName: '',
    streetLocality: '',
    postOffice: '',
    district: 'Ernakulam',
    state: 'Kerala',
    pincode: '',
    deliveryInstructions: '',
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Post-submission state
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittedOrderRef, setSubmittedOrderRef] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [copiedMessage, setCopiedMessage] = useState(false);

  // If cart is empty and not submitted yet, show empty state
  if (cart.length === 0 && !orderSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-neutral-900">
          No items in bag
        </h2>
        <p className="text-sm text-neutral-500">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-full bg-brand-800 text-white font-bold text-xs"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs = {};

    if (!formData.customerName.trim()) {
      errs.customerName = 'Please enter your full name';
    }

    const cleanPhone = formData.customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errs.customerPhone = 'Enter a valid 10-digit Indian mobile number (starting with 6-9)';
    }

    if (!formData.houseName.trim()) {
      errs.houseName = 'House name or building number is required';
    }

    if (!formData.streetLocality.trim()) {
      errs.streetLocality = 'Street or locality is required';
    }

    if (!formData.postOffice.trim()) {
      errs.postOffice = 'Post office is required for postal delivery';
    }

    if (!formData.district) {
      errs.district = 'Please select your Kerala district';
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errs.pincode = 'Enter a valid 6-digit Indian PIN code';
    }

    if (!formData.consent) {
      errs.consent = 'You must consent to sharing your details for order verification and fulfillment';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      // 1. Prepare items payload
      const orderItems = cart.map(item => ({
        productId: item.productId,
        name: item.name,
        variant: item.variant || '',
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity
      }));

      // 2. Save order record
      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.replace(/\D/g, ''),
        houseName: formData.houseName.trim(),
        streetLocality: formData.streetLocality.trim(),
        postOffice: formData.postOffice.trim(),
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode.trim(),
        deliveryInstructions: formData.deliveryInstructions.trim(),
        items: orderItems,
        subtotal,
        shippingFee,
        totalAmount: totalCODAmount
      };

      const result = await createOrder(orderPayload);

      if (result.success) {
        const ref = result.reference;
        setSubmittedOrderRef(ref);

        // 3. Generate standard WhatsApp message
        const msg = formatWhatsAppOrderMessage({
          reference: ref,
          ...orderPayload
        });
        setWhatsappMessage(msg);

        // 4. Open WhatsApp automatically
        const whatsappUrl = buildWhatsAppOrderUrl(msg, config.whatsappNumber || storeConfig.whatsappNumber);
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // 5. Clear cart from localStorage
        clearCart();
        setOrderSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('There was an issue processing your order. Please try again or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // SUCCESS SCREEN
  if (orderSubmitted) {
    const directWaUrl = buildWhatsAppOrderUrl(whatsappMessage, storeConfig.whatsappNumber);

    return (
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16 space-y-8">
        <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Order Request Received
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
              Order Reference: <span className="text-brand-800">{submittedOrderRef}</span>
            </h1>
            <p className="text-sm text-neutral-600 max-w-lg mx-auto">
              Thank you, <strong>{formData.customerName}</strong>! Your Cash on Delivery order request has been logged in our system.
            </p>
          </div>

          {/* CRITICAL IMPORTANT CLARIFICATION BANNER */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-2 text-xs sm:text-sm text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Next Mandatory Step: Send your WhatsApp message!</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Opening WhatsApp does not automatically mean the order has been delivered or accepted. Our team must manually verify product stock, pricing, and courier delivery to your Kerala PIN code on Meesho/supplier networks before confirming fulfillment. Please click the button below if WhatsApp did not open automatically.
            </p>
          </div>

          {/* WhatsApp Button & Copy Message Fallback */}
          <div className="space-y-3 pt-2">
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-card hover:shadow-float transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Order Message on WhatsApp</span>
            </a>

            <button
              onClick={handleCopyMessage}
              className="w-full py-3 px-4 rounded-xl border border-warm-300 bg-warm-50 hover:bg-white text-neutral-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedMessage ? 'Order Message Copied to Clipboard!' : 'Copy Order Text to Clipboard (Fallback)'}</span>
            </button>
          </div>

          {/* Pre-formatted Message Preview */}
          <div className="text-left pt-4 border-t border-warm-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Order Message Preview:
            </h4>
            <pre className="p-4 rounded-2xl bg-warm-100 border border-warm-200/80 text-xs text-neutral-800 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {whatsappMessage}
            </pre>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs">
            <Link
              to="/shop"
              className="px-6 py-2.5 rounded-full bg-brand-800 text-white font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // CHECKOUT FORM SCREEN
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950">
          Cash on Delivery Checkout
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Zero upfront payment. Enter your Kerala delivery details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checkout Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-warm-200 pb-3 flex items-center justify-between">
              <h2 className="font-display font-bold text-base text-neutral-900">
                1. Customer & Delivery Address
              </h2>
              <span className="text-[11px] font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded">
                Kerala Shipping
              </span>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Arun Kumar / Ananya Menon"
                className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.customerName ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                }`}
              />
              {errors.customerName && (
                <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                WhatsApp / Mobile Number (10 digits) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value.replace(/\D/g, '') })}
                  placeholder="9847123456"
                  className={`w-full bg-warm-50 border rounded-xl p-3 pl-14 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.customerPhone ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                  }`}
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                We will send delivery tracking and order updates to this WhatsApp number.
              </p>
              {errors.customerPhone && (
                <p className="text-xs text-red-600 mt-1">{errors.customerPhone}</p>
              )}
            </div>

            {/* House / Flat name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                House Name / Building / Flat No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.houseName}
                onChange={(e) => setFormData({ ...formData, houseName: e.target.value })}
                placeholder="e.g. Sreenilayam House / Flat 3B, Skyline Apartments"
                className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.houseName ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                }`}
              />
              {errors.houseName && (
                <p className="text-xs text-red-600 mt-1">{errors.houseName}</p>
              )}
            </div>

            {/* Street / Locality & Post Office */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Street / Locality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.streetLocality}
                  onChange={(e) => setFormData({ ...formData, streetLocality: e.target.value })}
                  placeholder="e.g. Near Temple Road"
                  className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.streetLocality ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                  }`}
                />
                {errors.streetLocality && (
                  <p className="text-xs text-red-600 mt-1">{errors.streetLocality}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Post Office / Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.postOffice}
                  onChange={(e) => setFormData({ ...formData, postOffice: e.target.value })}
                  placeholder="e.g. Kaloor SO / Edappally"
                  className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.postOffice ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                  }`}
                />
                {errors.postOffice && (
                  <p className="text-xs text-red-600 mt-1">{errors.postOffice}</p>
                )}
              </div>
            </div>

            {/* District, State & Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                >
                  {storeConfig.operatingDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.state}
                  className="w-full bg-warm-200/50 border border-warm-300 rounded-xl p-3 text-sm text-neutral-600 cursor-not-allowed font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  PIN Code (6 digits) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="682017"
                  className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.pincode ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Optional Delivery Instructions */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.deliveryInstructions}
                onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                placeholder="e.g. Call before delivery, landmark near petrol pump..."
                className="w-full bg-warm-50 border border-warm-300 rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>

            {/* Privacy & Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 rounded text-brand-700 focus:ring-brand-700 h-4 w-4 accent-brand-700 flex-shrink-0"
                />
                <span className="text-xs text-neutral-600 leading-relaxed">
                  I consent to sharing my order and delivery details with <strong>{storeConfig.storeName}</strong> strictly for manual order verification, communication, and shipping fulfillment. <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.consent && (
                <p className="text-xs text-red-600 mt-1 ml-7">{errors.consent}</p>
              )}
            </div>

            {/* Payment Method Notice */}
            <div className="p-4 rounded-2xl bg-warm-100/70 border border-warm-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                <span>Payment Method</span>
                <span className="text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                  Cash on Delivery (COD)
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                No advance payment is needed. Please keep exact cash of <strong>{formatCurrency(totalCODAmount)}</strong> ready upon parcel delivery.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-brand-800 hover:bg-brand-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-card hover:shadow-float transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <span>Generating Order Request...</span>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  <span>Send COD Order via WhatsApp</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-warm-200 shadow-soft p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-warm-100">
            <h3 className="font-display font-bold text-base text-neutral-900">
              Order Items ({cart.length})
            </h3>
            <Link to="/cart" className="text-xs text-brand-800 font-semibold hover:underline">
              Edit Bag
            </Link>
          </div>

          {/* Items Preview */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1 divide-y divide-warm-100">
            {cart.map((item) => (
              <div key={item.cartItemId} className="pt-3 first:pt-0 flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover bg-warm-100 border border-warm-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 truncate">
                    {item.name}
                  </h4>
                  {item.variant && (
                    <span className="text-[11px] text-neutral-500">
                      {item.variant}
                    </span>
                  )}
                  <div className="text-xs text-neutral-600 mt-0.5">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="text-xs font-bold text-neutral-900">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-3 border-t border-warm-200 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery (Kerala)</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">Free</span>
                ) : (
                  formatCurrency(shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-2 border-t border-warm-200">
              <span>Total COD Payable</span>
              <span className="text-brand-800 font-display text-xl">{formatCurrency(totalCODAmount)}</span>
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="p-3 rounded-xl bg-warm-100/60 border border-warm-200/80 text-[11px] text-neutral-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-700">
              <Lock className="w-3.5 h-3.5 text-brand-700" />
              <span>Customer Privacy Guaranteed</span>
            </div>
            <p>
              Your contact and address information is never stored in browser cookies or localStorage. It is transmitted securely for fulfillment purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
