/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in miles
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959 // Radius of Earth in miles
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return distance
}

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
    return degrees * (Math.PI / 180)
}

/**
 * Sort routes by distance from user location
 * @param {Array} routes - Array of route objects
 * @param {Object} userLocation - User's location {lat, lng}
 * @returns {Array} Sorted routes with distance property added
 */
export function sortByDistance(routes, userLocation) {
    if (!userLocation || !userLocation.lat || !userLocation.lng) {
        return routes
    }

    return routes
        .map(route => ({
            ...route,
            distance: calculateDistance(
                userLocation.lat,
                userLocation.lng,
                route.lat,
                route.lng
            )
        }))
        .sort((a, b) => a.distance - b.distance)
}

/**
 * Get user's current location using browser geolocation API
 * @returns {Promise<{lat: number, lng: number}>}
 */
export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            (error) => {
                reject(error)
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000 // Cache for 5 minutes
            }
        )
    })
}

/**
 * Format distance for display
 * @param {number} distance - Distance in miles
 * @returns {string} Formatted distance string
 */
export function formatDistance(distance) {
    if (distance < 1) {
        return `${(distance * 5280).toFixed(0)} ft`
    } else if (distance < 10) {
        return `${distance.toFixed(1)} mi`
    } else {
        return `${Math.round(distance)} mi`
    }
}
