// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = (product: Product) => {
    const isInCart = cart.some((p) => p.product.id === product.id);

    if (isInCart) {
      // 기존에 장바구니에 있는 상품 추가
      setCart((prev) =>
        prev.map((p) =>
          p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
    } else {
      // 기존에 장바구니에 없던 상품 추가
      setCart((prev) => [...prev, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {};

  const updateQuantity = (productId: string, newQuantity: number) => {};

  const applyCoupon = (coupon: Coupon) => {};

  const calculateTotal = () => ({
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  });

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
