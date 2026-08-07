import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Promo } from '../types';
import api from '../services/api';

interface CourierOption {
  code: string;
  name: string;
  service: string;
  etd: string;
  costPerKg: number;
}

export const COURIER_OPTIONS: CourierOption[] = [
  { code: 'jne_reg', name: 'JNE', service: 'Regular (2-3 hari)', etd: '2-3 hari', costPerKg: 15000 },
  { code: 'jne_yes', name: 'JNE', service: 'YES (Yakin Esok Sampai)', etd: '1 hari', costPerKg: 28000 },
  { code: 'tiki_reg', name: 'TIKI', service: 'REG (2-3 hari)', etd: '2-3 hari', costPerKg: 14000 },
  { code: 'pos_kilat', name: 'POS Indonesia', service: 'Kilat Khusus (2-4 hari)', etd: '2-4 hari', costPerKg: 12000 },
  { code: 'gosend', name: 'GoSend', service: 'Instant (Sameday)', etd: '3-6 jam', costPerKg: 25000 },
];

interface CartContextType {
  cart: CartItem[];
  wishlistIds: number[];
  selectedCourier: CourierOption;
  appliedPromo: { code: string; discountAmount: number; discountPercent: number } | null;
  subtotal: number;
  totalWeightGrams: number;
  shippingCost: number;
  discountAmount: number;
  grandTotal: number;
  addToCart: (product: Product, quantity?: number, selectedVariation?: any) => void;
  removeFromCart: (productId: number, variationKey?: string) => void;
  updateQuantity: (productId: number, quantity: number, variationKey?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  setSelectedCourier: (courier: CourierOption) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('umkm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('umkm_wishlist');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  const [selectedCourier, setSelectedCourier] = useState<CourierOption>(COURIER_OPTIONS[0]);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number; discountPercent: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('umkm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('umkm_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addToCart = (product: Product, quantity = 1, selectedVariation?: any) => {
    setCart((prevCart) => {
      const variationKey = selectedVariation ? `${selectedVariation.variation_name}-${selectedVariation.option_value}` : '';
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && (item.selectedVariation ? `${item.selectedVariation.variation_name}-${item.selectedVariation.option_value}` : '') === variationKey
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, product.stock);
        return updated;
      } else {
        return [...prevCart, { product, quantity: Math.min(quantity, product.stock), selectedVariation }];
      }
    });
  };

  const removeFromCart = (productId: number, variationKey = '') => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (item.selectedVariation ? `${item.selectedVariation.variation_name}-${item.selectedVariation.option_value}` : '') === variationKey
          )
      )
    );
  };

  const updateQuantity = (productId: number, quantity: number, variationKey = '') => {
    if (quantity <= 0) {
      removeFromCart(productId, variationKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        const vKey = item.selectedVariation ? `${item.selectedVariation.variation_name}-${item.selectedVariation.option_value}` : '';
        if (item.product.id === productId && vKey === variationKey) {
          return { ...item, quantity: Math.min(quantity, item.product.stock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const toggleWishlist = async (productId: number) => {
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });

    try {
      await api.post('/products/wishlist/toggle', { productId });
    } catch {
      // Handled silently
    }
  };

  const isInWishlist = (productId: number) => wishlistIds.includes(productId);

  // Cart financial calculations
  const subtotal = cart.reduce((sum, item) => {
    const basePrice = item.product.price;
    const modifier = item.selectedVariation?.price_modifier || 0;
    const discount = item.product.discount || 0;
    const finalItemPrice = (basePrice + modifier) * (1 - discount / 100);
    return sum + finalItemPrice * item.quantity;
  }, 0);

  const totalWeightGrams = cart.reduce((sum, item) => sum + (item.product.weight || 100) * item.quantity, 0);

  // Weight rounded up to nearest kg for shipping rate calculation (min 1 kg)
  const totalKg = Math.max(1, Math.ceil(totalWeightGrams / 1000));
  const shippingCost = cart.length > 0 ? totalKg * selectedCourier.costPerKg : 0;

  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const applyPromoCode = async (code: string) => {
    try {
      const res = await api.post('/promos/verify', { code, cartTotal: subtotal });
      if (res.data.success) {
        setAppliedPromo({
          code: res.data.data.code,
          discountAmount: res.data.data.discount_amount,
          discountPercent: res.data.data.discount_percent,
        });
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Kode promo tidak berlaku.' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Kode promo tidak ditemukan.' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlistIds,
        selectedCourier,
        appliedPromo,
        subtotal,
        totalWeightGrams,
        shippingCost,
        discountAmount,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyPromoCode,
        removePromoCode,
        setSelectedCourier,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
