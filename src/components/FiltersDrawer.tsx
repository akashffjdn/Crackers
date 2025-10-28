import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [soundLevel, setSoundLevel] = useState('');
  const [rating, setRating] = useState(0);

  const handleApply = () => {
    onApplyFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      soundLevel,
      rating
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform translate-x-0 transition-transform duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Filter Products</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FaTimes />
            </button>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full"
              />
            </div>

            {/* Sound Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sound Level</label>
              <select
                value={soundLevel}
                onChange={(e) => setSoundLevel(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Levels</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="0">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleApply}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setPriceRange([0, 1000]);
                  setSoundLevel('');
                  setRating(0);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FiltersDrawer;
