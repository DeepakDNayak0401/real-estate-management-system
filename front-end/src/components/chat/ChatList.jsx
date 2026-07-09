import { useAuth } from '../../hooks/useAuth.js'
import { getRelativeTime, getInitials, truncate } from '../../utils/helpers.js'
import EmptyState from '../common/EmptyState.jsx'
import Loader from '../common/Loader.jsx'

/**
 * List of chat conversations.
 */
export default function ChatList({ chats = [], activeChatId, onSelect, loading }) {
  if (loading) {
    return <Loader message="Loading chats..." />
  }

  if (chats.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        }
        title="No conversations yet"
        description="When you chat with a buyer or seller about a property, it will appear here."
      />
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {chats.map((chat) => {
        const isActive = chat._id === activeChatId
        const lastMessage = chat.messages?.[chat.messages.length - 1]

        return (
          <button
            key={chat._id}
            onClick={() => onSelect(chat)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
              isActive ? 'bg-teal-50 border-r-2 border-teal-600' : ''
            }`}
          >
            <ChatAvatar chat={chat} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <ChatName chat={chat} />
                {lastMessage?.createdAt && (
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {getRelativeTime(lastMessage.createdAt)}
                  </span>
                )}
              </div>
              {chat.property && (
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {chat.property.title}
                </p>
              )}
              {lastMessage && (
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {lastMessage.image ? '📷 Image' : truncate(lastMessage.text, 50)}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ✅ FIXED: Properly use the imported useAuth hook
function ChatAvatar({ chat }) {
  const { user } = useAuth()
  const otherPerson = chat.buyer?._id === user?.id ? chat.seller : chat.buyer

  if (otherPerson?.profilePic) {
    return (
      <img
        src={otherPerson.profilePic}
        alt={otherPerson.name}
        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
      />
    )
  }
  return (
    <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
      {getInitials(otherPerson?.name)}
    </div>
  )
}

function ChatName({ chat }) {
  const { user } = useAuth()
  const otherPerson = chat.buyer?._id === user?.id ? chat.seller : chat.buyer

  return (
    <p className="text-sm font-semibold text-gray-900 truncate">
      {otherPerson?.name || 'Unknown'}
    </p>
  )
}