import { useCallback, useState } from 'react';
import { Coupon } from '../../types.ts';
import { defaultCouponForm } from '../models/coupon.ts';

export const useCouponAddHandler = (
  onCouponAdd: (newCoupon: Coupon) => void,
) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>(defaultCouponForm);

  const updateNewCoupon = useCallback(
    (key: keyof Coupon, value: string | number) => {
      setNewCoupon((prev: Coupon) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleAddCoupon = useCallback(() => {
    onCouponAdd(newCoupon);
    setNewCoupon(defaultCouponForm);
  }, [newCoupon, onCouponAdd]);

  return {
    newCoupon,
    updateNewCoupon,
    handleAddCoupon,
  };
};
