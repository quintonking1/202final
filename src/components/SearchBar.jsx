import PropTypes from 'prop-types'

const SearchBar = ({ searchValue, onSearchChange, onFilterClick, onClearSearch }) => {
    return (
        <div className="bg-[#f3f3f3] flex items-center justify-between px-2 py-1.5 rounded-full h-[61px]">
            <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search"
                className="bg-transparent text-[#5e5e5e] text-base outline-none flex-1 px-2 placeholder:text-[#5e5e5e]"
            />
            <div className="flex items-center gap-2">
                {/* Clear button - only visible when there's text */}
                {searchValue && (
                    <button
                        onClick={onClearSearch}
                        className="text-[#5e5e5e] p-1 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity"
                        aria-label="Clear search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}
                {/* Filter button */}
                <button
                    onClick={onFilterClick}
                    className="bg-[#d2d2d2] rounded-[21px] p-2.5 w-[42px] h-[42px] flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-[#c0c0c0] transition-colors"
                    aria-label="Filter routes"
                >
                    <svg className="w-6 h-6 text-[#5e5e5e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="4" y1="8" x2="20" y2="8" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="4" y1="16" x2="20" y2="16" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

SearchBar.propTypes = {
    searchValue: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onFilterClick: PropTypes.func.isRequired,
    onClearSearch: PropTypes.func.isRequired
}

export default SearchBar

