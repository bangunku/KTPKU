import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav
      id="pagination"
      aria-label="Navigasi Halaman"
      className="mt-6 bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      <div className="text-xs text-slate-600 font-mono tabular-nums">
        Menampilkan <span className="font-semibold text-slate-900">{startItem}</span>
        {' – '}
        <span className="font-semibold text-slate-900">{endItem}</span> dari{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="min-h-[40px] min-w-[40px] px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="min-h-[40px] min-w-[40px] px-3 rounded-lg text-xs font-mono font-semibold text-slate-700 hover:bg-slate-100 tabular-nums cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-1 text-xs text-slate-400 select-none">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`min-h-[40px] min-w-[40px] px-3 rounded-lg text-xs font-mono font-semibold tabular-nums transition-colors cursor-pointer ${
              page === currentPage
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 text-xs text-slate-400 select-none">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="min-h-[40px] min-w-[40px] px-3 rounded-lg text-xs font-mono font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 tabular-nums cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className="min-h-[40px] min-w-[40px] px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
