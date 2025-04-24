import { Product } from '../../types.ts';
import { useEffect, useMemo, useState } from 'react';
import { debounce } from '../models/util.ts';

export const useProductSearch = (products: Product[]) => {
  const [keyword, setKeyword] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // 디바운스 함수 생성 (setFilteredProducts 내부에서 필터링 실행)
  const debouncedFilter = useMemo(
    () =>
      debounce((nextKeyword: string) => {
        if (!nextKeyword.trim()) {
          setFilteredProducts(products);
        } else {
          setFilteredProducts(
            products.filter((product) =>
              product.name.toLowerCase().includes(nextKeyword.toLowerCase()),
            ),
          );
        }
      }, 300),
    [products],
  );

  // keyword 변경 시마다 debounce 적용
  useEffect(() => {
    debouncedFilter(keyword);
  }, [keyword, debouncedFilter]);

  return {
    keyword,
    setKeyword,
    filteredProducts,
  };
};
