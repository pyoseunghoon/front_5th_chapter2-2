import { useCallback, useState } from 'react';

export const useNewProductForm = (initalFlag: boolean) => {
  const [showNewProductForm, setShowNewProductForm] = useState(initalFlag);

  const updateShowFormFlag = useCallback((flag: boolean) => {
    setShowNewProductForm((_prev: boolean) => flag);
  }, []);

  return {
    showNewProductForm,
    updateShowFormFlag,
  };
};
