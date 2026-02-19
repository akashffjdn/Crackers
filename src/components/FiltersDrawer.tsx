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

  const handleReset = () => {
    setPriceRange([0, 1000]);
    setSoundLevel('');
    setRating(0);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-surface-900 border-l border-white/[0.06] z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Filters */}
          <div className="space-y-8 flex-1 overflow-y-auto">
            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-3">
                Price Range
              </label>
              <p className="text-sm text-accent font-medium mb-3">₹{priceRange[0]} — ₹{priceRange[1]}</p>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-accent"
              />
            </div>

            {/* Sound Level */}
            <div>
              <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-3">
                Sound Level
              </label>
              <div className="flex flex-wrap gap-2">
                {['', 'Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSoundLevel(level)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${soundLevel === level
                        ? 'bg-accent text-white'
                        : 'bg-white/[0.04] text-surface-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                      }`}
                  >
                    {level || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-3">
                Minimum Rating
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 2, 3, 4].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${rating === r
                        ? 'bg-accent text-white'
                        : 'bg-white/[0.04] text-surface-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                      }`}
                  >
                    {r === 0 ? 'All' : `${r}+ Stars`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-white/[0.06]">
            <button onClick={handleApply} className="flex-1 btn-primary py-3">
              Apply
            </button>
            <button onClick={handleReset} className="flex-1 btn-secondary py-3">
              Clear
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FiltersDrawer;
