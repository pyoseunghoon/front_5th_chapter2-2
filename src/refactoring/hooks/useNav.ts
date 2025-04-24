import { useState } from 'react';

export const useNav = (initialStatus: boolean) => {
  const [isAdmin, setIsAdmin] = useState(initialStatus);

  function switchPage() {
    setIsAdmin((prevStatus) => !prevStatus);
  }

  return {
    isAdmin,
    switchPage,
  };
};
