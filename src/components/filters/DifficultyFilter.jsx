import PropTypes from 'prop-types'

const DifficultyFilter = ({ selectedDifficulties, onChange }) => {
    const difficulties = [
        { 
            level: 'Beginner', 
            description: '5.6-5.9 for Sport/Trad | V0-V2 for Boulder' 
        },
        { 
            level: 'Intermediate', 
            description: '5.10a-5.10d for Sport/Trad | V3-V5 for Boulder' 
        },
        { 
            level: 'Advanced', 
            description: '5.11a-5.11d for Sport/ Trad | V6-V8 for Boulder' 
        },
        { 
            level: 'Expert', 
            description: '5.12+ Sport/ Trad | V9+ for Boulder' 
        }
    ]

    const handleToggle = (level) => {
        const newDifficulties = selectedDifficulties.includes(level)
            ? selectedDifficulties.filter(d => d !== level)
            : [...selectedDifficulties, level]
        onChange(newDifficulties)
    }

    return (
        <div className="flex flex-col gap-5 w-full">
            <h3 className="text-base font-black text-black">Difficulty</h3>
            <div className="flex flex-col gap-5">
                {difficulties.map(({ level, description }) => (
                    <div key={level} className="flex flex-col gap-2">
                        <button 
                            type="button"
                            className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleToggle(level)}
                        >
                            <div className={`w-6 h-6 rounded-[2px] border border-[#939393] flex items-center justify-center ${selectedDifficulties.includes(level) ? 'bg-[#202020]' : ''}`}>
                                {selectedDifficulties.includes(level) && (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-base text-black whitespace-nowrap">{level}</span>
                        </button>
                        <p className="text-base text-[#5e5e5e] font-light">{description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

DifficultyFilter.propTypes = {
    selectedDifficulties: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired
}

export default DifficultyFilter

