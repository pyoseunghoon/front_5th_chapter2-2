import { Discount, Product } from '../../types.ts';

export const defaultProduct = {
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
};

export const hasProductDiscounts = (value) => {
  return value.length > 0;
};

export const removeDiscountFromProduct = (product: Product, discountIndex) => {
  const filteredDiscounts = product.discounts.filter(
    (_, idx) => idx !== discountIndex,
  );

  return {
    ...product,
    discounts: filteredDiscounts,
  };
};

export const updateDiscountToProduct = (
  product: Product,
  newDiscount: Discount,
) => {
  return {
    ...product,
    discounts: [...product.discounts, newDiscount],
  };
};
