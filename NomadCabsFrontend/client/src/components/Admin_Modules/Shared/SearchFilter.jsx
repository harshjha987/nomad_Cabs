import { Search, Filter } from "lucide-react";

const SearchFilter = ({ 
  filterType, 
  onFilterChange, 
  searchTerm, 
  onSearchChange, 
  filterOptions,
  placeholder 
}) => (
  <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 mb-8 shadow-lg">
    <div className="grid gap-6 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-medium tracking-wide uppercase text-white/40 flex items-center gap-2">
          <Filter className="w-3 h-3" />
          Filter By
        </label>
        <select
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value)}
          className="h-11 rounded-xl bg-[#1b1b1b] border border-white/10 text-sm px-3 text-white focus:outline-none focus:ring-2 focus:ring-white/15"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1b1b1b]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-[11px] font-medium tracking-wide uppercase text-white/40">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full rounded-xl bg-[#1b1b1b] border border-white/10 text-sm px-11 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/15"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        </div>
      </div>
    </div>
  </div>
);

export default SearchFilter;