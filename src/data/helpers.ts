import { Product, Category, FilterOptions } from './types';
import products from './products';
import categories from './categories';

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getBestSellerProducts = (): Product[] => {
  return products.filter(product => product.isBestSeller);
};

export const getNewArrivalProducts = (): Product[] => {
  return products.filter(product => product.isNewArrival);
};

export const getOnSaleProducts = (): Product[] => {
  return products.filter(product => product.isOnSale);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterProducts = (filters: FilterOptions): Product[] => {
  let filtered = products;

  if (filters.categoryId) {
    filtered = filtered.filter(product => product.categoryId === filters.categoryId);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= filters.maxPrice!);
  }

  if (filters.soundLevel) {
    filtered = filtered.filter(product => product.soundLevel === filters.soundLevel);
  }

  if (filters.rating !== undefined) {
    filtered = filtered.filter(product => product.rating >= filters.rating!);
  }

  return filtered;
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low-high':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high-low':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
      return sorted.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    default:
      return sorted;
  }
};
