import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    // Always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;
    
    // Calculate range for sibling pages around current page
    const leftSiblingStart = Math.max(firstPage, currentPage - siblingCount);
    const rightSiblingEnd = Math.min(lastPage, currentPage + siblingCount);
    
    // Determine if we need ellipsis
    const showLeftEllipsis = leftSiblingStart > firstPage + 1;
    const showRightEllipsis = rightSiblingEnd < lastPage - 1;
    
    // Gather all page numbers
    const pageNumbers: (number | string)[] = [];
    
    // Always show first page
    pageNumbers.push(firstPage);
    
    // Show left ellipsis if needed
    if (showLeftEllipsis) {
      pageNumbers.push('...');
    } else if (firstPage < leftSiblingStart - 1) {
      // If we're not showing ellipsis but there's still a gap, show the page in between
      pageNumbers.push(firstPage + 1);
    }
    
    // Add sibling pages
    for (let i = leftSiblingStart; i <= rightSiblingEnd; i++) {
      if (i !== firstPage && i !== lastPage) {
        pageNumbers.push(i);
      }
    }
    
    // Show right ellipsis if needed
    if (showRightEllipsis) {
      pageNumbers.push('...');
    } else if (rightSiblingEnd < lastPage - 1) {
      // If we're not showing ellipsis but there's still a gap, show the page in between
      pageNumbers.push(lastPage - 1);
    }
    
    // Always show last page if there's more than one page
    if (lastPage !== firstPage) {
      pageNumbers.push(lastPage);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={`flex justify-center mt-8 ${className}`}
      aria-label="Pagination"
    >
      <ul className="flex items-center -space-x-px h-10">
        {/* Previous button */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight rounded-l-lg border
              ${currentPage === 1
                ? 'text-gray-300 bg-white border-gray-300 cursor-not-allowed'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
              }`}
            aria-label="Previous page"
          >
            <span className="sr-only">Previous</span>
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          // For ellipsis
          if (page === '...') {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-400 bg-white border border-gray-300">
                  ...
                </span>
              </li>
            );
          }

          // For page numbers
          const pageNum = page as number;
          const isCurrentPage = pageNum === currentPage;

          return (
            <li key={pageNum}>
              <button
                onClick={() => handlePageChange(pageNum)}
                className={`flex items-center justify-center px-4 h-10 leading-tight border
                  ${isCurrentPage
                    ? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                aria-current={isCurrentPage ? 'page' : undefined}
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </button>
            </li>
          );
        })}

        {/* Next button */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-4 h-10 leading-tight rounded-r-lg border
              ${currentPage === totalPages
                ? 'text-gray-300 bg-white border-gray-300 cursor-not-allowed'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
              }`}
            aria-label="Next page"
          >
            <span className="sr-only">Next</span>
            <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};
