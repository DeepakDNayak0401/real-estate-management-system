/**
 * Format a number as Indian currency (₹)
 * @param {number} price
 * @returns {string} e.g., "₹50,00,000"
 */
export const formatPrice = (price) => {
    if (price == null || isNaN(price)) return '₹0'
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price)
}

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} e.g., "15 Jan 2024"
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

/**
 * Format a date string with time
 * @param {string} dateStr - ISO date string
 * @returns {string} e.g., "15 Jan 2024, 3:30 PM"
 */
export const formatDateTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export const getRelativeTime = (dateStr) => {
    if (!dateStr) return ''
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return formatDate(dateStr)
}

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Format property type for display (e.g., "semi-furnished" → "Semi Furnished")
 * @param {string} str
 * @returns {string}
 */
export const formatLabel = (str) => {
    if (!str) return ''
    return str
        .split('-')
        .map((word) => capitalize(word))
        .join(' ')
}

/**
 * Truncate a string to a given length
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncate = (str, length = 100) => {
    if (!str) return ''
    if (str.length <= length) return str
    return str.slice(0, length) + '...'
}

/**
 * Get initials from a name (for avatar fallback)
 * @param {string} name
 * @returns {string} e.g., "JD" for "John Doe"
 */
export const getInitials = (name) => {
    if (!name) return '?'
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

/**
 * Build query string from an object, skipping null/undefined/empty values
 * @param {Object} params
 * @returns {string}
 */
export const buildQueryString = (params) => {
    const filtered = Object.entries(params).filter(
        ([, value]) => value !== null && value !== undefined && value !== ''
    )
    if (filtered.length === 0) return ''
    const queryString = new URLSearchParams(
        Object.fromEntries(filtered)
    ).toString()
    return `?${queryString}`
}