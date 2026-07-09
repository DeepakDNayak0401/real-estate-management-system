import api from './axios.js'

/**
 * Get own profile (from user routes)
 * GET /api/user/profile
 */
export const getUserProfile = () => {
    return api.get('/user/profile')
}

/**
 * Get a user's public profile by ID
 * GET /api/user/public/:id
 */
export const getPublicProfile = (userId) => {
    return api.get(`/user/public/${userId}`)
}

/**
 * Update own profile
 * PUT /api/user/profile
 * Uses FormData for optional profile picture upload
 */
export const updateUserProfile = (formData) => {
    return api.put('/user/profile', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}