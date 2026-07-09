import { Link } from 'react-router-dom'
import { formatPrice, formatLabel } from '../../utils/helpers.js'
import Badge from '../common/Badge.jsx'

/**
 * Property card for listing grids.
 * Shows image, price, title, location, type, BHK, and seller.
 * Now includes a quick-add wishlist heart button on hover.
 */
export default function PropertyCard({ property, isWishlisted = false, onWishlistToggle }) {
  if (!property) return null
  const mainImage = property.images?.[0]
  const location = [property.city, property.area].filter(Boolean).join(', ')

  // Prevent the card's <Link> from triggering when clicking the heart
  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onWishlistToggle) {
      onWishlistToggle(property._id)
    }
  }

  return (
    <Link to={`/property/${property._id}`} className="card group block">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.status === 'sold' && <Badge variant="red">Sold</Badge>}
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="blue">{formatLabel(property.propertyType)}</Badge>
        </div>

        {/* ✅ NEW: Wishlist Heart Button (appears on hover) */}
        {onWishlistToggle && (
          <button
            onClick={handleWishlistClick}
            className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className="text-lg font-bold text-teal-700 mb-1">
          {formatPrice(property.price)}
        </p>
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1">
          {property.title}
        </h3>
        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{location || 'Location not specified'}</span>
        </div>
        {/* Details Row */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          {property.bhk && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {property.bhk} BHK
            </span>
          )}
          {property.areaSize && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.areaSize} sq ft
            </span>
          )}
          {property.furnishing && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {formatLabel(property.furnishing)}
            </span>
          )}
        </div>
        {/* Seller */}
        {property.seller && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            {property.seller.profilePic ? (
              <img
                src={property.seller.profilePic}
                alt={property.seller.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                {property.seller.name?.charAt(0)}
              </div>
            )}
            <span className="text-xs text-gray-500">{property.seller.name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}