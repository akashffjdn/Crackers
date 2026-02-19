import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';

const CategoryBar: React.FC = () => {
  const { categories } = useCategories();
  const location = useLocation();

  const currentCategoryId = location.pathname.split('/products/')[1] || '';

  const allCategories = [
    { id: '', name: 'All' },
    ...categories.map((cat: any) => ({ id: cat.id || cat._id, name: cat.name })),
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 py-2 min-w-max">
        {allCategories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.id ? `/products/${cat.id}` : '/products'}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${currentCategoryId === cat.id
              ? 'bg-accent text-white'
              : 'bg-white/[0.04] text-surface-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
              }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
