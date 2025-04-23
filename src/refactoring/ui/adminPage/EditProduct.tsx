import { Product } from '../../../types.ts';
import { EditDiscount } from './EditDiscount.tsx';
import { useProdcutEditHandler } from '../../hooks/useProdcutEditHandler.ts';

interface Props {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
  handleEditComplete: (newProduct: Product) => void;
}

export const EditProduct = ({
  product,
  onProductUpdate,
  handleEditComplete,
}: Props) => {
  const {
    editingProduct,
    setEditingProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
  } = useProdcutEditHandler(product, onProductUpdate);

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => handleProductNameUpdate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) => handlePriceUpdate(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) => handleStockUpdate(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* 할인 정보 수정 부분 */}
      <EditDiscount
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        onProductUpdate={onProductUpdate}
      ></EditDiscount>

      <button
        onClick={() => {
          handleEditComplete(editingProduct);
        }}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  );
};
