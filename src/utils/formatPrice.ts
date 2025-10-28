export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceSimple = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const calculateDiscount = (mrp: number, price: number): number => {
  return Math.round(((mrp - price) / mrp) * 100);
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};
