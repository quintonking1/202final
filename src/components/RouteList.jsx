import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import RouteCard from './RouteCard'

const RouteList = ({ routes, onRouteClick }) => {
    const listContainerRef = useRef(null)
    const [currentPage, setCurrentPage] = useState(1)
    const routesPerPage = 20

    // Reset to page 1 when routes change (e.g., after filtering)
    useEffect(() => {
        setCurrentPage(1)
    }, [routes])

    // Calculate pagination
    const totalPages = Math.ceil(routes.length / routesPerPage)
    const startIndex = (currentPage - 1) * routesPerPage
    const endIndex = startIndex + routesPerPage
    const currentRoutes = routes.slice(startIndex, endIndex)

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        // Scroll to top of route list container
        if (listContainerRef.current) {
            listContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const getPageNumbers = () => {
        const pages = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            // Calculate range around current page
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push('...')
            }

            // Add pages around current page
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push('...')
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    if (routes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No routes found</h3>
                <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
            </div>
        )
    }

    return (
        <div ref={listContainerRef} className="flex flex-col gap-4 w-full">
            {/* Route cards list */}
            <div className="flex flex-col gap-4 w-full">
                {currentRoutes.map((route) => (
                    <div
                        key={route.id}
                        onClick={() => onRouteClick && onRouteClick(route)}
                        className="cursor-pointer w-full"
                    >
                        <RouteCard route={route} />
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 pb-4 border-t border-gray-200">
                    {/* Previous Button */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        ← Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-[#202020] text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Results Info */}
            <div className="text-center text-sm text-gray-500 pb-4">
                Showing {startIndex + 1}-{Math.min(endIndex, routes.length)} of {routes.length} routes
            </div>
        </div>
    )
}

RouteList.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        grade: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        stars: PropTypes.number.isRequired,
        reviewCount: PropTypes.number.isRequired,
        pitches: PropTypes.number.isRequired,
        lengthFt: PropTypes.number.isRequired,
        area: PropTypes.string.isRequired,
        crag: PropTypes.string.isRequired,
        features: PropTypes.arrayOf(PropTypes.string)
    })).isRequired,
    onRouteClick: PropTypes.func
}

export default RouteList
