import { useCallback, useState } from 'react';

export const useNewProductForm = (initalFlag: boolean) => {
  const [showNewProductForm, setShowNewProductForm] = useState(initalFlag);

  const updateShowFormFlag = useCallback((flag) => {
    setShowNewProductForm((prev) => flag);
  }, []);

  return {
    showNewProductForm,
    updateShowFormFlag,
  };
};
