import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMyProperties, updateProperty } from '../../api/property.api.js'
import { useToast } from '../../hooks/useToast.js'
import PropertyForm from '../../components/property/PropertyForm.jsx'
import Loader from '../../components/common/Loader.jsx'

/**
 * Edit Property page — fetches the seller's property by ID from their listings,
 * populates PropertyForm, and handles update via FormData.
 * Uses getMyProperties (not getPropertyDetails) to avoid incrementing view count.
 */
export default function EditPropertyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Fetch the property from seller's own listings
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const res = await getMyProperties()
        const found = (res.data.properties || []).find((p) => p._id === id)

        if (!found) {
          setNotFound(true)
          toast.error('Property not found or you do not have permission to edit it')
          return
        }

        setProperty(found)
      } catch  {
        toast.error('Failed to load property')
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      await updateProperty(id, formData)
      toast.success('Property updated successfully!')
      navigate('/seller/properties')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update property'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <Loader message="Loading property..." size="lg" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-500 mb-6">
            This property may not exist or you don't have permission to edit it.
          </p>
          <button onClick={() => navigate('/seller/properties')} className="btn-primary">
            Back to My Properties
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title mb-1">Edit Property</h1>
        <p className="text-gray-500">Update the details of your property listing</p>
      </div>

      <PropertyForm
        initialData={property}
        onSubmit={handleSubmit}
        loading={submitting}
      />
    </div>
  )
}