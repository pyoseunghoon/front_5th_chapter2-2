export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// discountType 리터럴 타입
export const DISCOUNT_TYPE = {
  AMOUNT: 'amount',
  PERCENTAGE: 'percentage',
} as const;
export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];

export interface Coupon {
  name: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
}
