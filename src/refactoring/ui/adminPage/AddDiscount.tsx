import { useDiscount } from '../../hooks/useDiscount.ts';
import { updateDiscountToProduct } from '../../models/product.ts';
import { Product } from '../../../types.ts';
import { getPercentage } from '../../models/util.ts';

interface Props {
  editingProduct: Product;
  setEditingProduct: (
    value: ((prevState: Product) => Product) | Product,
  ) => void;
  onProductUpdate: (updatedProduct: Product) => void;
}
export function AddDiscount({
  editingProduct,
  setEditingProduct,
  onProductUpdate,
}: Props) {
  const { newDiscount, updateDiscountField, resetDiscountValues } =
    useDiscount();

  const handleAddDiscount = () => {
    const updatedProduct = updateDiscountToProduct(editingProduct, newDiscount);
    console.log('updatedProduct', updatedProduct);
    setEditingProduct(updatedProduct);
    onProductUpdate(updatedProduct);
    resetDiscountValues();
  };

  return (
    <div className="flex space-x-2">
      <input
        type="number"
        placeholder="수량"
        value={newDiscount.quantity}
        onChange={(e) =>
          updateDiscountField('quantity', parseInt(e.target.value))
        }
        className="w-1/3 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="할인율 (%)"
        value={getPercentage(newDiscount.rate)}
        onChange={(e) =>
          updateDiscountField('rate', parseInt(e.target.value) / 100)
        }
        className="w-1/3 p-2 border rounded"
      />
      <button
        onClick={handleAddDiscount}
        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        할인 추가
      </button>
    </div>
  );
}
