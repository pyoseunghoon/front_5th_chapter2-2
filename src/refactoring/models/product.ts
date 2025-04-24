import { Discount, Product } from '../../types.ts';

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];

export const defaultProduct = {
  name: '',
  price: 0,
  stock: 0,
  discounts: [],
};

export const hasProductDiscounts = (value: Discount[]) => {
  return value.length > 0;
};

export const removeDiscountFromProduct = (
  product: Product,
  discountIndex: number,
) => {
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
