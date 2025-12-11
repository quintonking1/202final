import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import LocationFilter from './filters/LocationFilter'
import RouteTypeFilter from './filters/RouteTypeFilter'
import DifficultyFilter from './filters/DifficultyFilter'
import LengthFilter from './filters/LengthFilter'
import RatingFilter from './filters/RatingFilter'

const DesktopFilterBar = ({ activeFilters, onFilterChange, onMoreFiltersClick, locationHierarchy, routes }) => {
    const [openFilter, setOpenFilter] = useState(null)
    const containerRef = useRef(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpenFilter(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleFilter = (filterName) => {
        setOpenFilter(openFilter === filterName ? null : filterName)
    }

    // Helper to check if a filter category has active values
    const hasActiveFilters = (category) => {
        switch (category) {
            case 'location': return activeFilters.locations.length > 0
            case 'type': return activeFilters.types.length > 0
            case 'difficulty': return activeFilters.difficulties.length > 0
            case 'length': return activeFilters.lengths.length > 0
            case 'rating': return activeFilters.rating !== 'Any rating'
            default: return false
        }
    }

    const getButtonClass = (category) => {
        const isActive = hasActiveFilters(category)
        const isOpen = openFilter === category
        
        return `px-4 py-2 rounded-full text-sm font-medium border transition-colors flex items-center gap-2 ${
            isActive || isOpen
                ? 'bg-[#202020] text-white border-[#202020]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
        }`
    }

    const updateFilter = (category, value) => {
        onFilterChange({ ...activeFilters, [category]: value })
    }

    return (
        <div ref={containerRef} className="hidden lg:flex flex-wrap items-center gap-3 py-4 border-b border-gray-200">
            
            {/* Location Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => toggleFilter('location')}
                    className={getButtonClass('location')}
                >
                    Location
                    {activeFilters.locations.length > 0 && (
                        <span className="bg-white text-black text-xs px-1.5 rounded-full">
                            {activeFilters.locations.length}
                        </span>
                    )}
                    <ChevronDown />
                </button>
                {openFilter === 'location' && (
                    <div className="absolute top-full mt-2 left-0 w-[320px] bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 max-h-[60vh] overflow-y-auto">
                        <LocationFilter
                            selectedLocations={activeFilters.locations}
                            onChange={(val) => updateFilter('locations', val)}
                            locationHierarchy={locationHierarchy}
                            routes={routes}
                        />
                    </div>
                )}
            </div>

            {/* Type Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => toggleFilter('type')}
                    className={getButtonClass('type')}
                >
                    Type
                    {activeFilters.types.length > 0 && (
                        <span className="bg-white text-black text-xs px-1.5 rounded-full">
                            {activeFilters.types.length}
                        </span>
                    )}
                    <ChevronDown />
                </button>
                {openFilter === 'type' && (
                    <div className="absolute top-full mt-2 left-0 w-[300px] bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                        <RouteTypeFilter
                            selectedTypes={activeFilters.types}
                            onChange={(val) => updateFilter('types', val)}
                        />
                    </div>
                )}
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => toggleFilter('difficulty')}
                    className={getButtonClass('difficulty')}
                >
                    Difficulty
                    {activeFilters.difficulties.length > 0 && (
                        <span className="bg-white text-black text-xs px-1.5 rounded-full">
                            {activeFilters.difficulties.length}
                        </span>
                    )}
                    <ChevronDown />
                </button>
                {openFilter === 'difficulty' && (
                    <div className="absolute top-full mt-2 left-0 w-[340px] bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 max-h-[60vh] overflow-y-auto">
                        <DifficultyFilter
                            selectedDifficulties={activeFilters.difficulties}
                            onChange={(val) => updateFilter('difficulties', val)}
                        />
                    </div>
                )}
            </div>

            {/* Length Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => toggleFilter('length')}
                    className={getButtonClass('length')}
                >
                    Length
                    {activeFilters.lengths.length > 0 && (
                        <span className="bg-white text-black text-xs px-1.5 rounded-full">
                            {activeFilters.lengths.length}
                        </span>
                    )}
                    <ChevronDown />
                </button>
                {openFilter === 'length' && (
                    <div className="absolute top-full mt-2 left-0 w-[320px] bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                        <LengthFilter
                            selectedLengths={activeFilters.lengths}
                            onChange={(val) => updateFilter('lengths', val)}
                        />
                    </div>
                )}
            </div>

            {/* Rating Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => toggleFilter('rating')}
                    className={getButtonClass('rating')}
                >
                    Rating
                    {activeFilters.rating !== 'Any rating' && (
                        <span className="bg-white text-black text-xs px-1.5 rounded-full">1</span>
                    )}
                    <ChevronDown />
                </button>
                {openFilter === 'rating' && (
                    <div className="absolute top-full mt-2 left-0 w-[320px] bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
                        <RatingFilter
                            selectedRating={activeFilters.rating}
                            onChange={(val) => updateFilter('rating', val)}
                        />
                    </div>
                )}
            </div>

            {/* Clear All Button - Only shows if there are active filters */}
            {(activeFilters.locations.length > 0 || 
              activeFilters.types.length > 0 || 
              activeFilters.difficulties.length > 0 || 
              activeFilters.lengths.length > 0 || 
              activeFilters.rating !== 'Any rating') && (
                <button
                    onClick={() => onFilterChange({
                        locations: [],
                        types: [],
                        difficulties: [],
                        lengths: [],
                        rating: 'Any rating'
                    })}
                    className="ml-auto text-sm text-gray-500 hover:text-black underline"
                >
                    Clear all
                </button>
            )}
        </div>
    )
}

const ChevronDown = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
)

DesktopFilterBar.propTypes = {
    activeFilters: PropTypes.shape({
        locations: PropTypes.arrayOf(PropTypes.string),
        types: PropTypes.arrayOf(PropTypes.string),
        difficulties: PropTypes.arrayOf(PropTypes.string),
        lengths: PropTypes.arrayOf(PropTypes.string),
        rating: PropTypes.string
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onMoreFiltersClick: PropTypes.func.isRequired,
    locationHierarchy: PropTypes.object,
    routes: PropTypes.array
}

export default DesktopFilterBar
