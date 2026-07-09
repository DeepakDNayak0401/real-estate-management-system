import { formatDate, getInitials } from '../../utils/helpers.js'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'

/**
 * Card representing a seller account pending admin approval.
 * Shows seller details and an approve button.
 */
export default function SellerApprovalCard({ seller, onApprove, loading = false }) {
  if (!seller) return null

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        {seller.profilePic ? (
          <img
            src={seller.profilePic}
            alt={seller.name}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold flex-shrink-0">
            {getInitials(seller.name)}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-base font-semibold text-gray-900">{seller.name}</p>
            <Badge variant="amber">Pending Approval</Badge>
          </div>

          <div className="space-y-0.5">
            {seller.email && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {seller.email}
              </p>
            )}
            {seller.phone && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {seller.phone}
              </p>
            )}
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Registered on {formatDate(seller.createdAt)}
            </p>
          </div>
        </div>

        {/* Approve Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => onApprove(seller._id)}
            loading={loading}
            className="whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}