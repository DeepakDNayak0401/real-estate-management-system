import api from './axios.js'
import { buildQueryString } from '../utils/helpers.js'

/**
 * Get all properties with optional filters and sorting
 * GET /api/property/
 */
export const getAllProperties = (filters = {}) => {
    const queryString = buildQueryString(filters)
    return api.get(`/property/${queryString}`)
}

/**
 * Get property details by ID (also increments view count)
 * GET /api/property/:id
 */
export const getPropertyDetails = (propertyId) => {
    return api.get(`/property/${propertyId}`)
}

/**
 * Get property counts grouped by propertyType
 * GET /api/property/counts
 */
export const getPropertyCounts = () => {
    return api.get('/property/counts')
}

/**
 * Add a new property (seller only)
 * POST /api/property/
 * Uses FormData for image uploads
 */
export const addProperty = (formData) => {
    return api.post('/property/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

/**
 * Get current seller's properties
 * GET /api/property/my
 */
export const getMyProperties = () => {
    return api.get('/property/my')
}

/**
 * Update a property (seller only, must be owner)
 * PUT /api/property/:id
 * Uses FormData for image uploads
 */
export const updateProperty = (propertyId, formData) => {
    return api.put(`/property/${propertyId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

/**
 * Delete a property (seller only, must be owner)
 * DELETE /api/property/:id
 */
export const deleteProperty = (propertyId) => {
    return api.delete(`/property/${propertyId}`)
}

/**
 * Update property status (seller only, must be owner)
 * PATCH /api/property/:id/status
 */
export const updatePropertyStatus = (propertyId, status) => {
    return api.patch(`/property/${propertyId}/status`, { status })
}

/**
 * Get seller dashboard statistics
 * GET /api/property/seller/dashboard
 */
export const getSellerDashboardStats = () => {
    return api.get('/property/seller/dashboard')
}