import PropTypes from 'prop-types'
import SingleRouteMap from './SingleRouteMap'

const RouteDetail = ({ route, onBack, nearbyRoutes = [] }) => {
    // Helper function to get grade badge color
    const getGradeBadgeColor = (grade) => {
        const gradeStr = grade.toLowerCase()
        
        // Boulder grades
        if (gradeStr.includes('v')) {
            const vNum = parseInt(gradeStr.replace('v', ''))
            if (vNum <= 2) return { bg: '#d4f4dd', text: '#3e6e4a' }  // Beginner
            if (vNum <= 5) return { bg: '#fff4b9', text: '#6e5f3e' }  // Intermediate
            if (vNum <= 8) return { bg: '#ffd4b9', text: '#6e4a3e' }  // Advanced
            return { bg: '#ffb9b9', text: '#6e3e3e' }  // Expert
        }
        
        // Sport/Trad grades
        if (gradeStr.includes('5.')) {
            if (gradeStr.includes('5.6') || gradeStr.includes('5.7') || gradeStr.includes('5.8') || gradeStr.includes('5.9')) {
                return { bg: '#d4f4dd', text: '#3e6e4a' }  // Beginner
            }
            if (gradeStr.includes('5.10')) {
                return { bg: '#fff4b9', text: '#6e5f3e' }  // Intermediate
            }
            if (gradeStr.includes('5.11')) {
                return { bg: '#ffd4b9', text: '#6e4a3e' }  // Advanced
            }
            return { bg: '#ffb9b9', text: '#6e3e3e' }  // Expert (5.12+)
        }
        
        // Default
        return { bg: '#b9e5ff', text: '#3e5a6e' }
    }

    const badgeColor = getGradeBadgeColor(route.grade)

    // Render star rating
    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span key={i} className="text-black">★</span>
                )
            } else {
                stars.push(
                    <span key={i} className="text-gray-300">★</span>
                )
            }
        }
        return stars
    }

    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className="px-4 pt-16 pb-8 w-full lg:w-[75%] max-w-5xl">
                <div className="flex flex-col gap-4 w-full">
                    {/* Back Button */}
                    <button 
                        onClick={onBack}
                        className="border border-[#4e4e4e] text-[#4e4e4e] px-2 py-2 rounded cursor-pointer hover:bg-gray-50 transition-colors w-fit"
                    >
                        <span className="text-base">Back</span>
                    </button>

                    <div className="flex flex-col gap-10">
                        {/* Hero Image & Route Info */}
                        <div className="flex flex-col gap-4">
                            {/* Hero Image */}
                            <div className="w-full overflow-hidden rounded-lg">
                                <img 
                                    src="/images/climbing-default.jpg" 
                                    alt={route.name}
                                    className="w-full h-[200px] lg:h-[400px] rounded-lg object-cover"
                                />
                            </div>

                            {/* Route Header */}
                            <div className="flex flex-col gap-4">
                                {/* Name and Grade */}
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-[#202020] tracking-tight">
                                        {route.name}
                                    </h1>
                                    <div 
                                        className="px-2 py-1 rounded"
                                        style={{ backgroundColor: badgeColor.bg }}
                                    >
                                        <span 
                                            className="text-base font-medium tracking-tight"
                                            style={{ color: badgeColor.text }}
                                        >
                                            {route.grade}
                                        </span>
                                    </div>
                                </div>

                                {/* Type and Style */}
                                <div className="flex items-center gap-1 py-1">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#515151]">
                                        <path d="M7.66667 3.33334H7.95627C9.98776 3.33334 11.0035 3.33334 11.3891 3.6982C11.7224 4.01359 11.8701 4.4782 11.7801 4.92815C11.676 5.44869 10.8467 6.03525 9.18819 7.20836L6.47848 9.12499C4.81994 10.2981 3.99066 10.8847 3.88656 11.4052C3.79657 11.8552 3.94428 12.3198 4.27758 12.6352C4.66316 13 5.67891 13 7.7104 13H8.33333M5.33333 3.33334C5.33333 4.43791 4.4379 5.33334 3.33333 5.33334C2.22876 5.33334 1.33333 4.43791 1.33333 3.33334C1.33333 2.22877 2.22876 1.33334 3.33333 1.33334C4.4379 1.33334 5.33333 2.22877 5.33333 3.33334ZM14.6667 12.6667C14.6667 13.7712 13.7712 14.6667 12.6667 14.6667C11.5621 14.6667 10.6667 13.7712 10.6667 12.6667C10.6667 11.5621 11.5621 10.6667 12.6667 10.6667C13.7712 10.6667 14.6667 11.5621 14.6667 12.6667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-sm text-[#515151]">
                                        {route.type} - {route.style || 'Various'}
                                    </span>
                                </div>

                                {/* Pitch Count */}
                                <div className="flex items-center gap-1 py-1">
                                    <span className="text-sm text-[#515151]">
                                        {route.pitches || 1} pitch{route.pitches > 1 ? 'es' : ''}
                                    </span>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex gap-1 items-start">
                                <svg className="w-4 h-4 text-[#515151] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className="flex flex-col gap-1.5 text-sm text-[#515151]">
                                    <p>{route.region} &gt; {route.area} &gt; {route.crag}</p>
                                    <p>{route.lat}, {route.lng}</p>
                                </div>
                            </div>

                            {/* Approach Time */}
                            <div className="flex gap-1 items-start">
                                <svg className="w-4 h-4 text-[#515151] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                                </svg>
                                <span className="text-sm text-[#515151]">
                                    Approach time: {route.approachTime || '15 mins'}
                                </span>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {renderStars(route.stars)}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <span className="font-bold text-[#202020]">{route.stars.toFixed(1)}</span>
                                <span className="font-light text-[#515151]">
                                    ({route.reviewCount || 0} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Description and Protection */}
                        <div className="flex flex-col gap-7">
                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl text-[#515151]">Description</h2>
                                <p className="text-sm text-[#515151]">
                                    {route.description || 'No description available.'}
                                </p>
                            </div>

                            {/* Protection (only for Trad/Alpine) */}
                            {(route.type === 'Trad' || route.type === 'Alpine') && (
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-xl text-[#515151]">Protection</h2>
                                    <p className="text-sm text-[#515151]">
                                        {route.protection || 'Standard trad rack recommended.'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Map View */}
                        <div className="w-full h-[250px] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                            <SingleRouteMap route={route} />
                        </div>

                        {/* Nearby Routes */}
                        {nearbyRoutes.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl text-[#515151]">Nearby Routes</h2>
                                
                                {nearbyRoutes.slice(0, 2).map((nearbyRoute, index) => {
                                    const nearbyBadgeColor = getGradeBadgeColor(nearbyRoute.grade)
                                    
                                    return (
                                        <div 
                                            key={index}
                                            className="bg-[#f6f6f6] rounded-2xl p-2 flex gap-2 cursor-pointer hover:bg-gray-200 transition-colors"
                                        >
                                            {/* Thumbnail */}
                                            <img 
                                                src="/images/climbing-default.jpg" 
                                                alt={nearbyRoute.name}
                                                className="w-[139px] h-[140px] rounded-lg object-cover shrink-0"
                                            />

                                            {/* Info */}
                                            <div className="flex flex-col gap-3 flex-1 min-w-0 py-1">
                                                {/* Header */}
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="text-base font-bold text-[#202020] tracking-tight truncate">
                                                            {nearbyRoute.name}
                                                        </h3>
                                                        <div 
                                                            className="px-2 py-1 rounded shrink-0"
                                                            style={{ backgroundColor: nearbyBadgeColor.bg }}
                                                        >
                                                            <span 
                                                                className="text-base font-medium tracking-tight whitespace-nowrap"
                                                                style={{ color: nearbyBadgeColor.text }}
                                                            >
                                                                {nearbyRoute.grade}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#515151] shrink-0">
                                                            <path d="M7.66667 3.33334H7.95627C9.98776 3.33334 11.0035 3.33334 11.3891 3.6982C11.7224 4.01359 11.8701 4.4782 11.7801 4.92815C11.676 5.44869 10.8467 6.03525 9.18819 7.20836L6.47848 9.12499C4.81994 10.2981 3.99066 10.8847 3.88656 11.4052C3.79657 11.8552 3.94428 12.3198 4.27758 12.6352C4.66316 13 5.67891 13 7.7104 13H8.33333M5.33333 3.33334C5.33333 4.43791 4.4379 5.33334 3.33333 5.33334C2.22876 5.33334 1.33333 4.43791 1.33333 3.33334C1.33333 2.22877 2.22876 1.33334 3.33333 1.33334C4.4379 1.33334 5.33333 2.22877 5.33333 3.33334ZM14.6667 12.6667C14.6667 13.7712 13.7712 14.6667 12.6667 14.6667C11.5621 14.6667 10.6667 13.7712 10.6667 12.6667C10.6667 11.5621 11.5621 10.6667 12.6667 10.6667C13.7712 10.6667 14.6667 11.5621 14.6667 12.6667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                        <span className="text-sm text-[#515151]">
                                                            {nearbyRoute.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Location */}
                                                <div className="flex gap-1 items-start">
                                                    <svg className="w-4 h-4 text-[#515151] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <div className="flex flex-col gap-1 text-xs text-[#515151] min-w-0">
                                                        <p className="truncate">{nearbyRoute.area}-{nearbyRoute.crag}</p>
                                                        <p className="truncate">{nearbyRoute.lat}, {nearbyRoute.lng}</p>
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-[#202020]">
                                                        {nearbyRoute.stars.toFixed(1)}
                                                    </span>
                                                    <div className="flex gap-0.5">
                                                        {renderStars(nearbyRoute.stars)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

RouteDetail.propTypes = {
    route: PropTypes.shape({
        name: PropTypes.string.isRequired,
        grade: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        style: PropTypes.string,
        pitches: PropTypes.number,
        region: PropTypes.string.isRequired,
        area: PropTypes.string.isRequired,
        crag: PropTypes.string.isRequired,
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
        stars: PropTypes.number.isRequired,
        reviewCount: PropTypes.number,
        description: PropTypes.string,
        protection: PropTypes.string,
        approachTime: PropTypes.string
    }).isRequired,
    onBack: PropTypes.func.isRequired,
    nearbyRoutes: PropTypes.array
}

export default RouteDetail

