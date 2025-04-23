import { Coupon } from '../../../types.ts';
import { AddCoupon } from './AddCoupon.tsx';
import { ShowCoupon } from './ShowCoupon.tsx';

interface Props {
  coupons: Coupon[];
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const CouponManagement = ({ coupons, onCouponAdd }: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        {/* 쿠폰 추가 Form */}
        <AddCoupon onCouponAdd={onCouponAdd}></AddCoupon>

        {/* 현재 쿠폰 목록 */}
        <div>
          <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
          <div className="space-y-2">
            {coupons.map((coupon, index) => {
              return (
                <ShowCoupon
                  key={index}
                  coupon={coupon}
                  index={index}
                ></ShowCoupon>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
