import PropTypes from 'prop-types'

const LengthFilter = ({ selectedLengths, onChange }) => {
    const lengths = ['1 pitch', '2-3 pitches', '4-6 pitches', '6+ pitches']

    const handleToggle = (length) => {
        const newLengths = selectedLengths.includes(length)
            ? selectedLengths.filter(l => l !== length)
            : [...selectedLengths, length]
        onChange(newLengths)
    }

    return (
        <div className="flex flex-col gap-5 w-full">
            <h3 className="text-base font-black text-black">Length</h3>
            <div className="flex flex-wrap gap-[15px]">
                {lengths.map((length) => (
                    <button
                        key={length}
                        type="button"
                        className="border border-[#5e5e5e] rounded p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleToggle(length)}
                    >
                        <div className={`w-3.5 h-3.5 rounded-[2px] border border-[#939393] flex items-center justify-center ${selectedLengths.includes(length) ? 'bg-[#202020]' : ''}`}>
                            {selectedLengths.includes(length) && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <span className="text-base text-black whitespace-nowrap">{length}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

LengthFilter.propTypes = {
    selectedLengths: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
}

export default LengthFilter

