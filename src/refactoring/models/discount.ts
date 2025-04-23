import { Discount } from '../../types.ts';

export const defaultDiscount: Discount = {
  quantity: 0,
  rate: 0,
};

export const getMaxDiscountRate = (
  discounts: { quantity: number; rate: number }[],
): number => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};
