import PropTypes from 'prop-types'
import Map from './Map'

const MapView = ({ routes, onBack, onMenuClick }) => {
  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#202020] hover:text-[#515151] transition-colors lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to List</span>
          </button>
        )}

        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 text-[#202020] hover:text-[#515151] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Map fills remaining space */}
      <div className="flex-1 relative" style={{ minHeight: '500px' }}>
        <Map routes={routes} />
      </div>
    </div>
  )
}

MapView.propTypes = {
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
  ).isRequired,
  onBack: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func
}

export default MapView
