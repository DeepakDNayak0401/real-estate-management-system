import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getAllProperties } from '../../api/property.api.js'
import { getWishlist, addToWishlist, removeFromWishlist } from '../../api/wishlist.api.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import PropertyCard from '../../components/property/PropertyCard.jsx'
import PropertyFilter from '../../components/property/PropertyFilter.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Loader from '../../components/common/Loader.jsx'

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const toast = useToast()

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    pincode: searchParams.get('pincode') || '',
    propertyType: searchParams.get('propertyType') || '',
    bhk: searchParams.get('bhk') || '',
    furnishing: searchParams.get('furnishing') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    amenities: searchParams.get('amenities') || '',
    sort: searchParams.get('sort') || '',
    seller: searchParams.get('seller') || '',
  })

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  
  // ✅ State to hold the IDs of all wishlisted properties
  const [wishlistIds, setWishlistIds] = useState([])

  // ✅ Fetch the user's wishlist exactly ONCE when they are logged in
  useEffect(() => {
    if (isAuthenticated) {
      const fetchWishlist = async () => {
        try {
          const res = await getWishlist()
          const data = res.data.wishlist
          if (data?.property) {
            // Extract just the IDs as strings for fast lookup
            setWishlistIds(data.property.map(p => p._id.toString()))
          }
        } catch  {
          // Silently fail — wishlist check is non-critical
        }
      }
      fetchWishlist()
    } else {
      // Avoid calling setState synchronously inside the effect body to prevent
      // cascading renders. Defer the state update to the next tick.
      setTimeout(() => setWishlistIds([]), 0)
    }
  }, [isAuthenticated])

  // ✅ Handle adding/removing from wishlist
  const handleWishlistToggle = async (propertyId) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add properties to your wishlist')
      navigate('/login')
      return
    }

    try {
      if (wishlistIds.includes(propertyId.toString())) {
        await removeFromWishlist(propertyId)
        setWishlistIds(prev => prev.filter(id => id !== propertyId.toString()))
        toast.success('Removed from wishlist')
      } else {
        await addToWishlist(propertyId)
        setWishlistIds(prev => [...prev, propertyId.toString()])
        toast.success('Added to wishlist')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update wishlist'
      toast.error(message)
    }
  }

  // Fetch properties whenever filters change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const cleanFilters = {}
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            cleanFilters[key] = value
          }
        })
        const res = await getAllProperties(cleanFilters)
        setProperties(res.data.properties || [])
        setTotalCount(res.data.count || 0)
        setSearchParams(cleanFilters, { replace: true })
      } catch (error) {
        console.error('Error fetching properties:', error)
        setProperties([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [filters]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (newFilters) => setFilters(newFilters)
  
  const handleFilterReset = () => {
    setFilters({
      city: '', area: '', pincode: '', propertyType: '', bhk: '',
      furnishing: '', minPrice: '', maxPrice: '', amenities: '', sort: '', seller: '',
    })
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title mb-1">Properties</h1>
        <p className="text-gray-500">
          {loading ? 'Searching...' : `${totalCount} propert${totalCount === 1 ? 'y' : 'ies'} found`}
        </p>
      </div>
      
      <div className="flex gap-8">
        <PropertyFilter
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />
        
        <div className="flex-1 min-w-0">
          {loading ? (
            <Loader message="Loading properties..." />
          ) : properties.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
              title="No properties found"
              description="Try adjusting your filters or search criteria to find what you're looking for."
              action={
                <button onClick={handleFilterReset} className="btn-primary">
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard 
                  key={property._id} 
                  property={property} 
                  // ✅ Pass wishlist state and handler down to the card
                  isWishlisted={wishlistIds.includes(property._id.toString())}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}