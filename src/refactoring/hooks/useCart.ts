// useCart.ts
import { useState } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { calculateCartTotal, updateCartItemQuantity } from '../models/cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  /**
   * 상품 장바구니 담기
   * @param product
   */
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

  /**
   * 장바구니 내역의 상품 제거
   * @param productId
   */
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.product.id !== productId));
  };

  /**
   * 장바구니 내역의 상품 수량 변경
   * @param productId
   * @param newQuantity
   */
  const updateQuantity = (productId: string, newQuantity: number) => {
    // 외부 상태 참조하여 업데이트.. 문제 발생
    // const updatedCart = updateCartItemQuantity(cart, productId, newQuantity);
    // setCart(updatedCart);

    // react의 useState 상태 업데이트는 비동기적이고 큐(queue) 기반으로 처리되기 때문에
    // 외부 참조는 최신의 상태값이 아닐 수 있음.. ==> 따라서 함수형 업데이트를 해야함
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity),
    );
  };

  /**
   * 장바구니 내역의 쿠폰 적용
   * @param coupon
   */
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  /**
   * 장바구니 상품 최종 가격 계산
   */
  const calculateTotal = () => calculateCartTotal(cart, selectedCoupon);

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
