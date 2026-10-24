import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/orderUtils';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    totalCODAmount,
    isFreeShipping,
    freeShippingThreshold
  } = useCart();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-display font-bold text-2xl text-neutral-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-neutral-500 max-w-sm mx-auto">
          Explore our trending finds and viral gadgets. Add items with zero upfront payment using Cash on Delivery.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 rounded-full bg-brand-800 text-white font-bold text-sm shadow-sm"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const amountNeeded = freeShippingThreshold ? Math.max(0, freeShippingThreshold - subtotal) : 0;
  const shippingProgress = freeShippingThreshold ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100)) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warm-200">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-950">
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Review your selected items before proceeding to Cash on Delivery checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Empty Entire Bag</span>
        </button>
      </div>

      {/* Free Shipping Alert */}
      {freeShippingThreshold && (
        <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs sm:text-sm">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-brand-900 font-bold">
              <Truck className="w-5 h-5 text-brand-700 flex-shrink-0" />
              <span>🎉 Congratulations! Your order qualifies for FREE Delivery across India!</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-neutral-800 font-semibold">
                <span>Add {formatCurrency(amountNeeded)} more for <strong>FREE Delivery</strong> across India</span>
                <span className="text-brand-800 font-bold">{shippingProgress}%</span>
              </div>
              <div className="w-full bg-brand-200/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cart Items & Order Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Item List (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-warm-200 shadow-soft overflow-hidden divide-y divide-warm-100">
          {cart.map((item) => (
            <div key={item.cartItemId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-warm-100 border border-warm-200 flex-shrink-0"
              />

              <div className="flex-1 space-y-1">
                <Link
                  to={`/product/${item.slug || item.productId}`}
                  className="font-bold text-sm sm:text-base text-neutral-900 hover:text-brand-800"
                >
                  {item.name}
                </Link>

                {item.variant && (
                  <div className="text-xs font-medium text-neutral-500">
                    Variant: <span className="text-neutral-800 font-semibold">{item.variant}</span>
                  </div>
                )}

                <div className="text-sm font-bold text-neutral-900 pt-1">
                  {formatCurrency(item.price)} each
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:items-end gap-3">
                <div className="flex items-center border border-warm-300 rounded-xl bg-warm-50 overflow-hidden shadow-sm">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="p-1.5 px-2.5 text-neutral-600 hover:bg-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-neutral-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="p-1.5 px-2.5 text-neutral-600 hover:bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-display font-extrabold text-base text-neutral-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-warm-200 shadow-soft p-6 space-y-6">
          <h2 className="font-display font-bold text-lg text-neutral-900 pb-3 border-b border-warm-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-neutral-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Standard Delivery</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">Free</span>
                ) : (
                  formatCurrency(shippingFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-3 border-t border-warm-200">
              <span>Total COD Payable</span>
              <span className="text-brand-800 font-display text-xl">{formatCurrency(totalCODAmount)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Zero Advance Payment:</strong> Cash on Delivery is strictly enabled. Pay when you receive your parcel.
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-2xl bg-brand-800 hover:bg-brand-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-card hover:shadow-float transition-all active:scale-95"
            >
              <span>Proceed to COD Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="block text-center text-xs text-neutral-500 hover:text-neutral-900 font-medium py-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
