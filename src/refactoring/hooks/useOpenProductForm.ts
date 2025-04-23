import { useCallback, useState } from 'react';

export const useOpenProductForm = (initalFlag: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initalFlag);

  const updateIsOpenFlag = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    updateIsOpenFlag,
  };
};
