import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import storeConfig from '../config/storeConfig';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'nammude_picks_cart_v1';

export function CartProvider({ children }) {
  const { settings } = useStore();
  const config = settings || storeConfig;
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  // Temporary toast notification
  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const addToCart = (product, selectedVariant = '', quantity = 1) => {
    if (!product || !product.inStock) {
      showToast('This product is currently out of stock');
      return;
    }

    const cartItemId = `${product.id}-${selectedVariant || 'default'}`;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
            image: product.image,
            variant: selectedVariant || '',
            quantity: qty,
            slug: product.slug
          }
        ];
      }
    });

    showToast(`Added ${product.name.slice(0, 24)}... to bag!`);
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Shipping calculation
  const freeShippingThreshold = config.freeShippingThreshold !== undefined ? config.freeShippingThreshold : storeConfig.freeShippingThreshold;
  const deliveryFee = config.deliveryFee !== undefined ? Number(config.deliveryFee) : storeConfig.deliveryFee;
  const isFreeShipping = freeShippingThreshold ? subtotal >= freeShippingThreshold : false;
  const shippingFee = cart.length === 0 ? 0 : (isFreeShipping ? 0 : deliveryFee);
  const totalCODAmount = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        totalCODAmount,
        isFreeShipping,
        freeShippingThreshold,
        isCartOpen,
        setIsCartOpen,
        notification
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
