import React from 'react';
import { Search } from 'lucide-react';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search...", 
  filters = [], 
  activeFilter, 
  onFilterChange 
}) => {
  return (
    <div className="glass-effect p-6 rounded-xl mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
        {filters.length > 0 && (
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;