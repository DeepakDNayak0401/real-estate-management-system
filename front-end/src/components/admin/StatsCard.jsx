/**
 * Reusable stats card for dashboard pages.
 * Used by both Seller Dashboard and Admin Dashboard.
 */
export default function StatsCard({ icon, label, value, color = 'teal' }) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-50 text-gray-600',
  }

  return (
    <div className="stat-card">
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 p-3 rounded-xl ${colorClasses[color] || colorClasses.teal}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value || 0}
          </p>
        </div>
      </div>
    </div>
  )
}