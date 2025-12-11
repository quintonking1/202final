import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const SingleRouteMap = ({ route }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markerRef = useRef(null)
  const [mapError, setMapError] = useState(null)

  // Get Mapbox token
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

  useEffect(() => {
    if (!mapboxToken) {
      setMapError('Mapbox token is missing')
      return
    }

    if (!route || !route.lat || !route.lng) return

    mapboxgl.accessToken = mapboxToken.trim()

    // Initialize map if not already initialized
    if (!map.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: [route.lng, route.lat],
          zoom: 12,
          attributionControl: false,
          interactive: false // Disable interaction for this mini-map
        })

        // Add route marker
        const getMarkerColor = (type) => {
          switch (type.toLowerCase()) {
            case 'boulder': return '#ff6b6b'
            case 'sport': return '#4dabf7'
            case 'trad': return '#51cf66'
            case 'alpine': return '#9775fa'
            case 'tr': return '#ffd43b'
            default: return '#868e96'
          }
        }

        const markerEl = document.createElement('div')
        markerEl.className = 'custom-marker'
        markerEl.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            background: ${getMarkerColor(route.type)};
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `

        markerRef.current = new mapboxgl.Marker(markerEl)
          .setLngLat([route.lng, route.lat])
          .addTo(map.current)

      } catch (error) {
        console.error('Error initializing map:', error)
        setMapError('Failed to load map')
      }
    } else {
      // Update center and marker if route changes
      map.current.setCenter([route.lng, route.lat])
      if (markerRef.current) markerRef.current.setLngLat([route.lng, route.lat])
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [route, mapboxToken])

  if (mapError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-sm text-gray-500">Map unavailable</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

SingleRouteMap.propTypes = {
  route: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired
}

export default SingleRouteMap
