import { Product } from '../../../types.ts';
import { ProductInfo } from './ProductInfo.tsx';

interface Props {
  products: Product[];
  addToCart: (product: Product) => void;
  getRemainingStock: (product: Product) => number;
}

export const ProductList = ({
  products,
  addToCart,
  getRemainingStock,
}: Props) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product) => {
          return (
            <ProductInfo
              key={product.id}
              product={product}
              addToCart={addToCart}
              remainingStock={getRemainingStock(product)}
            ></ProductInfo>
          );
        })}
      </div>
    </div>
  );
};
