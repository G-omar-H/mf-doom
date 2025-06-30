'use client'

import { useState, useEffect } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'
import { motion } from 'framer-motion'
import { MapPin, Users } from 'lucide-react'

// World map topology URL (simplified world map)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"

interface CountryData {
  country: string
  visits: number
  coordinates?: [number, number]
}

interface VisitorLocation {
  sessionId: string
  latitude: number
  longitude: number
  country?: string
  city?: string
  timestamp: string
}

interface WorldMapProps {
  countryData: CountryData[]
  visitorLocations?: VisitorLocation[]
  className?: string
}

// Country coordinates for major countries (lat, lng)
const countryCoordinates: { [key: string]: [number, number] } = {
  'United States': [-95.7129, 37.0902],
  'Canada': [-106.3468, 56.1304],
  'United Kingdom': [-3.4360, 55.3781],
  'Germany': [10.4515, 51.1657],
  'France': [2.2137, 46.2276],
  'Japan': [138.2529, 36.2048],
  'Australia': [133.7751, -25.2744],
  'Brazil': [-51.9253, -14.2350],
  'Mexico': [-102.5528, 23.6345],
  'Spain': [-3.7492, 40.4637],
  'Italy': [12.5674, 41.8719],
  'Netherlands': [5.2913, 52.1326],
  'Sweden': [18.6435, 60.1282],
  'Norway': [8.4689, 60.4720],
  'Denmark': [9.5018, 56.2639],
  'Finland': [25.7482, 61.9241],
  'South Korea': [127.7669, 35.9078],
  'China': [104.1954, 35.8617],
  'India': [78.9629, 20.5937],
  'Russia': [105.3188, 61.5240],
  'Poland': [19.1343, 51.9194],
  'Belgium': [4.4699, 50.5039],
  'Switzerland': [8.2275, 46.8182],
  'Austria': [14.5501, 47.5162],
  'Portugal': [-8.2245, 39.3999],
  'Argentina': [-63.6167, -38.4161],
  'Chile': [-71.5430, -35.6751],
  'Colombia': [-74.2973, 4.5709],
  'Peru': [-75.0152, -9.1900],
  'Venezuela': [-66.5897, 6.4238],
  'South Africa': [22.9375, -30.5595],
  'Egypt': [30.8025, 26.8206],
  'Turkey': [35.2433, 38.9637],
  'Greece': [21.8243, 39.0742],
  'Thailand': [100.9925, 15.8700],
  'Vietnam': [108.2772, 14.0583],
  'Malaysia': [101.9758, 4.2105],
  'Singapore': [103.8198, 1.3521],
  'Philippines': [121.7740, 12.8797],
  'Indonesia': [113.9213, -0.7893],
  'New Zealand': [174.8860, -40.9006],
  'Ireland': [-8.2439, 53.4129],
  'Czech Republic': [15.4730, 49.8175],
  'Hungary': [19.5033, 47.1625],
  'Romania': [24.9668, 45.9432],
  'Ukraine': [31.1656, 48.3794],
  'Israel': [34.8516, 32.7940],
  'UAE': [53.8478, 23.4241],
  'Saudi Arabia': [45.0792, 23.8859]
}

// Get visitor intensity color based on visit count
const getVisitorIntensity = (visits: number, maxVisits: number) => {
  const intensity = visits / maxVisits
  if (intensity > 0.8) return '#8CD4E6' // MF DOOM primary
  if (intensity > 0.6) return '#4A9BA6' // MF DOOM secondary  
  if (intensity > 0.4) return '#6BB6C6' // MF DOOM accent
  if (intensity > 0.2) return '#2A7F86' // MF DOOM dark
  return '#1A6266' // MF DOOM darker
}

// Get marker size based on visits
const getMarkerSize = (visits: number, maxVisits: number) => {
  const baseSize = 4
  const maxSize = 20
  const intensity = visits / maxVisits
  return baseSize + (intensity * (maxSize - baseSize))
}

