import { Coupon, Product } from '../../../types.ts';
import { useCart } from '../../hooks';
import { ProductList } from './ProductList.tsx';
import { CartList } from './CartList.tsx';
import { ApplyCoupon } from './ApplyCoupon.tsx';
import { CartBill } from './CartBill.tsx';

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    getRemainingStock,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 상품 목록 */}
        <ProductList
          products={products}
          addToCart={addToCart}
          getRemainingStock={getRemainingStock}
        ></ProductList>

        {/* 장바구니 내역 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          {/* 장바구니 내역 - 장바구니 목록 */}
          <CartList
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          ></CartList>

          {/* 장바구니 내역 - 쿠폰 적용 */}
          <ApplyCoupon
            coupons={coupons}
            applyCoupon={applyCoupon}
            selectedCoupon={selectedCoupon}
          ></ApplyCoupon>

          {/* 장바구니 내역 - 주문 요약 */}
          <CartBill cartBills={calculateTotal()}></CartBill>
        </div>
      </div>
    </div>
  );
};
