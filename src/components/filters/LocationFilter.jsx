import { useState } from 'react'
import PropTypes from 'prop-types'

const LocationFilter = ({ selectedLocations, onChange, locationHierarchy, routes }) => {
    const [expandedRegions, setExpandedRegions] = useState([])
    const [expandedAreas, setExpandedAreas] = useState([])

    const toggleRegion = (region) => {
        setExpandedRegions(prev => 
            prev.includes(region) 
                ? prev.filter(r => r !== region)
                : [...prev, region]
        )
    }

    const toggleArea = (region, area) => {
        const key = `${region}-${area}`
        setExpandedAreas(prev => 
            prev.includes(key) 
                ? prev.filter(a => a !== key)
                : [...prev, key]
        )
    }

    const handleLocationToggle = (location) => {
        const newLocations = selectedLocations.includes(location)
            ? selectedLocations.filter(l => l !== location)
            : [...selectedLocations, location]
        onChange(newLocations)
    }

    const getRegionRouteCount = (region) => {
        if (!routes) return 0
        return routes.filter(route => route.region === region).length
    }

    const getAreaRouteCount = (region, area) => {
        if (!routes) return 0
        return routes.filter(route => 
            route.region === region && route.area === area
        ).length
    }

    const getCragRouteCount = (region, area, crag) => {
        if (!routes) return 0
        return routes.filter(route => 
            route.region === region && 
            route.area === area && 
            route.crag === crag
        ).length
    }

    return (
        <div className="flex flex-col gap-5 w-full">
            <h3 className="text-base font-black text-black">Location</h3>
            <div className="flex flex-col gap-6">
                {Object.entries(locationHierarchy.regions).map(([region, regionData]) => (
                    <div key={region} className="flex flex-col gap-3.5">
                        {/* Region level */}
                        <button
                            type="button"
                            className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => toggleRegion(region)}
                        >
                            <span className="text-base text-black">{region}</span>
                            <span className="text-base text-[#5e5e5e]">{getRegionRouteCount(region)} routes</span>
                            <svg 
                                className={`w-6 h-6 text-[#5e5e5e] transition-transform ${expandedRegions.includes(region) ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                viewBox="0 0 24 24"
                            >
                                <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Areas under this region */}
                        {expandedRegions.includes(region) && (
                            <div className="flex flex-col gap-3.5 pl-4">
                                {Object.entries(regionData.areas).map(([area, areaData]) => (
                                    <div key={`${region}-${area}`} className="flex flex-col gap-3.5">
                                        {/* Area level */}
                                        <button
                                            type="button"
                                            className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => toggleArea(region, area)}
                                        >
                                            <span className="text-base text-[#5e5e5e]">{area}</span>
                                            <span className="text-base text-[#5e5e5e]">{getAreaRouteCount(region, area)} routes</span>
                                            <svg 
                                                className={`w-6 h-6 text-[#5e5e5e] transition-transform ${expandedAreas.includes(`${region}-${area}`) ? 'rotate-180' : ''}`}
                                                fill="none" 
                                                stroke="currentColor" 
                                                strokeWidth="2" 
                                                viewBox="0 0 24 24"
                                            >
                                                <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        {/* Crags under this area */}
                                        {expandedAreas.includes(`${region}-${area}`) && (
                                            <div className="flex flex-col gap-3.5 pl-4">
                                                {/* "All routes" option */}
                                                <button
                                                    type="button"
                                                    className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => handleLocationToggle(`${region}|${area}|all`)}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded-[2px] border border-[#939393] flex items-center justify-center ${selectedLocations.includes(`${region}|${area}|all`) ? 'bg-[#202020]' : ''}`}>
                                                        {selectedLocations.includes(`${region}|${area}|all`) && (
                                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-base text-[#5e5e5e]">All routes</span>
                                                </button>

                                                {/* Individual crags */}
                                                {areaData.crags.map((crag) => (
                                                    <button
                                                        key={`${region}-${area}-${crag}`}
                                                        type="button"
                                                        className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity"
                                                        onClick={() => handleLocationToggle(`${region}|${area}|${crag}`)}
                                                    >
                                                        <div className={`w-3.5 h-3.5 rounded-[2px] border border-[#939393] flex items-center justify-center ${selectedLocations.includes(`${region}|${area}|${crag}`) ? 'bg-[#202020]' : ''}`}>
                                                            {selectedLocations.includes(`${region}|${area}|${crag}`) && (
                                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span className="text-base text-[#5e5e5e]">{crag}</span>
                                                        <span className="text-base text-[#5e5e5e]">{getCragRouteCount(region, area, crag)} routes</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

LocationFilter.propTypes = {
    selectedLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    locationHierarchy: PropTypes.shape({
        regions: PropTypes.object.isRequired
    }).isRequired,
    routes: PropTypes.array
}

export default LocationFilter

