

export function mapDifficultyToGrades(level, type) {
    // Make everything lowercase so it works no matter how it's typed
    const difficultyLevel = level.toLowerCase()

    // Sport/Trad/Alpine use the YDS system (5.6, 5.7, 5.10a, etc.)
    // Boulder uses V-scale (V0, V1, V2, etc.)
    const gradeMap = {
        Sport: {
            beginner: ['5.6', '5.7', '5.8', '5.9'],
            intermediate: ['5.10a', '5.10b', '5.10c', '5.10d'],
            advanced: ['5.11a', '5.11b', '5.11c', '5.11d'],
            expert: ['5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d']
        },
        Trad: {
            beginner: ['5.6', '5.7', '5.8', '5.9'],
            intermediate: ['5.10a', '5.10b', '5.10c', '5.10d'],
            advanced: ['5.11a', '5.11b', '5.11c', '5.11d'],
            expert: ['5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d']
        },
        Alpine: {
            beginner: ['5.6', '5.7', '5.8', '5.9'],
            intermediate: ['5.10a', '5.10b', '5.10c', '5.10d'],
            advanced: ['5.11a', '5.11b', '5.11c', '5.11d'],
            expert: ['5.12a', '5.12b', '5.12c', '5.12d', '5.13a', '5.13b', '5.13c', '5.13d', '5.14a', '5.14b', '5.14c', '5.14d']
        },
        Boulder: {
            beginner: ['V0', 'V1', 'V2'],
            intermediate: ['V3', 'V4', 'V5'],
            advanced: ['V6', 'V7', 'V8'],
            expert: ['V9', 'V10', 'V11', 'V12']
        }
    }

    // Look up the grades for this type and difficulty level
    // If we can't find it, just return an empty array
    if (gradeMap[type] && gradeMap[type][difficultyLevel]) {
        return gradeMap[type][difficultyLevel]
    } else {
        return []
    }
}

// takes all routes and filters, returns only matching routes
export function filterRoutes(routes, filters, searchQuery = '') {
    let filteredRoutes = routes


    // If the user typed something in the search box, filter by that first
    if (searchQuery && searchQuery.trim() !== '') {
        const searchLower = searchQuery.toLowerCase()

        filteredRoutes = filteredRoutes.filter(route => {
            // Check if search matches name, area, crag, region, or type
            const nameMatch = route.name.toLowerCase().includes(searchLower)
            const areaMatch = route.area.toLowerCase().includes(searchLower)
            const cragMatch = route.crag.toLowerCase().includes(searchLower)
            const regionMatch = route.region.toLowerCase().includes(searchLower)
            const typeMatch = route.type.toLowerCase().includes(searchLower)

            // Return true if ANY of these match
            return nameMatch || areaMatch || cragMatch || regionMatch || typeMatch
        })
    }


    // Check if user selected any locations
    if (filters.locations && filters.locations.length > 0) {
        filteredRoutes = filteredRoutes.filter(route => {
            // Check if this route matches ANY of the selected locations
            let matchesAnyLocation = false

            for (let i = 0; i < filters.locations.length; i++) {
                const location = filters.locations[i]

                // Location format is "region|area|crag" or "region|area|all"
                const parts = location.split('|')
                const selectedRegion = parts[0]
                const selectedArea = parts[1]
                const selectedCrag = parts[2]

                // Check if route matches this location
                if (selectedCrag === 'all') {
                    // User selected whole area match region and area
                    if (route.region === selectedRegion && route.area === selectedArea) {
                        matchesAnyLocation = true
                        break
                    }
                } else {
                    // User selected specific crag, must match all three
                    if (route.region === selectedRegion &&
                        route.area === selectedArea &&
                        route.crag === selectedCrag) {
                        matchesAnyLocation = true
                        break
                    }
                }
            }

            return matchesAnyLocation
        })
    }


    // Check if user selected any route types
    if (filters.types && filters.types.length > 0) {
        filteredRoutes = filteredRoutes.filter(route => {
            // Check if this route's type is in the selected types
            return filters.types.includes(route.type)
        })
    }


    // Check if user selected any difficulty
    if (filters.difficulties && filters.difficulties.length > 0) {
        filteredRoutes = filteredRoutes.filter(route => {
            //  to check if this route matches ANY of the selected difficulties
            let matchesAnyDifficulty = false

            for (let i = 0; i < filters.difficulties.length; i++) {
                const selectedDifficulty = filters.difficulties[i]


                const allowedGrades = mapDifficultyToGrades(selectedDifficulty, route.type)


                if (allowedGrades.includes(route.grade)) {
                    matchesAnyDifficulty = true
                    break
                }
            }

            return matchesAnyDifficulty
        })
    }

    // Check if user selected length ranges
    if (filters.lengths && filters.lengths.length > 0) {
        filteredRoutes = filteredRoutes.filter(route => {
            // Check if route matches selected length ranges
            let matchesAnyLength = false

            for (let i = 0; i < filters.lengths.length; i++) {
                const lengthRange = filters.lengths[i]

                if (lengthRange === 'short' && route.lengthFt < 100) {
                    matchesAnyLength = true
                    break
                }
                if (lengthRange === 'medium' && route.lengthFt >= 100 && route.lengthFt < 300) {
                    matchesAnyLength = true
                    break
                }
                if (lengthRange === 'long' && route.lengthFt >= 300) {
                    matchesAnyLength = true
                    break
                }
            }

            return matchesAnyLength
        })
    }


    // Check if selected a minimum star rating
    if (filters.rating && filters.rating !== 'Any rating') {
        // Get the number from the rating string (e.g., '3+' becomes 3)
        const minStars = parseInt(filters.rating.replace('+', ''))

        filteredRoutes = filteredRoutes.filter(route => {
            // Route must have at least this many stars
            return route.stars >= minStars
        })
    }

    // Return all the routes that passed all the filters
    return filteredRoutes
}