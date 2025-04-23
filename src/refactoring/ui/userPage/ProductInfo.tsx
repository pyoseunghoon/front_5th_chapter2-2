import { Product } from '../../../types.ts';
import {
  formatFixed,
  getLocaleString,
  getPercentage,
} from '../../models/util.ts';
import { hasProductDiscounts } from '../../models/product.ts';
import { getMaxDiscountRate } from '../../models/discount.ts';

interface Props {
  product: Product;
  remainingStock: number;
  addToCart: (product: Product) => void;
}

export const ProductInfo = ({ product, remainingStock, addToCart }: Props) => {
  return (
    <div
      key={product.id}
      data-testid={`product-${product.id}`}
      className="bg-white p-3 rounded shadow"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{product.name}</span>
        <span className="text-gray-600">
          {getLocaleString(product.price)}원
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        <span
          className={`font-medium ${remainingStock > 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          재고: {remainingStock}개
        </span>
        {hasProductDiscounts(product.discounts) && (
          <span className="ml-2 font-medium text-blue-600">
            최대{' '}
            {formatFixed(
              getPercentage(getMaxDiscountRate(product.discounts)),
              0,
            )}
            % 할인
          </span>
        )}
      </div>
      {hasProductDiscounts(product.discounts) && (
        <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
          {product.discounts.map((discount, index) => (
            <li key={index}>
              {discount.quantity}개 이상:{' '}
              {formatFixed(getPercentage(discount.rate), 0)}% 할인
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => addToCart(product)}
        className={`w-full px-3 py-1 rounded ${
          remainingStock > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={remainingStock <= 0}
      >
        {remainingStock > 0 ? '장바구니에 추가' : '품절'}
      </button>
    </div>
  );
};
