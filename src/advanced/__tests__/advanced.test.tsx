import { useState } from 'react';
import { describe, expect, test, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { CartPage } from '../../refactoring/ui/userPage/CartPage.tsx';
import { AdminPage } from '../../refactoring/ui/adminPage/AdminPage.tsx';
import { Coupon, Discount, Product } from '../../types';
import {
  debounce,
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
import { useLocalStorage } from '../../refactoring/hooks/useLocalStorage.ts';
import { useProductSearch } from '../../refactoring/hooks/useProductSearch.ts';
import { useProductAddHandler } from '../../refactoring/hooks/useProductAddHandler.ts';

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

// 목 콜백
const mockAdd = vi.fn(); // useProductAddHandler의 onProductAdd
const mockFlag = vi.fn(); // useProductAddHandler의 updateShowFormFlag

// localStorage 목 구현
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => {
      store[key] = val;
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    reset: () => {
      store = {};
    },
  };
})();

// 전역 localStorage 바인딩
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

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

      // 13. 상품 검색시 필터링된 상품만 표시된다
      const searchInput = screen.getByPlaceholderText('상품명 검색');
      fireEvent.change(searchInput, { target: { value: '상품2' } });

      await waitFor(() => {
        expect(screen.queryByTestId('product-p1')).not.toBeInTheDocument();
        expect(screen.getByTestId('product-p2')).toBeInTheDocument();
        expect(screen.queryByTestId('product-p3')).not.toBeInTheDocument();
      });

      // 14. 검색어 초기화 시 전체 상품 다시 표시되는지 확인
      fireEvent.change(searchInput, { target: { value: '  ' } });

      await waitFor(() => {
        expect(screen.getByTestId('product-p1')).toBeInTheDocument();
        expect(screen.getByTestId('product-p2')).toBeInTheDocument();
        expect(screen.getByTestId('product-p3')).toBeInTheDocument();
      });
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

      const $product4 = await waitFor(() => screen.getByTestId('product-4'));

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

      await waitFor(() => {
        expect($product1).toHaveTextContent('수정된 상품1');
        expect($product1).toHaveTextContent('12000원');
        expect($product1).toHaveTextContent('재고: 25');
      });

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
        expect(formatFixed(0.1 + 0.2, 1)).toBe('0.3');
        expect(formatFixed(-5.6789, 1)).toBe('-5.7');
      });

      test('지정된 시간 이후에 콜백을 호출한다', () => {
        vi.useFakeTimers();
        const mockFn = vi.fn();
        const debounced = debounce(mockFn, 1000);

        debounced();
        expect(mockFn).not.toBeCalled();

        vi.advanceTimersByTime(1000);
        expect(mockFn).toBeCalledTimes(1);
      });

      test('연속된 호출 중 마지막 호출만 실행된다', () => {
        vi.useFakeTimers();
        const mockFn = vi.fn();
        const debounced = debounce(mockFn, 1000);

        debounced();
        vi.advanceTimersByTime(500);
        debounced(); // 이전 타이머 취소되고 다시 시작됨

        vi.advanceTimersByTime(999);
        expect(mockFn).not.toBeCalled();

        vi.advanceTimersByTime(1);
        expect(mockFn).toBeCalledTimes(1);
      });

      test('인자를 전달하면 콜백에 그대로 전달된다', () => {
        vi.useFakeTimers();
        const mockFn = vi.fn();
        const debounced = debounce(mockFn, 300);

        debounced('hello', 42);
        vi.advanceTimersByTime(300);
        expect(mockFn).toHaveBeenCalledWith('hello', 42);
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
        expect(calculateItemTotal(cartItem)).toBe(10000 * 0.8 * 5);
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
        expect(updated[0].quantity).toBe(10);
      });
    });

    describe('새로운 hook 함수르 만든 후에 테스트 코드를 작성해서 실행해보세요', () => {
      describe('useLocalStorage 테스트', () => {
        test('getItem 저장되고 잘 가져오는지 확인', () => {
          const { result } = renderHook(() => useLocalStorage());

          act(() => {
            result.current.setItem('products', mockProducts);
          });

          expect(result.current.getItem('products')).toEqual(mockProducts);
        });

        test('removeLocalStorage 저장되고 잘 제거되는지 확인', () => {
          const { result } = renderHook(() => useLocalStorage());

          act(() => {
            result.current.setItem('products', mockProducts);
          });

          act(() => {
            result.current.removeItem('products');
          });

          expect(result.current.getItem('products')).toBeNull();
        });
      });

      describe('useProductSearch 테스트', () => {
        test('초기에는 전체 상품을 반환한다', () => {
          const { result } = renderHook(() => useProductSearch(mockProducts));
          expect(result.current.filteredProducts).toHaveLength(3);
        });

        test('검색어에 해당하는 상품만 필터링된다', async () => {
          vi.useFakeTimers();

          const { result } = renderHook(() => useProductSearch(mockProducts));

          act(() => {
            result.current.setKeyword('상품1');
          });

          await act(async () => {
            vi.advanceTimersByTime(300); // debounce delay
            await Promise.resolve(); // 업데이트 강제 flush
          });

          expect(result.current.filteredProducts).toHaveLength(1);
          expect(result.current.filteredProducts[0].name).toBe('상품1');

          vi.useRealTimers();
        });

        test('공백만 입력하면 전체 상품이 나온다', async () => {
          vi.useFakeTimers();

          const { result } = renderHook(() => useProductSearch(mockProducts));

          act(() => {
            result.current.setKeyword('   ');
          });

          await act(async () => {
            vi.advanceTimersByTime(300); // debounce delay
            await Promise.resolve(); // 업데이트 강제 flush
          });

          expect(result.current.filteredProducts).toHaveLength(3);

          vi.useRealTimers();
        });
      });

      describe('useProductAddHandler 테스트', () => {
        test('입력 시 debounce 5초 후 localStorage에 저장된다', async () => {
          vi.useFakeTimers();
          mockLocalStorage.reset();

          const { result } = renderHook(() =>
            useProductAddHandler(mockAdd, mockFlag),
          );

          // 기존 호출 횟수 저장 (테스트 중 이미 setItem을 호출하는 부분이 있을 수 있음)
          const prevCallCount = mockLocalStorage.setItem.mock.calls.length;

          // 입력 시도
          act(() => {
            result.current.updateNewProduct('name', '임시 저장 상품명');
          });

          // 5초 후
          act(() => {
            vi.advanceTimersByTime(5000);
          });

          // 이전 대비 1회 더 호출됨
          expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(
            prevCallCount + 1,
          );

          expect(mockLocalStorage.setItem).toHaveBeenLastCalledWith(
            'draftProduct',
            JSON.stringify({
              name: '임시 저장 상품명',
              price: 0,
              stock: 0,
              discounts: [],
            }),
          );

          // snackbar 표시 flag 확인
          expect(result.current.showSnackbar).toBe(true);

          // 2.5 초 후
          act(() => {
            vi.advanceTimersByTime(2500);
          });

          // snackbar 자동 숨김 확인
          expect(result.current.showSnackbar).toBe(false);

          vi.useRealTimers();
        });
      });
    });
  });
});
