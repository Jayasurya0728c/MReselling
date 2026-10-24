import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/orderUtils';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const amountNeededForFreeShipping = freeShippingThreshold ? Math.max(0, freeShippingThreshold - subtotal) : 0;
  const shippingProgress = freeShippingThreshold ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100)) : 100;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-warm-200 flex items-center justify-between bg-warm-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-800" />
              <h2 className="font-display font-bold text-lg text-neutral-900">
                Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-warm-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {freeShippingThreshold && cart.length > 0 && (
            <div className="px-5 py-3 bg-brand-50 border-b border-brand-100 text-xs">
              {isFreeShipping ? (
                <div className="flex items-center gap-2 text-brand-800 font-semibold">
                  <Truck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span>🎉 Congrats! Your order qualifies for <strong>FREE Delivery</strong> across India!</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-neutral-700 font-medium mb-1.5">
                    <span>Add {formatCurrency(amountNeededForFreeShipping)} more for FREE Delivery</span>
                    <span className="font-bold text-brand-800">{shippingProgress}%</span>
                  </div>
                  <div className="w-full bg-brand-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-warm-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-20 h-20 rounded-full bg-warm-100 flex items-center justify-center text-neutral-400 mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-800">
                  Your bag is empty
                </h3>
                <p className="text-sm text-neutral-500 mt-1 max-w-xs">
                  Discover trending lifestyle finds, traditional accessories, and everyday essentials handpicked across India.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-brand-800 hover:bg-brand-700 text-white font-semibold text-sm transition-transform active:scale-95 shadow-sm"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3.5">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-warm-100 flex-shrink-0 border border-warm-200"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.slug || item.productId}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-semibold text-sm text-neutral-900 hover:text-brand-800 line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1 -mr-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variant && (
                        <span className="inline-block text-[11px] font-medium text-neutral-500 bg-warm-100 px-2 py-0.5 rounded mt-0.5">
                          {item.variant}
                        </span>
                      )}

                      <div className="text-sm font-bold text-neutral-900 mt-1">
                        {formatCurrency(item.price)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center border border-warm-300 rounded-lg bg-warm-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 px-2 text-neutral-600 hover:bg-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 px-2 text-neutral-600 hover:bg-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-neutral-600">
                        Item total: <span className="text-neutral-900 font-bold">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-warm-200 bg-warm-50/70 space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">Free</span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-warm-200">
                  <span>Total COD Payable</span>
                  <span className="text-brand-800 font-display">{formatCurrency(totalCODAmount)}</span>
                </div>
              </div>

              {/* COD note */}
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200/80 p-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Cash on Delivery only. Pay cash when package arrives.</span>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <span>Proceed to COD Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-xs text-neutral-500 hover:text-neutral-800 font-medium underline"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Empty Bag
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