export default function WorldMap({ countryData, visitorLocations, className = '' }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [mapData, setMapData] = useState<CountryData[]>([])

  useEffect(() => {
    // Add coordinates to country data
    const enrichedData = countryData.map(country => ({
      ...country,
      coordinates: countryCoordinates[country.country] as [number, number]
    })).filter(country => country.coordinates) // Only include countries with known coordinates

    setMapData(enrichedData)
  }, [countryData])

  const maxVisits = Math.max(...countryData.map(c => c.visits), 1)
  const totalVisits = countryData.reduce((sum, c) => sum + c.visits, 0)

  return (
    <div className={`relative ${className}`}>
      {/* Map Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Global Visitor Map</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{totalVisits.toLocaleString()} total visits</span>
          </div>
          {visitorLocations && visitorLocations.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>{visitorLocations.length} unique locations</span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Visitor Concentration:</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1A6266' }}></div>
            <span>Low</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4A9BA6' }}></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8CD4E6' }}></div>
            <span>High</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-2 lg:mt-0">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 rounded-full bg-yellow-400 border border-white"></div>
            <span>Country totals</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-400 border border-white"></div>
            <span>Individual visitors</span>
          </div>
        </div>
      </div>

      {/* World Map */}
      <div className="relative bg-gray-900/50 rounded-lg border border-gray-600/30 overflow-hidden">
        <ComposableMap
          projectionConfig={{
            rotate: [-10, 0, 0],
            scale: 120
          }}
          width={800}
          height={400}
          className="w-full h-auto"
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.NAME
                  const countryData = mapData.find(c => 
                    c.country === countryName || 
                    (countryName === 'United States of America' && c.country === 'United States')
                  )
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCountry(countryName)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        default: {
                          fill: countryData 
                            ? getVisitorIntensity(countryData.visits, maxVisits)
                            : '#2D3748',
                          stroke: '#4A5568',
                          strokeWidth: 0.5,
                          outline: 'none',
                        },
                        hover: {
                          fill: countryData 
                            ? '#FFD700' // Gold highlight for countries with data
                            : '#4A5568',
                          stroke: '#FFD700',
                          strokeWidth: 1,
                          outline: 'none',
                        },
                        pressed: {
                          fill: '#FFD700',
                          stroke: '#FFD700',
                          strokeWidth: 1,
                          outline: 'none',
                        },
                      }}
                    />
                  )
                })
              }
            </Geographies>

            {/* Visitor Markers */}
            {mapData.map((country, index) => (
              <Marker
                key={`marker-${index}`}
                coordinates={country.coordinates!}
              >
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  r={getMarkerSize(country.visits, maxVisits)}
                  fill="#FFD700"
                  fillOpacity={0.8}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredCountry(country.country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                />
                {/* Pulse effect for high-traffic countries */}
                {country.visits > maxVisits * 0.5 && (
                  <motion.circle
                    r={getMarkerSize(country.visits, maxVisits)}
                    fill="#FFD700"
                    fillOpacity={0.3}
                    animate={{
                      r: [
                        getMarkerSize(country.visits, maxVisits),
                        getMarkerSize(country.visits, maxVisits) * 1.5,
                        getMarkerSize(country.visits, maxVisits)
                      ],
                      fillOpacity: [0.3, 0.1, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Marker>
            ))}

            {/* Individual Visitor Location Markers */}
            {visitorLocations && visitorLocations.length > 0 && visitorLocations.map((visitor, index) => (
              <Marker
                key={`visitor-${visitor.sessionId}`}
                coordinates={[visitor.longitude, visitor.latitude]}
              >
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: (mapData.length * 0.1) + (index * 0.05), 
                    duration: 0.3 
                  }}
                  r={3}
                  fill="#8CD4E6"
                  fillOpacity={0.9}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    const locationName = visitor.city ? 
                      `${visitor.city}, ${visitor.country}` : 
                      visitor.country || 'Unknown Location'
                    setHoveredCountry(locationName)
                  }}
                  onMouseLeave={() => setHoveredCountry(null)}
                />
                {/* Subtle pulse for recent visitors */}
                {new Date(visitor.timestamp).getTime() > Date.now() - 60 * 60 * 1000 && (
                  <motion.circle
                    r={3}
                    fill="#8CD4E6"
                    fillOpacity={0.2}
                    animate={{
                      r: [3, 6, 3],
                      fillOpacity: [0.2, 0.05, 0.2]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Hover Tooltip */}
        {hoveredCountry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 left-4 bg-black/90 text-white p-3 rounded-lg shadow-xl border border-gray-600 z-10"
          >
            <div className="font-semibold text-sm">{hoveredCountry}</div>
            {mapData.find(c => c.country === hoveredCountry) && (
              <div className="text-xs text-gray-300 mt-1">
                {mapData.find(c => c.country === hoveredCountry)?.visits.toLocaleString()} visits
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
} 