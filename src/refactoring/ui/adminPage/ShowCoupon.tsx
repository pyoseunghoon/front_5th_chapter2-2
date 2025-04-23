import { Coupon } from '../../../types.ts';

interface Props {
  coupon: Coupon;
  index: number;
}
export const ShowCoupon = ({ coupon, index }: Props) => {
  return (
    <div
      key={index}
      data-testid={`coupon-${index + 1}`}
      className="bg-gray-100 p-2 rounded"
    >
      {coupon.name} ({coupon.code}):
      {coupon.discountType === 'amount'
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`}{' '}
      할인
    </div>
  );
};
