import { useState } from 'react';
import { Product } from '../../types.ts';

export const useEditProductForm = (
  onProductUpdate: (updatedProduct: Product) => void,
  initalFlag: boolean = false,
) => {
  const [isEditing, setIsEditing] = useState<boolean>(initalFlag);

  // 수정화면 open flag setting
  function openEditMode() {
    if (isEditing) {
      return;
    }

    setIsEditing(true);
  }

  const handleEditComplete = (newProduct: Product) => {
    if (isEditing) {
      // 저장 후 수정 모드 종료
      onProductUpdate(newProduct);
      setIsEditing(false);
      return;
    }
  };

  return {
    isEditing,
    openEditMode,
    handleEditComplete,
  };
};
