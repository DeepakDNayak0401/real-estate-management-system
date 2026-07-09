import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

/**
 * Custom hook to access the auth context.
 * Throws an error if used outside of AuthProvider.
 */
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}