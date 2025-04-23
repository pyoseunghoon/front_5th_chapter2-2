import { useState } from 'react';
import { Coupon } from '../../types.ts';
import { defaultCouponForm } from '../models/coupon.ts';

export const useCouponAddHandler = () => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(defaultCouponForm);

  const updateNewCoupon = (key, value) => {
    setNewCoupon((prev) => ({ ...prev, [key]: value }));
  };

  return {
    newCoupon,
    updateNewCoupon,
  };
};
