import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        // Always show first page
        pageNumbers.push(1);

        // Show ellipsis if needed
        if (currentPage > 3) {
            pageNumbers.push('...');
        }

        // Show pages around current page
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
                pageNumbers.push(i);
            }
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            pageNumbers.push('...');
        }

        // Always show last page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return [...new Set(pageNumbers)]; // Remove duplicates
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="join">
            <button 
                className="join-item btn" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            >
                «
            </button>
            {renderPageNumbers().map((page, index) => (
                <button 
                    key={index} 
                    className={`join-item btn ${page === '...' ? 'btn-disabled' : ''} ${page === currentPage ? 'btn-active' : ''}`}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                >
                    {page}
                </button>
            ))}
            <button 
                className="join-item btn" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
            >
                »
            </button>
        </div>
    );
};

export default Pagination;
