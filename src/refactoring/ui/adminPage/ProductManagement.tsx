import { AddProduct } from './AddProduct.tsx';
import { Product } from '../../../types.ts';
import { ShowProduct } from './ShowProduct.tsx';
import { SearchProducts } from '../userPage/SearchProducts.tsx';
import { useProductSearch } from '../../hooks/useProductSearch.ts';

interface Props {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
}

export const ProductManagement = ({
  products,
  onProductUpdate,
  onProductAdd,
}: Props) => {
  const { keyword, setKeyword, filteredProducts } = useProductSearch(products);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
        <SearchProducts
          keyword={keyword}
          setKeyword={setKeyword}
        ></SearchProducts>
      </div>

      {/* Add Product  */}
      <AddProduct onProductAdd={onProductAdd}></AddProduct>

      {/* Edit Product  */}
      <div className="space-y-2">
        {filteredProducts.map((product: Product, index: number) => {
          return (
            <ShowProduct
              key={product.id}
              product={product}
              index={index}
              onProductUpdate={onProductUpdate}
            ></ShowProduct>
          );
        })}
      </div>
    </div>
  );
};
