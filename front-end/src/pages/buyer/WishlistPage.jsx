import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWishlist, removeFromWishlist } from '../../api/wishlist.api.js'
import { useToast } from '../../hooks/useToast.js'
import PropertyCard from '../../components/property/PropertyCard.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

/**
 * Wishlist page showing all saved properties.
 * Users can remove properties or navigate to their details.
 */
export default function WishlistPage() {
  const toast = useToast()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingPropertyId, setDeletingPropertyId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true)
      try {
        const res = await getWishlist()
        const data = res.data.wishlist
        setProperties(data?.property || [])
      } catch (error) {
        // 404 means no wishlist document yet — that's fine
        if (error.response?.status !== 404) {
          toast.error('Failed to load wishlist')
        }
        setProperties([])
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Open delete confirmation
  const handleRemoveClick = (propertyId, e) => {
    e.preventDefault()
    e.stopPropagation()
    setDeletingPropertyId(propertyId)
    setDeleteDialogOpen(true)
  }

  // Confirm remove from wishlist
  const handleConfirmRemove = async () => {
    if (!deletingPropertyId) return
    setDeleteLoading(true)
    try {
      await removeFromWishlist(deletingPropertyId)
      setProperties((prev) => prev.filter((p) => p._id !== deletingPropertyId))
      toast.success('Removed from wishlist')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist'
      toast.error(message)
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setDeletingPropertyId(null)
    }
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title mb-1">My Wishlist</h1>
          <p className="text-gray-500">
            {loading ? 'Loading...' : `${properties.length} saved propert${properties.length === 1 ? 'y' : 'ies'}`}
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading your wishlist..." />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          title="Your wishlist is empty"
          description="Browse properties and click the heart icon to save them here for later."
          action={
            <Link to="/properties" className="btn-primary">
              Browse Properties
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <div key={property._id} className="relative group">
              <PropertyCard property={property} />
              {/* Remove Button — overlays the card */}
              <button
                onClick={(e) => handleRemoveClick(property._id, e)}
                className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-300 opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Remove from wishlist"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setDeletingPropertyId(null)
        }}
        onConfirm={handleConfirmRemove}
        title="Remove from Wishlist"
        message="Are you sure you want to remove this property from your wishlist?"
        confirmLabel="Remove"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}