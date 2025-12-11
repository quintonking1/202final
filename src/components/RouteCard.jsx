import PropTypes from 'prop-types'
import { formatDistance } from '../utils/geolocation'

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
        beginner: 'bg-[#c8f4d4] text-[#3e6e4e]',
        intermediate: 'bg-[#fff4c8] text-[#8e7e3e]',
        advanced: 'bg-[#ffd4b9] text-[#8e5e3e]',
        expert: 'bg-[#ffb9b9] text-[#6e3e3e]'
    }

    // Render star rating
    const renderStars = (stars) => {
        const fullStars = Math.floor(stars)
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < fullStars ? "text-[#202020]" : "text-gray-300"}>
                        ★
                    </span>
                ))}
            </div>
        )
    }

    // Get route type icon
    const getTypeIcon = () => {
        return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0">
                <path d="M7.66667 3.33334H7.95627C9.98776 3.33334 11.0035 3.33334 11.3891 3.6982C11.7224 4.01359 11.8701 4.4782 11.7801 4.92815C11.676 5.44869 10.8467 6.03525 9.18819 7.20836L6.47848 9.12499C4.81994 10.2981 3.99066 10.8847 3.88656 11.4052C3.79657 11.8552 3.94428 12.3198 4.27758 12.6352C4.66316 13 5.67891 13 7.7104 13H8.33333M5.33333 3.33334C5.33333 4.43791 4.4379 5.33334 3.33333 5.33334C2.22876 5.33334 1.33333 4.43791 1.33333 3.33334C1.33333 2.22877 2.22876 1.33334 3.33333 1.33334C4.4379 1.33334 5.33333 2.22877 5.33333 3.33334ZM14.6667 12.6667C14.6667 13.7712 13.7712 14.6667 12.6667 14.6667C11.5621 14.6667 10.6667 13.7712 10.6667 12.6667C10.6667 11.5621 11.5621 10.6667 12.6667 10.6667C13.7712 10.6667 14.6667 11.5621 14.6667 12.6667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }

    return (
        <div className="bg-[#f6f6f6] rounded-[16px] p-2 flex flex-col gap-2 hover:shadow-lg transition-shadow duration-300">
            {/* Image */}
            <div className="relative h-[140px] rounded-lg overflow-hidden">
                <img
                    src="/images/climbing-default.jpg"
                    alt={route.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Card content */}
            <div className="flex flex-col gap-4">
                {/* Title and grade section */}
                <div className="flex flex-col gap-0">
                    {/* Title and badge row */}
                    <div className="flex items-center justify-between gap-2 w-full">
                        <h3 className="text-base font-bold text-[#202020] tracking-tight leading-normal">
                            {route.name}
                        </h3>
                        <div className={`px-2 py-1 rounded flex items-center justify-center shrink-0 ${gradeBadgeStyles[difficulty]}`}>
                            <span className="text-base font-medium tracking-tight whitespace-nowrap">
                                {route.grade}
                            </span>
                        </div>
                    </div>

                    {/* Type and style */}
                    <div className="flex items-center gap-1 py-1">
                        {getTypeIcon()}
                        <p className="text-sm text-[#515151]">
                            {route.type}{route.features && route.features.length > 0 ? ` - ${route.features[0]}` : ''}
                        </p>
                    </div>
                </div>

                {/* Location section */}
                <div className="flex gap-1 items-start">
                    <svg className="w-4 h-4 flex-shrink-0 text-[#515151] mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex flex-col gap-1 text-sm text-[#515151]">
                        <div className="flex items-center gap-2">
                            <p>{route.area} - {route.crag}</p>
                            {route.distance !== undefined && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {formatDistance(route.distance)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Star rating section */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#202020]">
                        {route.stars.toFixed(1)}
                    </span>
                    {renderStars(route.stars)}
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
        features: PropTypes.arrayOf(PropTypes.string),
        lat: PropTypes.number,
        lng: PropTypes.number
    }).isRequired
}

export default RouteCard
