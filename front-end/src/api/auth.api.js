import api from './axios.js'

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = (data) => {
    return api.post('/auth/register', data)
}

/**
 * Login user
 * POST /api/auth/login
 */
export const loginUser = (data) => {
    return api.post('/auth/login', data)
}

/**
 * Verify email with 6-digit code
 * POST /api/auth/verify-email
 */
export const verifyEmail = (data) => {
    return api.post('/auth/verify-email', data)
}

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = () => {
    return api.get('/auth/me')
}

/**
 * Request password reset email
 * POST /api/auth/forgot-password
 */
export const forgotPassword = (data) => {
    return api.post('/auth/forgot-password', data)
}

/**
 * Reset password using token
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = (token, data) => {
    return api.post(`/auth/reset-password/${token}`, data)
}