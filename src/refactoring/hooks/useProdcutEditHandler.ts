import { Product } from '../../types.ts';
import { useState } from 'react';

export const useProdcutEditHandler = (
  product: Product,
  onProductUpdate: (updatedProduct: Product) => void,
) => {
  const [editingProduct, setEditingProduct] = useState<Product>(product);

  const handleProductNameUpdate = (newName: string) => {
    const updatedProduct = { ...editingProduct, name: newName };
    setEditingProduct(updatedProduct);
  };

  const handlePriceUpdate = (newPrice: number) => {
    const updatedProduct = { ...editingProduct, price: newPrice };
    setEditingProduct(updatedProduct);
  };

  const handleStockUpdate = (newStock: number) => {
    const updatedProduct = { ...editingProduct, stock: newStock };
    setEditingProduct(updatedProduct);
    onProductUpdate(updatedProduct);
  };

  return {
    editingProduct,
    setEditingProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
  };
};
