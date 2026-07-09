/**
 * Small status badge with color variants.
 */
export default function Badge({ variant = 'teal', children, className = '' }) {
  const variantClasses = {
    teal: 'badge-teal',
    blue: 'badge-blue',
    amber: 'badge-amber',
    red: 'badge-red',
    green: 'badge-green',
    gray: 'badge-gray',
  }

  return (
    <span className={`${variantClasses[variant] || variantClasses.teal} ${className}`}>
      {children}
    </span>
  )
}