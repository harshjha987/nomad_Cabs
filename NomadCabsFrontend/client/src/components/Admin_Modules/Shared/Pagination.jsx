import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 7;
    
    if (totalPages <= showPages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    
    if (currentPage < 4) {
      return Array.from({ length: Math.min(showPages, totalPages) }, (_, i) => i);
    }
    
    if (currentPage > totalPages - 4) {
      return Array.from({ length: showPages }, (_, i) => totalPages - showPages + i);
    }
    
    return Array.from({ length: showPages }, (_, i) => currentPage - 3 + i);
  };

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex items-center gap-2 bg-[#141414] border border-white/10 rounded-full px-3 py-2 shadow-lg">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`h-9 w-9 rounded-full text-sm font-medium transition ${
              currentPage === pageNum
                ? "bg-white text-black shadow"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {pageNum + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="h-9 w-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;