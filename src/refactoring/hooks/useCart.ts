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

  // 장바구니 내역의 상품 제거
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.product.id !== productId));
  };

  // 장바구니 내역의 상품 수량 변경
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.product.id === productId ? { ...p, quantity: newQuantity } : p,
      ),
    );
  };

  // 장바구니 내역의 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

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
