export const formatINR = (n) => {
<<<<<<< HEAD
  if (n === null || n === undefined) return "—";
  return "₹" + Number(n).toLocaleString("en-IN");
=======
  if (n === null || n === undefined) return '—';
  return '₹' + Number(n).toLocaleString('en-IN');
>>>>>>> main
};
