import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext.jsx'

/**
 * Custom hook to access the toast context.
 * Throws an error if used outside of ToastProvider.
 */
export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}