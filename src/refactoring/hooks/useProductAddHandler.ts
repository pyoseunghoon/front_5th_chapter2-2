import { useState } from 'react';
import { Product } from '../../types.ts';
import { defaultProduct } from '../models/product.ts';

export const useProductAddHandler = (
  onProductAdd: (newProduct: Product) => void,
  updateShowFormFlag: (flag: any) => void,
) => {
  const [newProduct, setNewProduct] =
    useState<Omit<Product, 'id'>>(defaultProduct);

  const updateNewProduct = (key, value) => {
    setNewProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddNewProduct = () => {
    const productWithId: Product = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);

    // 폼 초기화
    setNewProduct(defaultProduct);
    updateShowFormFlag(false);
  };

  return { newProduct, updateNewProduct, handleAddNewProduct };
};
