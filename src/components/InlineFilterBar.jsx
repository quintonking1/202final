import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import LocationFilter from './filters/LocationFilter'
import RouteTypeFilter from './filters/RouteTypeFilter'
import DifficultyFilter from './filters/DifficultyFilter'
import LengthFilter from './filters/LengthFilter'
import RatingFilter from './filters/RatingFilter'

const InlineFilterBar = ({ activeFilters, onFilterChange, locationHierarchy, routes, minimized = false }) => {
    const [openFilter, setOpenFilter] = useState(null)
    const containerRef = useRef(null)
    const buttonRefs = useRef({})

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
        
        // Adjust sizing based on minimized prop
        const paddingClass = minimized ? 'px-3 py-1.5' : 'px-4 py-2'
        const textSizeClass = minimized ? 'text-xs' : 'text-sm'
        
        return `${paddingClass} rounded-full ${textSizeClass} font-medium border transition-[padding,font-size] duration-300 flex items-center gap-2 whitespace-nowrap shrink-0 ${
            isActive || isOpen
                ? 'bg-[#202020] text-white border-[#202020]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
        }`
    }

    const updateFilter = (category, value) => {
        onFilterChange({ ...activeFilters, [category]: value })
    }

    // Dropdown styles - Fixed on mobile, Absolute on desktop
    const getDropdownClass = () => {
        return "fixed left-4 right-4 mt-2 lg:absolute lg:left-0 lg:right-auto lg:w-[320px] bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-[100] max-h-[60vh] overflow-y-auto"
    }

    const CloseButton = () => (
        <button 
            onClick={() => setOpenFilter(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 z-10"
            aria-label="Close filter"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    )

    const FilterButton = ({ category, label, count }) => (
        <button 
            ref={(el) => buttonRefs.current[category] = el}
            onClick={() => toggleFilter(category)}
            className={getButtonClass(category)}
        >
            {label}
            {count > 0 && (
                <span className="bg-white text-black text-xs px-1.5 rounded-full">
                    {count}
                </span>
            )}
            <ChevronDown />
        </button>
    )

    return (
        <div ref={containerRef} className="relative">
            {/* Scrollable Buttons Container */}
            <div 
                className={`flex items-center gap-3 border-b border-gray-200 transition-[padding] duration-300 bg-white
                    ${minimized ? 'py-2' : 'py-4'} 
                    lg:flex-wrap overflow-x-auto no-scrollbar`}
            >
                <FilterButton 
                    category="location" 
                    label="Location" 
                    count={activeFilters.locations.length} 
                />
                
                <FilterButton 
                    category="type" 
                    label="Type" 
                    count={activeFilters.types.length} 
                />
                
                <FilterButton 
                    category="difficulty" 
                    label="Difficulty" 
                    count={activeFilters.difficulties.length} 
                />
                
                <FilterButton 
                    category="length" 
                    label="Length" 
                    count={activeFilters.lengths.length} 
                />
                
                <FilterButton 
                    category="rating" 
                    label="Rating" 
                    count={activeFilters.rating !== 'Any rating' ? 1 : 0} 
                />

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
                        className="ml-auto text-sm text-gray-500 hover:text-black underline whitespace-nowrap px-4"
                    >
                        Clear all
                    </button>
                )}
                
                {/* Spacer for horizontal scroll */}
                <div className="w-1 shrink-0" />
            </div>

            {/* Dropdowns Container - Rendered OUTSIDE scroll container */}
            {openFilter === 'location' && (
                <div 
                    className={getDropdownClass()} 
                    style={{ 
                        top: minimized ? '50px' : '70px',
                    }}
                >
                    <CloseButton />
                    <LocationFilter
                        selectedLocations={activeFilters.locations}
                        onChange={(val) => updateFilter('locations', val)}
                        locationHierarchy={locationHierarchy}
                        routes={routes}
                    />
                </div>
            )}

            {openFilter === 'type' && (
                <div 
                    className={getDropdownClass()} 
                    style={{ 
                        top: minimized ? '50px' : '70px',
                    }}
                >
                    <CloseButton />
                    <RouteTypeFilter
                        selectedTypes={activeFilters.types}
                        onChange={(val) => updateFilter('types', val)}
                    />
                </div>
            )}

            {openFilter === 'difficulty' && (
                <div 
                    className={getDropdownClass()} 
                    style={{ 
                        top: minimized ? '50px' : '70px',
                    }}
                >
                    <CloseButton />
                    <DifficultyFilter
                        selectedDifficulties={activeFilters.difficulties}
                        onChange={(val) => updateFilter('difficulties', val)}
                    />
                </div>
            )}

            {openFilter === 'length' && (
                <div 
                    className={getDropdownClass()} 
                    style={{ 
                        top: minimized ? '50px' : '70px',
                    }}
                >
                    <CloseButton />
                    <LengthFilter
                        selectedLengths={activeFilters.lengths}
                        onChange={(val) => updateFilter('lengths', val)}
                    />
                </div>
            )}

            {openFilter === 'rating' && (
                <div 
                    className={getDropdownClass()} 
                    style={{ 
                        top: minimized ? '50px' : '70px',
                    }}
                >
                    <CloseButton />
                    <RatingFilter
                        selectedRating={activeFilters.rating}
                        onChange={(val) => updateFilter('rating', val)}
                    />
                </div>
            )}
        </div>
    )
}

const ChevronDown = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
)

InlineFilterBar.propTypes = {
    activeFilters: PropTypes.shape({
        locations: PropTypes.arrayOf(PropTypes.string),
        types: PropTypes.arrayOf(PropTypes.string),
        difficulties: PropTypes.arrayOf(PropTypes.string),
        lengths: PropTypes.arrayOf(PropTypes.string),
        rating: PropTypes.string
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    locationHierarchy: PropTypes.object,
    routes: PropTypes.array,
    minimized: PropTypes.bool
}

export default InlineFilterBar
