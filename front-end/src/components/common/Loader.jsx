/**
 * Loading spinner with optional message and size variants.
 */
export default function Loader({ message = '', size = 'md', fullScreen = false }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} border-teal-200 border-t-teal-600`}
      />
      {message && (
        <p className="text-sm text-gray-500">{message}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/80">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  )
}