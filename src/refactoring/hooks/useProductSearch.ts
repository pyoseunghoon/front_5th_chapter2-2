import { Product } from '../../types.ts';
import { useState } from 'react';

export const useProductSearch = (products: Product[]) => {
  const [keyword, setKeyword] = useState('');

  const filteredProducts = (): Product[] => {
    // 빈 공백일 때 -> 전체 상품 검색
    if (!keyword.trim()) return products;

    return products.filter((product) => {
      return product.name.toLowerCase().includes(keyword.toLowerCase());
    });
  };

  return {
    keyword,
    setKeyword,
    filteredProducts: filteredProducts(),
  };
};
