import { useState } from 'react';
import { Discount } from '../../types.ts';
import { defaultDiscount } from '../models/discount.ts';

export const useDiscount = () => {
  const [newDiscount, setNewDiscount] = useState<Discount>(defaultDiscount);

  const updateDiscountField = (key: 'quantity' | 'rate', value: number) => {
    setNewDiscount((prev: Discount) => {
      return { ...prev, [key]: value };
    });
  };

  const resetDiscountValues = () => {
    setNewDiscount(defaultDiscount);
  };

  return {
    newDiscount,
    updateDiscountField,
    resetDiscountValues,
  };
};
