import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyProperties, deleteProperty, updatePropertyStatus } from '../../api/property.api.js'
import { useToast } from '../../hooks/useToast.js'
import { formatPrice, formatLabel, formatDate } from '../../utils/helpers.js'
import Badge from '../../components/common/Badge.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

/**
 * Page showing all properties listed by the current seller.
 * Supports status change, edit, and delete with confirmation.
 */
export default function MyPropertiesPage() {
  const toast = useToast()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProperty, setDeletingProperty] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Status change loading per property
  const [statusLoading, setStatusLoading] = useState({})

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const res = await getMyProperties()
        setProperties(res.data.properties || [])
      } catch  {
        toast.error('Failed to load your properties')
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Delete property
  const handleDeleteClick = (property) => {
    setDeletingProperty(property)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingProperty) return
    setDeleteLoading(true)
    try {
      await deleteProperty(deletingProperty._id)
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

  // Update property status
  const handleStatusChange = async (propertyId, newStatus) => {
    setStatusLoading((prev) => ({ ...prev, [propertyId]: true }))
    try {
      await updatePropertyStatus(propertyId, newStatus)
      setProperties((prev) =>
        prev.map((p) => (p._id === propertyId ? { ...p, status: newStatus } : p))
      )
      toast.success(`Status updated to ${formatLabel(newStatus)}`)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status'
      toast.error(message)
    } finally {
      setStatusLoading((prev) => ({ ...prev, [propertyId]: false }))
    }
  }

  const statusOptions = [
    { value: 'sale', label: 'For Sale' },
    { value: 'sold', label: 'Sold' },
  ]

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="page-title mb-1">My Properties</h1>
          <p className="text-gray-500">
            {loading ? 'Loading...' : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}`}
          </p>
        </div>
        <Link to="/seller/add-property" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading your properties..." />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
          title="No properties listed yet"
          description="Start by adding your first property to the platform."
          action={
            <Link to="/seller/add-property" className="btn-primary">
              Add Your First Property
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="sm:w-48 flex-shrink-0">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover sm:h-auto sm:min-h-[160px]"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {property.title}
                        </h3>
                        <Badge variant={property.status === 'sale' ? 'green' : 'red'}>
                          {formatLabel(property.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {[property.city, property.area].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-teal-700 flex-shrink-0">
                      {formatPrice(property.price)}
                    </p>
                  </div>

                  {/* Details Row */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <Badge variant="blue">{formatLabel(property.propertyType)}</Badge>
                    {property.bhk && <span>{property.bhk} BHK</span>}
                    {property.areaSize && <span>{property.areaSize} sq ft</span>}
                    {property.furnishing && <span>{formatLabel(property.furnishing)}</span>}
                    <span>{property.views} views</span>
                  </div>

                  <p className="text-xs text-gray-400 mb-4">
                    Listed on {formatDate(property.createdAt)}
                    {property.images?.length ? ` · ${property.images.length} image${property.images.length > 1 ? 's' : ''}` : ''}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-auto flex-wrap">
                    <Link
                      to={`/property/${property._id}`}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/seller/edit-property/${property._id}`}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      Edit
                    </Link>

                    {/* Status Change */}
                    <div className="flex items-center gap-2">
                      <select
                        value={property.status}
                        onChange={(e) => handleStatusChange(property._id, e.target.value)}
                        disabled={statusLoading[property._id]}
                        className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {statusLoading[property._id] && (
                        <svg className="animate-spin h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteClick(property)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
            ? `Are you sure you want to delete "${deletingProperty.title}"? This will also remove all associated images and inquiries. This action cannot be undone.`
            : 'Are you sure you want to delete this property?'
        }
        confirmLabel="Delete Property"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}