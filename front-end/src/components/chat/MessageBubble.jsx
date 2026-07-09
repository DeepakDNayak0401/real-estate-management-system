import { useAuth } from '../../hooks/useAuth.js'
import { formatDateTime } from '../../utils/helpers.js'

/**
 * A single chat message bubble.
 * Aligns right for current user, left for the other party.
 * Shows sender name, text, optional image, timestamp, and delete button for own messages.
 */
export default function MessageBubble({ message, onDelete }) {
  const { user } = useAuth()
  const isOwn = message.sender?._id === user?.id || message.sender === user?.id

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 group`}>
      <div
        className={`relative max-w-[75%] sm:max-w-[65%] ${
          isOwn ? 'order-2' : 'order-1'
        }`}
      >
        {/* Sender Name (only for other person's messages) */}
        {!isOwn && message.sender?.name && (
          <p className="text-xs text-gray-500 mb-1 ml-1">
            {message.sender.name}
          </p>
        )}

        {/* Bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? 'bg-teal-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}
        >
          {/* Image */}
          {message.image && (
            <div className="mb-2">
              <img
                src={message.image}
                alt="Shared image"
                className="max-w-full rounded-lg max-h-60 object-cover"
              />
            </div>
          )}

          {/* Text */}
          {message.text && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          )}
        </div>

        {/* Timestamp + Delete */}
        <div
          className={`flex items-center gap-2 mt-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-[10px] text-gray-400 ml-1">
            {formatDateTime(message.createdAt)}
          </span>
          {isOwn && onDelete && (
            <button
              onClick={() => onDelete(message._id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-0.5"
              title="Delete message"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}