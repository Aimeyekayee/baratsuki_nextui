export const toLocaleFormat = (value: number, maximumDigit: number = 2) =>
  value.toLocaleString("en-US", { maximumFractionDigits: maximumDigit });
