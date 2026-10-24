import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Lock,
  Package,
  Clock,
  Phone,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { createOrder } from '../lib/dataService';
import { formatCurrency } from '../utils/orderUtils';
import storeConfig, { INDIAN_STATES } from '../config/storeConfig';

export default function Checkout() {
  const { cart, subtotal, shippingFee, totalCODAmount, clearCart } = useCart();
  const { settings } = useStore();
  const config = settings || storeConfig;
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    houseName: '',
    streetLocality: '',
    city: '',
    state: '',
    pincode: '',
    deliveryInstructions: '',
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // Post-submission state
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

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
      errs.houseName = 'House name / flat / building is required';
    }

    if (!formData.streetLocality.trim()) {
      errs.streetLocality = 'Street / locality is required';
    }

    if (!formData.city.trim()) {
      errs.city = 'City / Town / District is required';
    }

    if (!formData.state) {
      errs.state = 'Please select your state / union territory';
    }

    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errs.pincode = 'Enter a valid 6-digit Indian PIN code';
    }

    if (!formData.consent) {
      errs.consent = 'You must consent to sharing your details for order delivery';
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

      // 2. Save order record directly to admin database
      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.replace(/\D/g, ''),
        houseName: formData.houseName.trim(),
        streetLocality: formData.streetLocality.trim(),
        postOffice: formData.city.trim(),
        district: formData.city.trim(),
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
        setSubmittedOrder({
          reference: result.reference,
          ...orderPayload
        });
        clearCart();
        setOrderSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Could not submit order: ' + (result.error || 'Please try again.'));
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('There was an issue processing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (orderSubmitted && submittedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16 space-y-8">
        <div className="bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Order Confirmed & Placed
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
              Order Reference: <span className="text-brand-800">{submittedOrder.reference}</span>
            </h1>
            <p className="text-sm text-neutral-600 max-w-lg mx-auto">
              Thank you, <strong>{submittedOrder.customerName}</strong>! Your Cash on Delivery order has been successfully placed directly with our team.
            </p>
          </div>

          {/* Order Details Summary Card */}
          <div className="p-5 rounded-2xl bg-warm-50 border border-warm-200 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-warm-200">
              <span className="text-neutral-500 font-medium">Payment Mode</span>
              <span className="font-bold text-brand-800 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
                Cash on Delivery (COD)
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-warm-200">
              <span className="text-neutral-500 font-medium">Total Amount to Pay</span>
              <span className="font-bold text-base text-neutral-900 font-display">
                {formatCurrency(submittedOrder.totalAmount)}
              </span>
            </div>

            <div className="pt-1 space-y-1">
              <div className="text-neutral-500 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Delivery Address</span>
              </div>
              <p className="text-neutral-800 font-semibold pl-5 leading-relaxed">
                {submittedOrder.houseName}, {submittedOrder.streetLocality}, {submittedOrder.district}, {submittedOrder.state} - {submittedOrder.pincode}
              </p>
            </div>

            <div className="pt-1 space-y-1">
              <div className="text-neutral-500 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>Contact Mobile</span>
              </div>
              <p className="text-neutral-800 font-semibold pl-5">
                +91 {submittedOrder.customerPhone}
              </p>
            </div>
          </div>

          {/* Timeline / What to expect */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>What Happens Next?</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-700">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1">
                <div className="font-bold text-emerald-800">1. Order Logged</div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Your order is received in our admin dashboard.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1">
                <div className="font-bold text-emerald-800">2. Dispatch</div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Our team packages and ships via courier across India.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1">
                <div className="font-bold text-emerald-800">3. Pay on Delivery</div>
                <p className="text-[11px] text-neutral-500 leading-snug">
                  Pay cash or UPI to the delivery agent when your parcel arrives.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto py-3 px-8 rounded-full bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 text-center"
            >
              Continue Shopping
            </Link>

            <a
              href={`https://wa.me/${(config.whatsappNumber || storeConfig.whatsappNumber).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I placed order #${submittedOrder.reference} on ${config.storeName}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-6 rounded-full border border-warm-300 hover:bg-warm-100 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Questions? WhatsApp Support</span>
            </a>
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
          Zero advance payment. Enter your shipping details for doorstep delivery anywhere in India.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Checkout Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-warm-200 shadow-soft p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-warm-200 pb-3 flex items-center justify-between">
              <h2 className="font-display font-bold text-base text-neutral-900">
                1. Delivery & Contact Details
              </h2>
              <span className="text-[11px] font-semibold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                Pan-India Shipping
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
                placeholder="e.g. Rahul Sharma / Ananya Verma"
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
                Mobile Number (10 digits) <span className="text-red-500">*</span>
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
                  placeholder="9876543210"
                  className={`w-full bg-warm-50 border rounded-xl p-3 pl-14 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.customerPhone ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                  }`}
                />
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Our delivery partner will call you at this number upon parcel arrival.
              </p>
              {errors.customerPhone && (
                <p className="text-xs text-red-600 mt-1">{errors.customerPhone}</p>
              )}
            </div>

            {/* House / Flat name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Flat No. / Building / House Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.houseName}
                onChange={(e) => setFormData({ ...formData, houseName: e.target.value })}
                placeholder="e.g. Flat 4B, Shanti Enclave / House #128"
                className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.houseName ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                }`}
              />
              {errors.houseName && (
                <p className="text-xs text-red-600 mt-1">{errors.houseName}</p>
              )}
            </div>

            {/* Street / Locality */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Street / Area / Landmark <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.streetLocality}
                onChange={(e) => setFormData({ ...formData, streetLocality: e.target.value })}
                placeholder="e.g. 2nd Main Road, Near Central Bank"
                className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                  errors.streetLocality ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                }`}
              />
              {errors.streetLocality && (
                <p className="text-xs text-red-600 mt-1">{errors.streetLocality}</p>
              )}
            </div>

            {/* State, City & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  State / UT <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.state ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                  }`}
                >
                  <option value="">-- Select State / UT --</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-red-600 mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  City / District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bengaluru / Kochi"
                  className={`w-full bg-warm-50 border rounded-xl p-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
                    errors.city ? 'border-red-400 bg-red-50/30' : 'border-warm-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs text-red-600 mt-1">{errors.city}</p>
                )}
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
                  placeholder="560001"
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
                placeholder="e.g. Call before delivery, leave with security if unavailable..."
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
                  I confirm my order details and agree to pay via <strong>Cash on Delivery (COD)</strong> upon receiving the parcel. <span className="text-red-500">*</span>
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
                Zero advance payment. Pay <strong>{formatCurrency(totalCODAmount)}</strong> with cash or UPI directly to the delivery courier agent.
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-brand-800 hover:bg-brand-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-card hover:shadow-float transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <span>Place Cash on Delivery Order</span>
                  <ArrowRight className="w-5 h-5" />
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
              <span>Delivery Shipping</span>
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
              <span>Customer Privacy & Security</span>
            </div>
            <p>
              Your contact and address information is used exclusively for order fulfillment and parcel delivery tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
