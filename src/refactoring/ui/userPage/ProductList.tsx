import { Product } from '../../../types.ts';
import { ProductInfo } from './ProductInfo.tsx';
import { useProductSearch } from '../../hooks/useProductSearch.ts';
import { SearchProducts } from './SearchProducts.tsx';

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
  const { keyword, setKeyword, filteredProducts } = useProductSearch(products);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <SearchProducts
          keyword={keyword}
          setKeyword={setKeyword}
        ></SearchProducts>
      </div>

      <div className="space-y-2">
        {filteredProducts.map((product) => {
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
