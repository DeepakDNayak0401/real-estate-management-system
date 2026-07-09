import api from './axios.js'

/**
 * Add a property to wishlist
 * POST /api/wishlist/:propertyID
 */
export const addToWishlist = (propertyId) => {
    return api.post(`/wishlist/${propertyId}`)
}

/**
 * Get current user's wishlist
 * GET /api/wishlist/
 */
export const getWishlist = () => {
    return api.get('/wishlist/')
}

/**
 * Remove a property from wishlist
 * DELETE /api/wishlist/:propertyID
 */
export const removeFromWishlist = (propertyId) => {
    return api.delete(`/wishlist/${propertyId}`)
}