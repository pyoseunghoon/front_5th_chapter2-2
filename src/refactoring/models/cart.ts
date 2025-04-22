import { CartItem, Coupon } from '../../types';

/**
 * 상품의 할인이 적용된 가격
 * @param item
 */
export const calculateItemTotal = (item: CartItem) => {
  const discountRate = getMaxApplicableDiscount(item);

  // 상품의 할인된 가격
  const itemTotal = item.product.price * (1 - discountRate) * item.quantity;

  return itemTotal;
};

/**
 * 적용가능한 상품의 최대 할인율 제공
 * @param item
 */
export const getMaxApplicableDiscount = (item: CartItem) => {
  // 상품에 적용 가능한 할인율
  const applicableDiscountRates = item.product.discounts
    .filter((d) => d.quantity <= item.quantity)
    .map((d) => d.rate);

  if (applicableDiscountRates.length === 0) {
    return 0;
  }

  return Math.max(...applicableDiscountRates);
};

/**
 * 장바구니 상품 최종 가격 계산
 * @param cart
 * @param selectedCoupon
 * @return {totalDiscount: number, totalAfterDiscount: number, totalBeforeDiscount: number}
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
) => {
  // 장비구니 상품들의 할인되기전 총 금액
  const totalBeforeDiscount = cart.reduce(
    (prevItem, currentItem) =>
      prevItem + currentItem.quantity * currentItem.product.price,
    0,
  );

  // 장비구니 상품들의 할인된 총 금액
  const totalAfterItemDiscount = cart.reduce(
    (prevItem, currentItem) => prevItem + calculateItemTotal(currentItem),
    0,
  );

  // 할인율 쿠폰 적용시 할인 금액
  const getCouponDiscountByPercentage = (total, discountValue) => {
    return total * (1 - discountValue / 100);
  };

  // 금액 쿠폰 적용시 할인 금액
  const getCouponDiscountByAmount = (total, discountValue) => {
    return Math.max(total - discountValue, 0);
  };

  // 쿠폰 적용된 할인 금액
  const getCouponDiscountAppliedTotal = (coupon, total) => {
    if (coupon.discountType === 'amount') {
      return getCouponDiscountByAmount(total, coupon.discountValue);
    }

    if (coupon.discountType === 'percentage') {
      return getCouponDiscountByPercentage(total, coupon.discountValue);
    }
  };

  // 할인된 최종 금액
  const totalAfterDiscount = selectedCoupon
    ? getCouponDiscountAppliedTotal(selectedCoupon, totalAfterItemDiscount)
    : totalAfterItemDiscount;

  // 할인된 금액
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount: totalBeforeDiscount,
    totalAfterDiscount: totalAfterDiscount,
    totalDiscount: totalDiscount,
  };
};

/**
 * 장바구니의 상품 수량 변경
 * @param cart
 * @param productId
 * @param newQuantity
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  /*
    상품의 재고 이상으로 장바구니에 선택 불가 하도록 onClick에서 제어
    이유는 updateCartItemQuantity 함수를 타는 순간 useState의 변경으로 불필요한 렌더링이 발생함.
  */

  // 수량 0 일시 장바구니에서 제거
  if (newQuantity === 0) {
    return cart.filter((item) => item.product.id !== productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity: newQuantity } : item,
  );
};
