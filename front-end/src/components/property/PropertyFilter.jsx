import { useState } from 'react'
import Input from '../common/Input.jsx'
import Select from '../common/Select.jsx'
import Button from '../common/Button.jsx'
import { PROPERTY_TYPES, FURNISHING_OPTIONS, BHK_OPTIONS, SORT_OPTIONS } from '../../utils/constants.js'
import { formatLabel } from '../../utils/helpers.js'

/**
 * Property filter panel.
 * Used as a sidebar on desktop, slides in as a sheet on mobile.
 * All filter changes are passed up via onChange callback.
 */
export default function PropertyFilter({ filters, onChange, onReset }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filters, [name]: value })
  }

  const handleClear = () => {
    onReset()
    setMobileOpen(false)
  }

  const handleApply = () => {
    setMobileOpen(false)
  }

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== '' && v !== undefined && v !== null
  )

  // Property type options
  const propertyTypeOptions = PROPERTY_TYPES.map((t) => ({
    value: t,
    label: formatLabel(t),
  }))

  // Furnishing options
  const furnishingOptions = FURNISHING_OPTIONS.map((f) => ({
    value: f,
    label: formatLabel(f),
  }))

  // BHK options
  const bhkOptions = BHK_OPTIONS.map((b) => ({
    value: b,
    label: b === '5+' ? '5+ BHK' : `${b} BHK`,
  }))

  const filterContent = (
    <div className="space-y-5">
      {/* Search by City */}
      <Input
        label="City"
        name="city"
        type="text"
        placeholder="e.g., Mumbai"
        value={filters.city || ''}
        onChange={handleChange}
      />

      {/* Search by Area */}
      <Input
        label="Area / Locality"
        name="area"
        type="text"
        placeholder="e.g., Andheri"
        value={filters.area || ''}
        onChange={handleChange}
      />

      {/* Pincode */}
      <Input
        label="Pincode"
        name="pincode"
        type="text"
        placeholder="e.g., 400053"
        value={filters.pincode || ''}
        onChange={handleChange}
      />

      {/* Property Type */}
      <Select
        label="Property Type"
        name="propertyType"
        options={propertyTypeOptions}
        placeholder="All Types"
        value={filters.propertyType || ''}
        onChange={handleChange}
      />

      {/* BHK */}
      <Select
        label="BHK"
        name="bhk"
        options={bhkOptions}
        placeholder="Any BHK"
        value={filters.bhk || ''}
        onChange={handleChange}
      />

      {/* Furnishing */}
      <Select
        label="Furnishing"
        name="furnishing"
        options={furnishingOptions}
        placeholder="Any"
        value={filters.furnishing || ''}
        onChange={handleChange}
      />

      {/* Price Range */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min Price (₹)"
          name="minPrice"
          type="number"
          placeholder="0"
          value={filters.minPrice || ''}
          onChange={handleChange}
        />
        <Input
          label="Max Price (₹)"
          name="maxPrice"
          type="number"
          placeholder="Any"
          value={filters.maxPrice || ''}
          onChange={handleChange}
        />
      </div>

      {/* Amenities (comma-separated) */}
      <Input
        label="Amenities"
        name="amenities"
        type="text"
        placeholder="e.g., Parking, Gym, Pool"
        value={filters.amenities || ''}
        onChange={handleChange}
        helperText="Separate multiple amenities with commas"
      />

      {/* Sort */}
      <Select
        label="Sort By"
        name="sort"
        options={SORT_OPTIONS}
        placeholder="Latest First"
        value={filters.sort || ''}
        onChange={handleChange}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          onClick={handleClear}
          className="flex-1"
        >
          Clear All
        </Button>
        <Button
          onClick={handleApply}
          className="flex-1 md:hidden"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center gap-3 mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Mobile Sort */}
        <select
          name="sort"
          value={filters.sort || ''}
          onChange={handleChange}
          className="flex-1 input-field text-sm py-2.5"
        >
          <option value="">Latest First</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Desktop Sidebar Filter */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          {filterContent}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto animate-[slideRight_0.3s_ease-out]">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </>
  )
}