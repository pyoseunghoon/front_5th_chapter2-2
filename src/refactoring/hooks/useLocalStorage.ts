export const useLocalStorage = <T = unknown>() => {
  const getItem = (key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const setItem = (key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  return { getItem, setItem, removeItem };
};
