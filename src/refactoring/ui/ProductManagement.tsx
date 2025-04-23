import { AddProduct } from './AddProduct.tsx';
import { Product } from '../../types.ts';
import { ShowProduct } from './showProduct.tsx';

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
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
      {/* Add Product  */}
      <AddProduct onProductAdd={onProductAdd}></AddProduct>

      {/* Edit Product  */}
      <div className="space-y-2">
        {products.map((product: Product, index: number) => {
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
