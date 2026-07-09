import { useState, useEffect, useRef } from 'react'
import Input from '../common/Input.jsx'
import Select from '../common/Select.jsx'
import Textarea from '../common/Textarea.jsx'
import Button from '../common/Button.jsx'
import { PROPERTY_TYPES, FURNISHING_OPTIONS, PROPERTY_STATUS, COMMON_AMENITIES } from '../../utils/constants.js'
import { formatLabel } from '../../utils/helpers.js'

/**
 * Shared property form for both Add and Edit pages.
 * Handles all property fields + image uploads + amenity tags.
 * Uses FormData for multipart submission.
 *
 * Props:
 * - initialData: property object for edit mode (null for add)
 * - onSubmit: async (formData) => void
 * - loading: boolean
 */
export default function PropertyForm({ initialData = null, onSubmit, loading = false }) {
  const isEdit = !!initialData

  const getInitialForm = (data) => ({
    title: data?.title || '',
    description: data?.description || '',
    price: data?.price?.toString() || '',
    city: data?.city || '',
    area: data?.area || '',
    pincode: data?.pincode || '',
    propertyType: data?.propertyType || '',
    bhk: data?.bhk || '',
    bathrooms: data?.bathrooms?.toString() || '',
    areaSize: data?.areaSize?.toString() || '',
    furnishing: data?.furnishing || '',
    status: data?.status || 'sale',
    amenities: data?.amenities || [],
  })

  // Form fields
  const [form, setForm] = useState(() => getInitialForm(initialData))

  // Image state
  const [newImages, setNewImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  // Amenity input
  const [amenityInput, setAmenityInput] = useState('')

  // Errors
  const [errors, setErrors] = useState({})

  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Amenity tag management
  const addAmenity = (value) => {
    const trimmed = value.trim()
    if (trimmed && !form.amenities.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, trimmed],
      }))
    }
    setAmenityInput('')
  }

  const removeAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleAmenityKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addAmenity(e.target.value)
    }
    // Remove last tag on backspace if input is empty
    if (e.key === 'Backspace' && !amenityInput && form.amenities.length > 0) {
      removeAmenity(form.amenities[form.amenities.length - 1])
    }
  }

  const handleAmenityBlur = () => {
    if (amenityInput.trim()) {
      addAmenity(amenityInput)
    }
  }

  const addSuggestedAmenity = (amenity) => {
    if (!form.amenities.includes(amenity)) {
      setForm((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }))
    }
  }

  // Image handling
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (newImages.length + files.length > 10) {
      alert('Maximum 10 images allowed')
      return
    }
    setNewImages((prev) => [...prev, ...files])

    // Generate previews
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...newPreviews])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Validation
  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.area.trim()) newErrors.area = 'Area is required'
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required'
    if (!form.propertyType) newErrors.propertyType = 'Property type is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('description', form.description.trim())
    formData.append('price', form.price)
    formData.append('city', form.city.trim())
    formData.append('area', form.area.trim())
    formData.append('pincode', form.pincode.trim())
    formData.append('propertyType', form.propertyType)
    formData.append('status', form.status)

    if (form.bhk) formData.append('bhk', form.bhk)
    if (form.bathrooms) formData.append('bathrooms', form.bathrooms)
    if (form.areaSize) formData.append('areaSize', form.areaSize)
    if (form.furnishing) formData.append('furnishing', form.furnishing)
    if (form.amenities.length > 0) {
      formData.append('amenities', JSON.stringify(form.amenities))
    }

    // In edit mode, send remaining existing images
    if (isEdit && existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages))
    } else if (isEdit && existingImages.length === 0) {
      formData.append('existingImages', JSON.stringify([]))
    }

    // Append new image files
    newImages.forEach((file) => {
      formData.append('images', file)
    })

    onSubmit(formData)
  }

  // Options
  const propertyTypeOptions = PROPERTY_TYPES.map((t) => ({
    value: t,
    label: formatLabel(t),
  }))
  const furnishingOptions = FURNISHING_OPTIONS.map((f) => ({
    value: f,
    label: formatLabel(f),
  }))
  const statusOptions = PROPERTY_STATUS.map((s) => ({
    value: s,
    label: formatLabel(s),
  }))

  // Suggested amenities not yet added
  const suggestedAmenities = COMMON_AMENITIES.filter(
    (a) => !form.amenities.includes(a)
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ===== Basic Information ===== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Property Title"
            name="title"
            type="text"
            placeholder="e.g., Spacious 3 BHK in Andheri"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="Describe your property in detail..."
            value={form.description}
            onChange={handleChange}
            error={errors.description}
            rows={5}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Property Type"
              name="propertyType"
              options={propertyTypeOptions}
              placeholder="Select type"
              value={form.propertyType}
              onChange={handleChange}
              error={errors.propertyType}
            />
            <Select
              label="Status"
              name="status"
              options={statusOptions}
              placeholder="Select status"
              value={form.status}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* ===== Location ===== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              type="text"
              placeholder="e.g., Mumbai"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
            />
            <Input
              label="Area / Locality"
              name="area"
              type="text"
              placeholder="e.g., Andheri West"
              value={form.area}
              onChange={handleChange}
              error={errors.area}
            />
          </div>
          <Input
            label="Pincode"
            name="pincode"
            type="text"
            placeholder="e.g., 400053"
            value={form.pincode}
            onChange={handleChange}
            error={errors.pincode}
            className="max-w-xs"
          />
        </div>
      </div>

      {/* ===== Property Details ===== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="BHK"
            name="bhk"
            type="text"
            placeholder="e.g., 3"
            value={form.bhk}
            onChange={handleChange}
            helperText="e.g., 1, 2, 3, 4, 5"
          />
          <Input
            label="Bathrooms"
            name="bathrooms"
            type="number"
            placeholder="e.g., 2"
            value={form.bathrooms}
            onChange={handleChange}
            min="0"
          />
          <Input
            label="Area Size (sq ft)"
            name="areaSize"
            type="number"
            placeholder="e.g., 1200"
            value={form.areaSize}
            onChange={handleChange}
            min="0"
          />
          <Select
            label="Furnishing"
            name="furnishing"
            options={furnishingOptions}
            placeholder="Select"
            value={form.furnishing}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ===== Pricing ===== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
        <Input
          label="Price (₹)"
          name="price"
          type="number"
          placeholder="e.g., 5000000"
          value={form.price}
          onChange={handleChange}
          error={errors.price}
          className="max-w-sm"
          helperText="Enter the total price in rupees"
        />
      </div>

      {/* ===== Amenities ===== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>

        {/* Current Tags */}
        {form.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {form.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => removeAmenity(amenity)}
                  className="hover:text-teal-900 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Amenity Input */}
        <Input
          name="amenityInput"
          type="text"
          placeholder="Type an amenity and press Enter"
          value={amenityInput}
          onChange={(e) => setAmenityInput(e.target.value)}
          onKeyDown={handleAmenityKeyDown}
          onBlur={handleAmenityBlur}
          helperText="Press Enter or comma to add. Backspace to remove last."
        />

        {/* Suggested Amenities */}
        {suggestedAmenities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedAmenities.slice(0, 12).map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => addSuggestedAmenity(amenity)}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  + {amenity}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== Images ===== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Images
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Max 10 total)
          </span>
        </h3>

        {/* Existing Images (edit mode) */}
        {isEdit && existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Current images:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                  <img
                    src={img}
                    alt={`Existing ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">New images to upload:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-teal-300 group">
                  <img
                    src={preview}
                    alt={`New ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-teal-600/10" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={newImages.length + existingImages.length >= 10}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {newImages.length + existingImages.length}/10 — Add Images
          </Button>
        </div>
      </div>

      {/* ===== Submit ===== */}
      <div className="flex items-center gap-4">
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update Property' : 'Add Property'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}