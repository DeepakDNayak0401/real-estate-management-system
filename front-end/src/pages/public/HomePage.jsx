import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPropertyCounts } from '../../api/property.api.js'
import { useAuth } from '../../hooks/useAuth.js'
import { formatLabel } from '../../utils/helpers.js'
import Button from '../../components/common/Button.jsx'

/**
 * Public landing page.
 * Hero section with search, property type cards with counts,
 * how-it-works section, and CTA.
 */
export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, isSeller, isSellerApproved } = useAuth()

  const [searchCity, setSearchCity] = useState('')
  const [counts, setCounts] = useState({})
  const [loadingCounts, setLoadingCounts] = useState(true)

  // Fetch property counts by type for the cards
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await getPropertyCounts()
        setCounts(res.data.counts || {})
      } catch  {
        // Silently fail — counts are non-critical
      } finally {
        setLoadingCounts(false)
      }
    }
    fetchCounts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchCity.trim()) {
      navigate(`/properties?city=${encodeURIComponent(searchCity.trim())}`)
    } else {
      navigate('/properties')
    }
  }

  // Only show the most common types on the home page
  const featuredTypes = ['apartment', 'villa', 'house', 'plot', 'commercial', 'flat']

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/bannerimage.png"
            alt="Real Estate Banner"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Find Your Perfect
            <span className="text-teal-400"> Nest</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Discover thousands of properties across India. Whether you're buying, selling, or exploring,
              we make the process simple and transparent.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by city..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
              </div>
              <Button type="submit" className="py-3.5 px-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Button>
            </form>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 mt-10">
              {[
                { label: 'Properties', value: Object.values(counts).reduce((a, b) => a + b, 0) || '1000+' },
                { label: 'Happy Buyers', value: '500+' },
                { label: 'Trusted Sellers', value: '200+' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{loadingCounts ? '—' : stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROPERTY TYPES SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Browse by Property Type</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Explore properties categorized by type to find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredTypes.map((type) => (
            <Link
              key={type}
              to={`/properties?propertyType=${type}`}
              className="card p-5 text-center group hover:border-teal-300"
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                <PropertyTypeIcon type={type} />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{formatLabel(type)}</p>
              {!loadingCounts && (
                <p className="text-xs text-gray-400">
                  {counts[type] || 0} listing{counts[type] !== 1 ? 's' : ''}
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* View All Types Link */}
        <div className="text-center mt-8">
          <Link to="/properties" className="link text-sm">
            View all property types →
          </Link>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Simple steps to find or list your dream property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Browse or List',
                description: 'Search through thousands of verified properties or list your own property as a seller.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Connect',
                description: 'Chat directly with buyers or sellers, send inquiries, and get all the details you need.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Close the Deal',
                description: 'Finalize your property purchase or sale with confidence through our trusted platform.',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-200 text-teal-600 mb-4">
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-teal-600 rounded-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center">
            {/* Text */}
            <div className="flex-1 p-8 sm:p-12 lg:p-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Ready to list your property?
              </h2>
              <p className="text-teal-100 mb-8 leading-relaxed max-w-lg">
                Join hundreds of trusted sellers on our platform. List your property in minutes
                and reach thousands of potential buyers.
              </p>
              <div className="flex flex-wrap gap-3">
                {isAuthenticated && isSeller && isSellerApproved ? (
                  <Link
                    to="/seller/add-property"
                    className="inline-flex items-center gap-2 bg-white text-teal-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    List Property
                  </Link>
                ) : isAuthenticated ? (
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-white text-teal-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Register as Seller
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 bg-white text-teal-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/properties"
                      className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-medium py-3 px-6 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Browse Properties
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Decorative */}
            <div className="hidden lg:flex items-center justify-center w-80 p-8">
              <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-32 h-32 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * Returns a simple icon for each property type.
 */
function PropertyTypeIcon({ type }) {
  const icons = {
    apartment: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    villa: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    house: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    flat: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    plot: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    commercial: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  }

  return icons[type] || icons.house
}