import { useEffect } from 'react'
import routes from './data/routes.json'
import locationHierarchy from './data/locationHierarchy.json'
import RouteCard from './components/RouteCard'

function App() {
  const regionCount = Object.keys(locationHierarchy.regions).length

  useEffect(() => {
    console.log('Routes data:', routes)
    console.log('Location hierarchy:', locationHierarchy)
    console.log(`Total routes: ${routes.length}`)
    console.log(`Total regions: ${regionCount}`)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">OnSight</h1>

        <p className="text-lg text-gray-700 mb-8">
          Loaded {routes.length} routes across {regionCount} regions
        </p>

        {/* Route cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.slice(0, 12).map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
