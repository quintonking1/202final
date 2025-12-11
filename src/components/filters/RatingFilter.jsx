import PropTypes from 'prop-types'

const RatingFilter = ({ selectedRating, onChange }) => {
    const ratings = ['Any rating', '2+ stars', '3+ stars', '4+ stars']

    return (
        <div className="flex flex-col gap-5 w-full">
            <h3 className="text-base font-black text-black">Minimum Ratings</h3>
            <div className="flex flex-wrap gap-[15px]">
                {ratings.map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        className="border border-[#5e5e5e] rounded p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => onChange(rating)}
                    >
                        <div className={`w-3.5 h-3.5 rounded-[2px] border border-[#939393] flex items-center justify-center ${selectedRating === rating ? 'bg-[#202020]' : ''}`}>
                            {selectedRating === rating && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                        </div>
                        <span className="text-base text-black whitespace-nowrap">{rating}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

RatingFilter.propTypes = {
    selectedRating: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

export default RatingFilter

