import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllProperties, deleteProperty as adminDeleteProperty } from '../../api/admin.api.js'
import { useToast } from '../../hooks/useToast.js'
import { formatPrice, formatLabel, formatDate, getInitials } from '../../utils/helpers.js'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

/**
 * Admin page for viewing and deleting any property on the platform.
 */
export default function AdminPropertiesPage() {
  const toast = useToast()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProperty, setDeletingProperty] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const res = await getAllProperties()
        setProperties(res.data.properties || [])
      } catch  {
        toast.error('Failed to load properties')
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Delete handler
  const handleDeleteClick = (property) => {
    setDeletingProperty(property)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingProperty) return
    setDeleteLoading(true)
    try {
      await adminDeleteProperty(deletingProperty._id)
      setProperties((prev) => prev.filter((p) => p._id !== deletingProperty._id))
      toast.success('Property deleted successfully')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete property'
      toast.error(message)
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setDeletingProperty(null)
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title mb-1">Manage Properties</h1>
        <p className="text-gray-500">
          {loading ? 'Loading...' : `${properties.length} total properties`}
        </p>
      </div>

      {/* Content */}
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
          description="No properties have been listed on the platform yet."
        />
      ) : (
        <div className="space-y-3">
          {properties.map((property) => {
            const seller = property.seller || {}

            return (
              <div key={property._id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="sm:w-40 flex-shrink-0">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-32 sm:h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 sm:h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Link
                            to={`/property/${property._id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-teal-600 transition-colors truncate"
                          >
                            {property.title}
                          </Link>
                          <Badge variant={property.status === 'sale' ? 'green' : 'red'}>
                            {formatLabel(property.status)}
                          </Badge>
                          <Badge variant="blue">{formatLabel(property.propertyType)}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {[property.city, property.area].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-teal-700 flex-shrink-0">
                        {formatPrice(property.price)}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      {property.bhk && <span>{property.bhk} BHK</span>}
                      {property.areaSize && <span>{property.areaSize} sq ft</span>}
                      {property.furnishing && <span>{formatLabel(property.furnishing)}</span>}
                      <span>{property.views} views</span>
                      <span>Listed {formatDate(property.createdAt)}</span>
                    </div>

                    {/* Seller + Actions */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        {seller.profilePic ? (
                          <img src={seller.profilePic} alt={seller.name} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-500">
                            {getInitials(seller.name)}
                          </div>
                        )}
                        <span className="text-xs text-gray-500">
                          by <span className="font-medium text-gray-700">{seller.name || 'Unknown'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/property/${property._id}`}
                          className="btn-secondary text-xs py-1 px-3"
                        >
                          View
                        </Link>
                        <Button
                          variant="danger"
                          className="text-xs py-1 px-3"
                          onClick={() => handleDeleteClick(property)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setDeletingProperty(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Property"
        message={
          deletingProperty
            ? `Are you sure you want to delete "${deletingProperty.title}"? This action cannot be undone.`
            : 'Are you sure you want to delete this property?'
        }
        confirmLabel="Delete Property"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
