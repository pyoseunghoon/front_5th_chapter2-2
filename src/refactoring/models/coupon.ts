import { Coupon } from '../../types.ts';

export const defaultCouponForm: Coupon = {
  name: '',
  code: '',
  discountType: 'percentage',
  discountValue: 0,
};

export const getDiscountValue = (coupon: Coupon): string => {
  return coupon.discountType === 'amount'
    ? `${coupon.discountValue}원`
    : `${coupon.discountValue}%`;
};
