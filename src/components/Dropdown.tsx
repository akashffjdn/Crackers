import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

interface DropdownOption {
  value: string;
  label: string;
  image?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder = 'Select...', label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {label && (
        <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.05] hover:border-white/[0.12] focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedOption?.image && (
            <img
              src={selectedOption.image}
              alt=""
              className="w-6 h-6 rounded-full object-cover border border-white/20 flex-shrink-0"
              onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
            />
          )}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <FaChevronDown
          className={`text-surface-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          size={12}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 py-2 rounded-xl bg-surface-800 border border-white/[0.12] shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                    value === option.value
                      ? 'bg-accent text-white'
                      : 'text-surface-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {option.image && (
                    <img
                      src={option.image}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover border border-white/20 flex-shrink-0"
                      onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                    />
                  )}
                  <span className="truncate">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
