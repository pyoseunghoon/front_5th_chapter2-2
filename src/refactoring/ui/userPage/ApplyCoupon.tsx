import { Coupon } from '../../../types.ts';
import { getDiscountValue } from '../../models/coupon.ts';

interface Props {
  coupons: Coupon[];
  applyCoupon: (coupon: Coupon) => void;
  selectedCoupon: Coupon | null;
}

export const ApplyCoupon = ({
  coupons,
  applyCoupon,
  selectedCoupon,
}: Props) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
      <select
        onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon, index) => (
          <option key={coupon.code} value={index}>
            {coupon.name} - {getDiscountValue(coupon)}
          </option>
        ))}
      </select>
      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}({getDiscountValue(selectedCoupon)}{' '}
          할인)
        </p>
      )}
    </div>
  );
};
