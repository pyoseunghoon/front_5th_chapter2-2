export const getLocaleString = (value) => {
  return value.toLocaleString();
};

export const formatFixed = (value: number, digits: number): string => {
  return value.toFixed(digits);
};
