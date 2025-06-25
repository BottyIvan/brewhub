import React from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/16/solid";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;
  // Calculate the first page number to display (at most 2 before current page)
  const startPage = Math.max(1, currentPage - 2);

  // Calculate the last page number to display (at most 2 after current page)
  const endPage = Math.min(totalPages, currentPage + 2);

  // Generate the array of page numbers to render in the pagination
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const handleClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ChevronLeftIcon className="inline-block w-4 h-4" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handleClick(page)}
          className={`px-3 py-1 rounded-md border ${
            page === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          } transition`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ChevronRightIcon className="inline-block w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
