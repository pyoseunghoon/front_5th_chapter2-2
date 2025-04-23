import { Coupon } from '../../types.ts';

export const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

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
