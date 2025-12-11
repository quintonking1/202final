import { useEffect } from 'react'
import PropTypes from 'prop-types'
import LocationFilter from './filters/LocationFilter'
import RouteTypeFilter from './filters/RouteTypeFilter'
import DifficultyFilter from './filters/DifficultyFilter'
import LengthFilter from './filters/LengthFilter'
import RatingFilter from './filters/RatingFilter'
import { filterRoutes } from '../utils/filterRoutes'

const FilterModal = ({ isOpen, onClose, onApply, draftFilters, setDraftFilters, locationHierarchy, routes, searchQuery }) => {
    // Calculate live count based on draft filters
    const liveCount = filterRoutes(routes, draftFilters, searchQuery).length
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleClearAll = () => {
        setDraftFilters({
            locations: [],
            types: [],
            difficulties: [],
            lengths: [],
            rating: 'Any rating'
        })
    }

    return (
        <div className={`fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="p-1 cursor-pointer"
                        aria-label="Go back"
                    >
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold text-black">Filters</h2>
                </div>
                <button
                    onClick={handleClearAll}
                    className="text-base text-[#5e5e5e] underline cursor-pointer"
                >
                    Clear all
                </button>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto px-4 py-8" style={{ paddingBottom: '120px' }}>
                <div className="flex flex-col gap-10 max-w-[358px]">
                    {/* Location Filter */}
                    <LocationFilter
                        selectedLocations={draftFilters.locations}
                        onChange={(locations) => setDraftFilters({ ...draftFilters, locations })}
                        locationHierarchy={locationHierarchy}
                        routes={routes}
                    />

                    {/* Route Type Filter */}
                    <RouteTypeFilter
                        selectedTypes={draftFilters.types}
                        onChange={(types) => setDraftFilters({ ...draftFilters, types })}
                    />

                    {/* Difficulty Filter */}
                    <DifficultyFilter
                        selectedDifficulties={draftFilters.difficulties}
                        onChange={(difficulties) => setDraftFilters({ ...draftFilters, difficulties })}
                    />

                    {/* Length Filter */}
                    <LengthFilter
                        selectedLengths={draftFilters.lengths}
                        onChange={(lengths) => setDraftFilters({ ...draftFilters, lengths })}
                    />

                    {/* Rating Filter */}
                    <RatingFilter
                        selectedRating={draftFilters.rating}
                        onChange={(rating) => setDraftFilters({ ...draftFilters, rating })}
                    />
                </div>
            </div>

            {/* Fixed bottom button */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                <button
                    onClick={onApply}
                    className="bg-[#202020] text-white px-10 py-5 rounded-[41px] shadow-lg cursor-pointer pointer-events-auto"
                >
                    <span className="text-sm font-medium whitespace-nowrap">Show {liveCount} routes</span>
                </button>
            </div>
        </div>
    )
}

FilterModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    draftFilters: PropTypes.shape({
        locations: PropTypes.arrayOf(PropTypes.string).isRequired,
        types: PropTypes.arrayOf(PropTypes.string).isRequired,
        difficulties: PropTypes.arrayOf(PropTypes.string).isRequired,
        lengths: PropTypes.arrayOf(PropTypes.string).isRequired,
        rating: PropTypes.string.isRequired
    }).isRequired,
    setDraftFilters: PropTypes.func.isRequired,
    locationHierarchy: PropTypes.object.isRequired,
    routes: PropTypes.array.isRequired,
    searchQuery: PropTypes.string.isRequired
}

export default FilterModal

