/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useRef } from 'react'
import { TOAST_DURATION } from '../utils/constants.js'

export const ToastContext = createContext(null)

let toastIdCounter = 0

/**
 * Toast notification container — renders at the top-right of the screen.
 * Placed here to keep context and rendering co-located.
 */
function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null

  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }

  const icons = {
    success: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${bgColors[toast.type] || bgColors.info} animate-[slideIn_0.3s_ease-out]`}
          onClick={() => removeToast(toast.id)}
          role="alert"
        >
          {icons[toast.type] || icons.info}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              removeToast(toast.id)
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
  }, [])

  const addToast = useCallback(
    (message, type = 'info', duration = TOAST_DURATION) => {
      const id = ++toastIdCounter
      setToasts((prev) => [...prev, { id, message, type }])

      timersRef.current[id] = setTimeout(() => {
        removeToast(id)
      }, duration)

      return id
    },
    [removeToast]
  )

  const success = useCallback(
    (message, duration) => addToast(message, 'success', duration),
    [addToast]
  )

  const error = useCallback(
    (message, duration) => addToast(message, 'error', duration),
    [addToast]
  )

  const info = useCallback(
    (message, duration) => addToast(message, 'info', duration),
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}