import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const Map = ({ routes }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markersRef = useRef([])
  const popupsRef = useRef([])
  const [mapError, setMapError] = useState(null)

  // Get Mapbox token
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

  // Check for token
  useEffect(() => {
    if (!mapboxToken) {
      setMapError('Mapbox token is missing. Please set VITE_MAPBOX_TOKEN in your .env file.')
      return
    }

    // Trim token to remove any accidental whitespace
    mapboxgl.accessToken = mapboxToken.trim()

    // Initialize map
    if (map.current) return // Initialize map only once

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // switched to standard streets style
        center: [-119.5, 37.5],
        zoom: 6,
        attributionControl: true
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Log when map loads
      map.current.on('load', () => {
        console.log('Mapbox map loaded successfully')
        // Trigger resize to ensure map renders properly
        setTimeout(() => {
          if (map.current) {
            map.current.resize()
          }
        }, 100)
      })

      // Listen for style loading errors
      map.current.on('style.load', () => {
        console.log('Map style loaded')
      })

      // Log any errors (including tile errors)
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
      })
    } catch (error) {
      console.error('Error initializing map:', error)
      setMapError(`Failed to initialize map: ${error.message}`)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapboxToken])

  // Update markers when routes change
  useEffect(() => {
    if (!map.current || !mapboxToken) return

    // Clear existing markers and popups
    markersRef.current.forEach(marker => marker.remove())
    popupsRef.current.forEach(popup => popup.remove())
    markersRef.current = []
    popupsRef.current = []

    // Add markers for each route
    routes.forEach(route => {
      if (!route.lat || !route.lng) return

      // Create marker element with color based on route type
      const markerEl = document.createElement('div')
      markerEl.className = 'custom-marker'

      // Set color based on route type
      const getMarkerColor = (type) => {
        switch (type.toLowerCase()) {
          case 'boulder':
            return '#ff6b6b' // Red
          case 'sport':
            return '#4dabf7' // Blue
          case 'trad':
            return '#51cf66' // Green
          case 'alpine':
            return '#9775fa' // Purple
          case 'tr':
            return '#ffd43b' // Yellow
          default:
            return '#868e96' // Gray
        }
      }

      const markerColor = getMarkerColor(route.type)
      markerEl.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        background: ${markerColor};
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      `

      // Create popup content
      const popupContent = document.createElement('div')
      popupContent.className = 'route-popup'
      popupContent.innerHTML = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #202020;">
            ${route.name}
          </h3>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px; color: #515151;">
                ${route.grade}
              </span>
              <span style="font-size: 14px; color: #515151;">•</span>
              <span style="font-size: 14px; color: #515151;">
                ${route.type}
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <span style="font-size: 14px; font-weight: bold; color: #202020;">
                ${route.stars.toFixed(1)}
              </span>
              <span style="color: #202020;">★</span>
            </div>
          </div>
          <button 
            class="view-details-btn" 
            data-route-id="${route.id}"
            style="
              background: #202020;
              color: white;
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
              border: none;
              cursor: pointer;
              width: 100%;
              transition: background 0.2s;
            "
            onmouseover="this.style.background='#333333'"
            onmouseout="this.style.background='#202020'"
          >
            View Details
          </button>
        </div>
      `

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setDOMContent(popupContent)

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([route.lng, route.lat])
        .setPopup(popup)
        .addTo(map.current)

      // Close other popups when this one opens
      markerEl.addEventListener('click', () => {
        popupsRef.current.forEach(p => {
          if (p !== popup) p.remove()
        })
      })

      markersRef.current.push(marker)
      popupsRef.current.push(popup)
    })

    // Add event listener for "View Details" buttons
    const handleViewDetails = (e) => {
      if (e.target.classList.contains('view-details-btn')) {
        const routeId = parseInt(e.target.dataset.routeId)
        const route = routes.find(r => r.id === routeId)
        if (route && window.onRouteDetailClick) {
          window.onRouteDetailClick(route)
        }
      }
    }

    document.addEventListener('click', handleViewDetails)

    return () => {
      document.removeEventListener('click', handleViewDetails)
    }
  }, [routes, mapboxToken])

  // Show error if token is missing
  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Map Configuration Error</h2>
          </div>
          <p className="text-gray-700 mb-4">{mapError}</p>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">To use the map feature:</p>
            <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
              <li>Create a <code className="bg-gray-200 px-1 rounded">.env</code> file in the project root</li>
              <li>Add: <code className="bg-gray-200 px-1 rounded">VITE_MAPBOX_TOKEN=your_token_here</code></li>
              <li>Get a free token at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapContainer}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    />
  )
}

Map.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      grade: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      stars: PropTypes.number.isRequired,
      lat: PropTypes.number,
      lng: PropTypes.number
    })
  ).isRequired
}

export default Map
