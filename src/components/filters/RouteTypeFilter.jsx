import PropTypes from 'prop-types'

const RouteTypeFilter = ({ selectedTypes, onChange }) => {
    const types = ['Boulder', 'Sport', 'Alpine', 'Trad']

    const handleToggle = (type) => {
        const newTypes = selectedTypes.includes(type)
            ? selectedTypes.filter(t => t !== type)
            : [...selectedTypes, type]
        onChange(newTypes)
    }

    return (
        <div className="flex flex-col gap-5 w-full">
            <h3 className="text-base font-black text-black">Route Type</h3>
            <div className="flex flex-wrap gap-[15px]">
                {types.map((type) => (
                    <button
                        key={type}
                        type="button"
                        className="border border-[#5e5e5e] rounded p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleToggle(type)}
                    >
                        <div className={`w-3.5 h-3.5 rounded-[2px] border border-[#939393] flex items-center justify-center ${selectedTypes.includes(type) ? 'bg-[#202020]' : ''}`}>
                            {selectedTypes.includes(type) && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <span className="text-base text-black whitespace-nowrap">{type}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

RouteTypeFilter.propTypes = {
    selectedTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
}

export default RouteTypeFilter

