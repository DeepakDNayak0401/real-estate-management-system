import api from './axios.js'

/**
 * Get admin dashboard statistics
 * GET /api/admin/dashboard/stats
 */
export const getDashboardStats = () => {
    return api.get('/admin/dashboard/stats')
}

/**
 * Get all users (admin)
 * GET /api/admin/users
 */
export const getAllUsers = () => {
    return api.get('/admin/users')
}

/**
 * Block or unblock a user (admin)
 * PATCH /api/admin/users/:id/block
 */
export const blockUser = (userId) => {
    return api.patch(`/admin/users/${userId}/block`)
}

/**
 * Delete a user (admin)
 * DELETE /api/admin/users/:id
 */
export const deleteUser = (userId) => {
    return api.delete(`/admin/users/${userId}`)
}

/**
 * Get all properties (admin)
 * GET /api/admin/properties
 */
export const getAllProperties = () => {
    return api.get('/admin/properties')
}

/**
 * Delete any property (admin)
 * DELETE /api/admin/properties/:id
 */
export const deleteProperty = (propertyId) => {
    return api.delete(`/admin/properties/${propertyId}`)
}

/**
 * Get all inquiries (admin)
 * GET /api/admin/inquiries
 */
export const getAllInquiries = () => {
    return api.get('/admin/inquiries')
}

/**
 * Get pending seller approval requests (admin)
 * GET /api/admin/pending-seller-approvals
 */
export const getPendingSellers = () => {
    return api.get('/admin/pending-seller-approvals')
}

/**
 * Approve a seller account (admin)
 * PATCH /api/admin/sellers/:id/approve
 */
export const approveSeller = (sellerId) => {
    return api.patch(`/admin/sellers/${sellerId}/approve`)
}