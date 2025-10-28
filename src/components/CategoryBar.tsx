import React from 'react';
import { Link, useParams } from 'react-router-dom';
import categories from '../data/categories';

const CategoryBar: React.FC = () => {
  const { categoryId } = useParams();

  return (
    <div className="bg-white border-b sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto py-4">
          <Link
            to="/shop"
            className={`whitespace-nowrap pb-2 border-b-2 font-medium text-sm ${
              !categoryId
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Categories
          </Link>
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/products/${category.id}`}
              className={`whitespace-nowrap pb-2 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                categoryId === category.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
