export const getLocaleString = (value: number): string => {
  return value.toLocaleString();
};

export const getPercentage = (value: number) => {
  return value * 100;
};

export const formatFixed = (value: number, digits: number): string => {
  return value.toFixed(digits);
};

export function debounce(callback: (...args: any[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
