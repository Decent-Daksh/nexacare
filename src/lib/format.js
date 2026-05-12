export const formatINR = (n) => {
  if (n === null || n === undefined) return "—";
  return "₹" + Number(n).toLocaleString("en-IN");
};

export const formatAmount = (n, currency) => {
  if (n === null || n === undefined) return "—";
  return currency.symbol + Number(n).toLocaleString(currency.locale);
};
