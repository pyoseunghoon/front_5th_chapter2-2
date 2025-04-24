import { Product } from '../../../types.ts';
import { useNewProductForm } from '../../hooks/useNewProductForm.ts';
import { useProductAddHandler } from '../../hooks/useProductAddHandler.ts';

interface Props {
  onProductAdd: (newProduct: Product) => void;
}

export const AddProduct = ({ onProductAdd }: Props) => {
  const { showNewProductForm, updateShowFormFlag } = useNewProductForm(false);
  const {
    newProduct,
    updateNewProduct,
    handleAddNewProduct,
    resetForm,
    showSnackbar,
  } = useProductAddHandler(onProductAdd, updateShowFormFlag);

  return (
    <>
      <button
        onClick={() => {
          if (showNewProductForm) {
            // '취소' 버튼 일 때 클릭시, 임시 저장된 데이터 제거
            resetForm();
          }
          updateShowFormFlag(!showNewProductForm);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </button>
      {showNewProductForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
          <div className="mb-2">
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              상품명
            </label>
            <input
              id="productName"
              type="text"
              value={newProduct.name}
              onChange={(e) => updateNewProduct('name', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700"
            >
              가격
            </label>
            <input
              id="productPrice"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                updateNewProduct('price', parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="productStock"
              className="block text-sm font-medium text-gray-700"
            >
              재고
            </label>
            <input
              id="productStock"
              type="number"
              value={newProduct.stock}
              onChange={(e) =>
                updateNewProduct('stock', parseInt(e.target.value))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAddNewProduct}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      )}

      {showSnackbar && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in-out">
          입력 내용이 자동 저장되었습니다
        </div>
      )}
    </>
  );
};
