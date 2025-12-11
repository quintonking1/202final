import { useState, useEffect } from 'react'
import routes from './data/routes.json'
import locationHierarchy from './data/locationHierarchy.json'
import SearchBar from './components/SearchBar'
import RouteList from './components/RouteList'
import FilterModal from './components/FilterModal'
import RouteDetail from './components/RouteDetail'
import MapView from './components/MapView'
import InlineFilterBar from './components/InlineFilterBar'
import { filterRoutes } from './utils/filterRoutes'
import { getUserLocation, sortByDistance } from './utils/geolocation'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [view, setView] = useState('list') // 'list' or 'map' (mobile only)
  const [isFiltersMinimized, setIsFiltersMinimized] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt') // 'prompt', 'granted', 'denied'
  const [showLocationBanner, setShowLocationBanner] = useState(true)

  // Track scroll for filter minimization
  useEffect(() => {
    let lastScrollY = window.scrollY
    let scrollUpDistance = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > lastScrollY ? 'down' : 'up'

      if (direction === 'down') {
        // Reset scroll up distance
        scrollUpDistance = 0
        // Minimize if scrolled down more than 10px from top
        if (currentScrollY > 10 && !isFiltersMinimized) {
          setIsFiltersMinimized(true)
        }
      } else {
        // Accumulate scroll up distance
        scrollUpDistance += (lastScrollY - currentScrollY)
        // Maximize if scrolled up more than 100px or at top
        if ((scrollUpDistance > 100 || currentScrollY < 10) && isFiltersMinimized) {
          setIsFiltersMinimized(false)
        }
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFiltersMinimized])

  // Don't automatically request location on mount
  // Instead, show the banner and let user click to enable
  // This is better UX and respects user privacy

  // Active filters (currently applied to the route list)
  const [activeFilters, setActiveFilters] = useState({
    locations: [],
    types: [],
    difficulties: [],
    lengths: [],
    rating: 'Any rating'
  })

  // Draft filters (being edited in the modal)
  const [draftFilters, setDraftFilters] = useState({
    locations: [],
    types: [],
    difficulties: [],
    lengths: [],
    rating: 'Any rating'
  })

  // Apply filters and search, then sort by distance if location available
  let filteredRoutes = filterRoutes(routes, activeFilters, searchQuery)

  // Sort by distance from user location if available
  if (userLocation) {
    filteredRoutes = sortByDistance(filteredRoutes, userLocation)
  }

  const handleFilterClick = () => {
    // Copy active filters to draft when opening modal
    setDraftFilters({ ...activeFilters })
    setFilterModalOpen(true)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const handleCloseModal = () => {
    // Discard draft filters
    setFilterModalOpen(false)
  }

  const handleApplyFilters = () => {
    // Apply draft filters to active filters
    setActiveFilters({ ...draftFilters })
    setFilterModalOpen(false)
  }

  const handleInlineFilterChange = (newFilters) => {
    // Apply filters immediately
    setActiveFilters(newFilters)
  }

  const handleRouteClick = (route) => {
    setSelectedRoute(route)
  }

  const handleBack = () => {
    setSelectedRoute(null)
  }

  const handleMapViewClick = () => {
    setView('map')
  }

  const handleBackToList = () => {
    setView('list')
  }

  // Set up global callback for map popups to trigger route details
  useEffect(() => {
    window.onRouteDetailClick = (route) => {
      setSelectedRoute(route)
    }
    return () => {
      delete window.onRouteDetailClick
    }
  }, [])

  // Get nearby routes (routes in the same crag or area)
  const getNearbyRoutes = (route) => {
    if (!route) return []
    return routes
      .filter(r =>
        r.id !== route.id &&
        (r.crag === route.crag || r.area === route.area)
      )
      .slice(0, 3)
  }

  // Show route detail if a route is selected
  if (selectedRoute) {
    return (
      <RouteDetail
        route={selectedRoute}
        onBack={handleBack}
        nearbyRoutes={getNearbyRoutes(selectedRoute)}
      />
    )
  }

  // Mobile: Show map view (full screen)
  if (view === 'map') {
    return (
      <div className="lg:hidden">
        <MapView
          routes={filteredRoutes}
          onBack={handleBackToList}
        />
      </div>
    )
  }

  // Main layout: Mobile (single view) or Desktop (split view)
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop: Split-screen layout */}
      <div className="hidden lg:flex lg:h-screen">
        {/* Left side: Route list */}
        <div className="w-[40%] flex flex-col border-r border-gray-200">
          {/* Header with search and filters */}
          <div className="flex-shrink-0 px-6 pt-8 pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">OnSight</h1>
            <SearchBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterClick={handleFilterClick}
              onClearSearch={handleClearSearch}
            />
          </div>

          {/* Desktop filter bar */}
          <div className="flex-shrink-0 px-6 relative z-50">
            <InlineFilterBar
              activeFilters={activeFilters}
              onFilterChange={handleInlineFilterChange}
              onMoreFiltersClick={handleFilterClick}
              locationHierarchy={locationHierarchy}
              routes={routes}
            />
          </div>

          {/* Location Banner */}
          {showLocationBanner && locationPermission !== 'granted' && (
            <div className="flex-shrink-0 mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                    Find routes near you
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Enable location access to see climbing routes sorted by distance from your current location.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const location = await getUserLocation()
                          setUserLocation(location)
                          setLocationPermission('granted')
                          setShowLocationBanner(false)
                        } catch (error) {
                          console.log('Location access denied:', error.message)
                          setLocationPermission('denied')
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Enable Location
                    </button>
                    <button
                      onClick={() => setShowLocationBanner(false)}
                      className="px-3 py-1.5 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowLocationBanner(false)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Route list (scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <p className="text-sm text-gray-600 mb-4">
              {filteredRoutes.length} {filteredRoutes.length === 1 ? 'route' : 'routes'} found
              {userLocation && ' • Sorted by distance'}
            </p>
            <RouteList routes={filteredRoutes} onRouteClick={handleRouteClick} />
          </div>
        </div>

        {/* Right side: Map (fixed) */}
        <div className="w-[60%] relative">
          <MapView
            routes={filteredRoutes}
            onBack={null} // No back button on desktop
          />
        </div>
      </div>

      {/* Mobile: Single view layout */}
      <div className="lg:hidden">
        <div className="px-4 pt-12 pb-8">
          <div className="flex flex-col gap-4">
            {/* Sticky Header: Search and Filters */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm -mx-4 px-4 py-2 border-b border-gray-100 shadow-sm">
              <div className="mb-2">
                <SearchBar
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  onFilterClick={handleFilterClick}
                  onClearSearch={handleClearSearch}
                />
              </div>

              <InlineFilterBar
                activeFilters={activeFilters}
                onFilterChange={handleInlineFilterChange}
                locationHierarchy={locationHierarchy}
                routes={routes}
                minimized={isFiltersMinimized}
              />
            </div>

            {/* Location Banner - Mobile */}
            {showLocationBanner && locationPermission !== 'granted' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                      Find routes near you
                    </h3>
                    <p className="text-xs text-blue-800 mb-2">
                      Enable location to see routes sorted by distance.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const location = await getUserLocation()
                            setUserLocation(location)
                            setLocationPermission('granted')
                            setShowLocationBanner(false)
                          } catch (error) {
                            console.log('Location access denied:', error.message)
                            setLocationPermission('denied')
                          }
                        }}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md"
                      >
                        Enable
                      </button>
                      <button
                        onClick={() => setShowLocationBanner(false)}
                        className="px-3 py-1.5 bg-white text-blue-600 text-xs font-medium rounded-md border border-blue-300"
                      >
                        Later
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLocationBanner(false)}
                    className="text-blue-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Result Count */}
            <p className="text-sm text-gray-600 mt-2">
              {filteredRoutes.length} {filteredRoutes.length === 1 ? 'route' : 'routes'} found
              {userLocation && ' • Sorted by distance'}
            </p>

            {/* Route List */}
            <RouteList routes={filteredRoutes} onRouteClick={handleRouteClick} />
          </div>
        </div>

        {/* Map View button - floating at bottom (mobile only) */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleMapViewClick}
            className="bg-[#202020] text-white px-10 py-5 rounded-[41px] flex items-center gap-2 shadow-lg cursor-pointer hover:bg-[#333333] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-sm font-medium">Map View</span>
          </button>
        </div>
      </div>

      {/* Filter Modal (both mobile and desktop) */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={handleCloseModal}
        onApply={handleApplyFilters}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        locationHierarchy={locationHierarchy}
        routes={routes}
        searchQuery={searchQuery}
      />
    </div>
  )
}

export default App
