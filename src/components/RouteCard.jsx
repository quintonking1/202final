import PropTypes from 'prop-types'

const RouteCard = ({ route }) => {
    // Determine grade difficulty level for badge styling
    const getGradeDifficulty = (grade) => {
        // For YDS grades (5.x)
        if (grade.startsWith('5.')) {
            const numericGrade = parseFloat(grade.substring(2))
            if (numericGrade < 10) return 'beginner'
            if (numericGrade < 11) return 'intermediate'
            if (numericGrade < 12) return 'advanced'
            return 'expert'
        }

        // For V-scale (boulder grades)
        if (grade.startsWith('V')) {
            const vGrade = parseInt(grade.substring(1))
            if (vGrade <= 2) return 'beginner'
            if (vGrade <= 5) return 'intermediate'
            if (vGrade <= 8) return 'advanced'
            return 'expert'
        }

        return 'intermediate'
    }

    const difficulty = getGradeDifficulty(route.grade)

    const gradeBadgeStyles = {
        beginner: 'bg-green-100 text-green-800 border-green-200',
        intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        advanced: 'bg-orange-100 text-orange-800 border-orange-200',
        expert: 'bg-red-100 text-red-800 border-red-200'
    }

    // Render star rating
    const renderStars = (stars) => {
        return '★'.repeat(Math.floor(stars)) + '☆'.repeat(5 - Math.floor(stars))
    }

    // Get route type emoji
    const getTypeEmoji = (type) => {
        const emojiMap = {
            'Boulder': '🪨',
            'Sport': '🧗',
            'Trad': '⛰️',
            'Alpine': '🏔️'
        }
        return emojiMap[type] || '🧗'
    }

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Image placeholder with grade badge */}
            <div className="relative h-[200px] bg-gradient-to-br from-amber-200 via-orange-300 to-amber-400 flex items-center justify-center">
                {/* Mountain icon silhouette */}
                <svg
                    className="w-32 h-32 text-gray-800 opacity-60"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z" />
                </svg>

                {/* Grade badge - top right */}
                <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-md font-bold text-sm border ${gradeBadgeStyles[difficulty]}`}>
                    {route.grade}
                </div>
            </div>

            {/* Card content */}
            <div className="p-4">
                {/* Route name */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {route.name}
                </h3>

                {/* Type and style */}
                <p className="text-sm text-gray-600 mb-3">
                    {getTypeEmoji(route.type)} {route.type}
                    {route.features && route.features.length > 0 && ` - ${route.features[0]}`}
                </p>

                {/* Location breadcrumb */}
                <div className="flex items-start text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{route.area} &gt; {route.crag}</span>
                </div>

                {/* Pitch count for multi-pitch routes */}
                {route.pitches > 1 && (
                    <p className="text-sm text-gray-600 mb-3">
                        {route.pitches} pitches • {route.lengthFt} ft
                    </p>
                )}

                {/* Star rating and review count */}
                <div className="flex items-center text-sm">
                    <span className="font-semibold text-gray-900 mr-1">
                        {route.stars.toFixed(1)}
                    </span>
                    <span className="text-yellow-500 mr-2">
                        {renderStars(route.stars)}
                    </span>
                    <span className="text-gray-500">
                        ({route.reviewCount} reviews)
                    </span>
                </div>
            </div>
        </div>
    )
}

RouteCard.propTypes = {
    route: PropTypes.shape({
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
    }).isRequired
}

export default RouteCard
