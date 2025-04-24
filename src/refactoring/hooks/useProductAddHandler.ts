import { useMemo, useState } from 'react';
import { Product } from '../../types.ts';
import { defaultProduct } from '../models/product.ts';
import { debounce } from '../models/util.ts';
import { useLocalStorage } from './useLocalStorage.ts';

const STORAGE_KEY = 'draftProduct';

export const useProductAddHandler = (
  onProductAdd: (newProduct: Product) => void,
  updateShowFormFlag: (flag: boolean) => void,
) => {
  const { getItem, setItem, removeItem } =
    useLocalStorage<Omit<Product, 'id'>>();

  // 최초 마운트 시 임시저장된 데이터 복원
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(() => {
    const saved = getItem(STORAGE_KEY);
    return saved ? saved : defaultProduct;
  });

  // snackbar
  const [showSnackbar, setShowSnackbar] = useState(false);

  const updateNewProduct = (key: keyof Product, value: string | number) => {
    const updated = { ...newProduct, [key]: value };
    setNewProduct(updated);
    debouncedAutoSave(updated);
  };

  // 입력 멈춘 후 5초 후 저장
  const debouncedAutoSave = useMemo(
    () =>
      debounce((draft: Omit<Product, 'id'>) => {
        setItem(STORAGE_KEY, draft);

        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 2500);
      }, 5000),
    [],
  );

  const handleAddNewProduct = () => {
    const productWithId: Product = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);

    // 폼 초기화
    setNewProduct(defaultProduct);

    removeItem(STORAGE_KEY);

    updateShowFormFlag(false);
  };

  const resetForm = () => {
    removeItem(STORAGE_KEY);
    setNewProduct(defaultProduct);
  };

  return {
    newProduct,
    updateNewProduct,
    handleAddNewProduct,
    resetForm,
    showSnackbar,
  };
};
