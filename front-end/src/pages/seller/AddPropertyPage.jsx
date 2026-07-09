import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addProperty } from '../../api/property.api.js'
import { useToast } from '../../hooks/useToast.js'
import PropertyForm from '../../components/property/PropertyForm.jsx'

/**
 * Add Property page — wraps PropertyForm with no initial data.
 * On submit, sends FormData to backend and navigates to My Properties.
 */
export default function AddPropertyPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      await addProperty(formData)
      toast.success('Property added successfully!')
      navigate('/seller/properties')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add property'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title mb-1">Add New Property</h1>
        <p className="text-gray-500">Fill in the details to list your property on the platform</p>
      </div>

      <PropertyForm
        initialData={null}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}