import { Product } from '../../../types.ts';
import { EditProduct } from './EditProduct.tsx';
import { useOpenProductForm } from '../../hooks/useOpenProductForm.ts';
import { useEditProductForm } from '../../hooks/useEditProductForm.ts';
import { getPercentage } from '../../models/util.ts';

interface Props {
  product: Product;
  index: number;
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ShowProduct = ({ product, index, onProductUpdate }: Props) => {
  const { isOpen, updateIsOpenFlag } = useOpenProductForm();

  const { isEditing, openEditMode, handleEditComplete } =
    useEditProductForm(onProductUpdate);

  return (
    <>
      <div
        key={product.id}
        data-testid={`product-${index + 1}`}
        className="bg-white p-4 rounded shadow"
      >
        <button
          data-testid="toggle-button"
          onClick={updateIsOpenFlag}
          className="w-full text-left font-semibold"
        >
          {product.name} - {product.price}원 (재고: {product.stock})
        </button>
        {isOpen && (
          <div className="mt-2">
            {isEditing ? (
              <EditProduct
                product={product}
                onProductUpdate={onProductUpdate}
                handleEditComplete={handleEditComplete}
              ></EditProduct>
            ) : (
              <div>
                {product.discounts.map((discount, index) => (
                  <div key={index} className="mb-2">
                    <span>
                      {discount.quantity}개 이상 구매 시{' '}
                      {getPercentage(discount.rate)}% 할인
                    </span>
                  </div>
                ))}
                <button
                  data-testid="modify-button"
                  onClick={openEditMode}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                >
                  수정
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
