import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { CartPage } from '../../refactoring/ui/userPage/CartPage.tsx';
import { AdminPage } from '../../refactoring/ui/adminPage/AdminPage.tsx';
import { Coupon, Discount, Product } from '../../types';
import {
  formatFixed,
  getLocaleString,
  getPercentage,
} from '../../refactoring/models/util.ts';
import {
  hasProductDiscounts,
  removeDiscountFromProduct,
  updateDiscountToProduct,
} from '../../refactoring/models/product.ts';
import {
  defaultDiscount,
  getMaxDiscountRate,
} from '../../refactoring/models/discount.ts';
import {
  defaultCouponForm,
  getDiscountValue,
} from '../../refactoring/models/coupon.ts';
import {
  calculateCartTotal,
  calculateItemTotal,
  getMaxApplicableDiscount,
  hasAppliedDiscount,
  updateCartItemQuantity,
} from '../../refactoring/models/cart.ts';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
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
const mockCoupons: Coupon[] = [
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

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p,
      ),
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 =
        within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 =
        within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 =
        within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), {
        target: { value: '상품4' },
      });
      fireEvent.change(screen.getByLabelText('가격'), {
        target: { value: '15000' },
      });
      fireEvent.change(screen.getByLabelText('재고'), {
        target: { value: '30' },
      });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), {
          target: { value: '25' },
        });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), {
          target: { value: '5' },
        });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), {
          target: { value: '5' },
        });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(
        screen.queryByText('10개 이상 구매 시 10% 할인'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('5개 이상 구매 시 5% 할인'),
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), {
        target: { value: '새 쿠폰' },
      });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), {
        target: { value: 'NEW10' },
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'percentage' },
      });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), {
        target: { value: '10' },
      });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('자유롭게 작성해보세요.', () => {
    describe('util 함수 테스트', () => {
      test('getLocaleString 함수는 숫자를 로케일 문자열로 변환한다.', () => {
        expect(getLocaleString(260000)).toBe('260,000');
        expect(getLocaleString(0)).toBe('0');
        expect(getLocaleString(-1000)).toBe('-1,000');
      });

      test('getPercentage 함수는 소수를 백분율 숫자로 변환한다.', () => {
        expect(getPercentage(0.1)).toBe(10);
        expect(getPercentage(0)).toBe(0);
        expect(getPercentage(1)).toBe(100);
        expect(getPercentage(-0.25)).toBe(-25);
      });

      test('formatFixed 함수는 소수를 고정된 소수점 자리수로 문자열 변환한다.', () => {
        expect(formatFixed(12.3456, 2)).toBe('12.35');
        expect(formatFixed(1, 3)).toBe('1.000');
        expect(formatFixed(0.1 + 0.2, 1)).toBe('0.3'); // JS 부동소수점 테스트
        expect(formatFixed(-5.6789, 1)).toBe('-5.7');
      });
    });

    describe('product 유틸 함수 테스트', () => {
      const mockProduct: Product = {
        id: 'p1',
        name: '상품1',
        price: 10000,
        stock: 10,
        discounts: [
          { quantity: 5, rate: 0.1 },
          { quantity: 10, rate: 0.2 },
        ],
      };

      test('hasProductDiscounts는 할인 배열이 비어있는지 여부를 반환한다', () => {
        expect(hasProductDiscounts(mockProduct.discounts)).toBe(true);
        expect(hasProductDiscounts([])).toBe(false);
      });

      test('removeDiscountFromProduct는 특정 인덱스의 할인만 제거한다', () => {
        const updated = removeDiscountFromProduct(mockProduct, 0);
        expect(updated.discounts).toHaveLength(1);
        expect(updated.discounts[0]).toEqual({ quantity: 10, rate: 0.2 });
      });

      test('updateDiscountToProduct는 새로운 할인을 추가한다', () => {
        const newDiscount: Discount = { quantity: 20, rate: 0.3 };
        const updated = updateDiscountToProduct(mockProduct, newDiscount);
        expect(updated.discounts).toHaveLength(3);
        expect(updated.discounts[2]).toEqual(newDiscount);
      });
    });

    describe('discount 유틸 함수 테스트', () => {
      test('defaultDiscount는 기본 할인 객체를 제공한다', () => {
        expect(defaultDiscount).toEqual({ quantity: 0, rate: 0 });
      });

      test('getMaxDiscountRate는 최대 할인율을 반환한다', () => {
        const discounts: Discount[] = [
          { quantity: 5, rate: 0.1 },
          { quantity: 10, rate: 0.3 },
          { quantity: 20, rate: 0.2 },
        ];
        expect(getMaxDiscountRate(discounts)).toBe(0.3);
      });

      test('getMaxDiscountRate는 빈 배열이면 0을 반환한다', () => {
        expect(getMaxDiscountRate([])).toBe(0);
      });
    });

    describe('coupon 유틸 함수 테스트', () => {
      test('defaultCouponForm은 빈 쿠폰 양식으로 초기화된다', () => {
        expect(defaultCouponForm).toEqual({
          name: '',
          code: '',
          discountType: 'percentage',
          discountValue: 0,
        });
      });

      test('getDiscountValue는 할인 타입에 따라 문자열을 반환한다', () => {
        const amountCoupon: Coupon = {
          name: '금액쿠폰',
          code: 'AMOUNT1000',
          discountType: 'amount',
          discountValue: 10000,
        };

        const percentCoupon: Coupon = {
          name: '비율쿠폰',
          code: 'PERCENT5',
          discountType: 'percentage',
          discountValue: 15,
        };

        expect(getDiscountValue(amountCoupon)).toBe('10000원');
        expect(getDiscountValue(percentCoupon)).toBe('15%');
      });
    });

    describe('cart 유틸 함수 테스트', () => {
      const product = {
        id: 'p1',
        name: '상품1',
        price: 10000,
        stock: 10,
        discounts: [
          { quantity: 1, rate: 0.1 },
          { quantity: 5, rate: 0.2 },
        ],
      };

      const cartItem = { product, quantity: 5 };

      test('getMaxApplicableDiscount는 최대 적용 가능한 할인율을 반환한다', () => {
        expect(getMaxApplicableDiscount(cartItem)).toBe(0.2);
      });

      test('calculateItemTotal는 수량과 할인율을 반영한 총액을 계산한다', () => {
        expect(calculateItemTotal(cartItem)).toBe(10000 * 0.8 * 5); // 20% 할인
      });

      test('hasAppliedDiscount는 할인 여부를 판단한다', () => {
        expect(hasAppliedDiscount(0.1)).toBe(true);
        expect(hasAppliedDiscount(0)).toBe(false);
      });

      test('calculateCartTotal은 쿠폰이 없을 때 올바른 금액을 계산한다', () => {
        const cart = [cartItem];
        const result = calculateCartTotal(cart, null);
        expect(result.totalBeforeDiscount).toBe(50000);
        expect(result.totalAfterDiscount).toBe(40000);
        expect(result.totalDiscount).toBe(10000);
      });

      test('calculateCartTotal은 금액 쿠폰 적용 시 올바른 할인 금액을 반환한다', () => {
        const cart = [cartItem];
        const result = calculateCartTotal(cart, {
          discountType: 'amount',
          discountValue: 5000,
          name: '',
          code: '',
        });
        expect(result.totalAfterDiscount).toBe(35000);
        expect(result.totalDiscount).toBe(15000);
      });

      test('updateCartItemQuantity는 수량 변경을 정확히 처리한다', () => {
        const cart = [cartItem];
        const updated = updateCartItemQuantity(cart, 'p1', 3);
        expect(updated[0].quantity).toBe(3);
      });

      test('updateCartItemQuantity는 수량 0일 경우 장바구니에서 제거한다', () => {
        const cart = [cartItem];
        const updated = updateCartItemQuantity(cart, 'p1', 0);
        expect(updated).toHaveLength(0);
      });

      test('updateCartItemQuantity는 재고보다 많은 수량을 입력하면 최대 재고로 설정한다', () => {
        const cart = [cartItem];
        const updated = updateCartItemQuantity(cart, 'p1', 100);
        expect(updated[0].quantity).toBe(10); // 재고 제한
      });
    });

    // describe('새로운 hook 함수르 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
    //   // test('새로운 hook 함수르 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
    //   //   expect(true).toBe(false);
    //   // });
    // });
  });
});
