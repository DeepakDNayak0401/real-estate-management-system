import { formatDate, getInitials } from '../../utils/helpers.js'
import { formatPrice } from '../../utils/helpers.js'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'

/**
 * Displays a single inquiry with buyer info, property info, message, and actions.
 * Used on the seller inquiries page and admin inquiries page.
 */
export default function InquiryCard({ inquiry, onMarkRead }) {
  if (!inquiry) return null

  const buyer = inquiry.buyer || {}
  const property = inquiry.property || {}

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 transition-colors ${
        inquiry.isRead ? 'opacity-75' : 'border-l-4 border-l-teal-500'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Buyer Avatar */}
        <div className="flex-shrink-0">
          {buyer.profilePic ? (
            <img
              src={buyer.profilePic}
              alt={buyer.name}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
              {getInitials(buyer.name)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900">{buyer.name || 'Unknown Buyer'}</p>
                {buyer.email && (
                  <span className="text-xs text-gray-400">{buyer.email}</span>
                )}
                {!inquiry.isRead && (
                  <Badge variant="teal">New</Badge>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatDate(inquiry.createdAt)}
              </p>
            </div>

            {/* Mark as Read */}
            {!inquiry.isRead && onMarkRead && (
              <Button
                variant="secondary"
                className="text-xs py-1 px-3 flex-shrink-0"
                onClick={() => onMarkRead(inquiry._id)}
              >
                Mark Read
              </Button>
            )}
          </div>

          {/* Property Info */}
          {property.title && (
            <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-lg px-3 py-2">
              {property.images?.[0] && (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {property.title}
                </p>
                <p className="text-xs text-gray-500">
                  {property.city}{property.area ? `, ${property.area}` : ''}
                  {property.price ? ` · ${formatPrice(property.price)}` : ''}
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          {inquiry.message && (
            <div className="bg-gray-50 rounded-lg px-3 py-2.5">
              <p className="text-sm text-gray-700 leading-relaxed">
                &ldquo;{inquiry.message}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}