import PropTypes from 'prop-types'

const FilterChips = ({ activeFilters, onRemoveFilter, onClearAll }) => {
    // Build array of active filter chips
    const chips = []

    // Location chips
    if (activeFilters.locations && activeFilters.locations.length > 0) {
        activeFilters.locations.forEach(location => {
            chips.push({ type: 'locations', value: location, label: location })
        })
    }

    // Type chips
    if (activeFilters.types && activeFilters.types.length > 0) {
        activeFilters.types.forEach(type => {
            chips.push({ type: 'types', value: type, label: type })
        })
    }

    // Difficulty chips
    if (activeFilters.difficulties && activeFilters.difficulties.length > 0) {
        activeFilters.difficulties.forEach(difficulty => {
            const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
            chips.push({ type: 'difficulties', value: difficulty, label })
        })
    }

    // Length chips
    if (activeFilters.lengths && activeFilters.lengths.length > 0) {
        activeFilters.lengths.forEach(length => {
            const labels = {
                short: 'Short (<100ft)',
                medium: 'Medium (100-300ft)',
                long: 'Long (300ft+)'
            }
            chips.push({ type: 'lengths', value: length, label: labels[length] })
        })
    }

    // Rating chip
    if (activeFilters.rating && activeFilters.rating !== 'Any rating') {
        chips.push({ type: 'rating', value: activeFilters.rating, label: `${activeFilters.rating} stars` })
    }

    // Don't render if no active filters
    if (chips.length === 0) return null

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <div className="flex gap-2 items-center">
                {chips.map((chip, index) => (
                    <div
                        key={`${chip.type}-${chip.value}-${index}`}
                        className="flex items-center gap-1.5 bg-[#202020] text-white px-3 py-1.5 rounded-full text-sm whitespace-nowrap"
                    >
                        <span>{chip.label}</span>
                        <button
                            onClick={() => onRemoveFilter(chip.type, chip.value)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            aria-label={`Remove ${chip.label} filter`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {chips.length > 0 && (
                <button
                    onClick={onClearAll}
                    className="text-sm text-[#515151] hover:text-[#202020] underline whitespace-nowrap ml-2"
                >
                    Clear all
                </button>
            )}
        </div>
    )
}

FilterChips.propTypes = {
    activeFilters: PropTypes.shape({
        locations: PropTypes.arrayOf(PropTypes.string),
        types: PropTypes.arrayOf(PropTypes.string),
        difficulties: PropTypes.arrayOf(PropTypes.string),
        lengths: PropTypes.arrayOf(PropTypes.string),
        rating: PropTypes.string
    }).isRequired,
    onRemoveFilter: PropTypes.func.isRequired,
    onClearAll: PropTypes.func.isRequired
}

export default FilterChips
