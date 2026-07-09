/**
 * Reusable textarea with label, error message, and row count.
 */
export default function Textarea({
  label,
  name,
  placeholder = '',
  value,
  onChange,
  error,
  rows = 4,
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label-text">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`input-field resize-vertical ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}