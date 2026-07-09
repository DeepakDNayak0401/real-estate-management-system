import api from './axios.js'

/**
 * Submit a contact form (public)
 * POST /api/contact/
 */
export const createContact = (data) => {
    return api.post('/contact/', data)
}

/**
 * Get all contact submissions (admin only)
 * GET /api/contact/
 */
export const getAllContacts = () => {
    return api.get('/contact/')
}