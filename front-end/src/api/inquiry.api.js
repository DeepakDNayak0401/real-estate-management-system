import api from './axios.js'

/**
 * Send an inquiry to a property's seller (buyer only)
 * POST /api/inquiry/
 */
export const sendInquiry = (data) => {
    return api.post('/inquiry/', data)
}

/**
 * Get all inquiries for the current seller
 * GET /api/inquiry/seller
 */
export const getSellerInquiries = () => {
    return api.get('/inquiry/seller')
}

/**
 * Mark an inquiry as read
 * PUT /api/inquiry/read/:inquiryId
 */
export const markInquiryAsRead = (inquiryId) => {
    return api.put(`/inquiry/read/${inquiryId}`)
}