import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChats, deleteChat as deleteChatApi } from '../../api/chat.api.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { getInitials, getRelativeTime, truncate } from '../../utils/helpers.js'
import ChatWindow from '../../components/chat/ChatWindow.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

export default function ChatsPage() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  // ✅ Get markChatsAsRead function from context
  const { user, markChatsAsRead } = useAuth()
  const toast = useToast()

  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showList, setShowList] = useState(true) // Mobile toggle

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingChatId, setDeletingChatId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ✅ Mark chats as read when user visits this page
  useEffect(() => {
    markChatsAsRead()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch all chats
  const fetchChats = async () => {
    setLoading(true)
    try {
      const res = await getChats()
      const chatList = res.data.chats || []
      setChats(chatList)

      // If URL has a chatId, find and set it as active
      if (chatId) {
        const found = chatList.find((c) => c._id === chatId)
        if (found) {
          setActiveChat(found)
          setShowList(false)
        }
      }
    } catch  {
      toast.error('Failed to load chats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchChats()
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle chat selection
  const handleSelectChat = (chat) => {
    setActiveChat(chat)
    setShowList(false)
    navigate(`/chats/${chat._id}`, { replace: true })
  }

  // Handle back to list (mobile)
  const handleBackToList = () => {
    setShowList(true)
    navigate('/chats', { replace: true })
  }

  // Handle new message from ChatWindow — update chat list preview
  const handleChatUpdate = (message) => {
    setChats((prev) => {
      return prev.map((c) => {
        if (c._id === activeChat?._id || c._id === message.chatId) {
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            messages: [...(c.messages || []), message],
          }
        }
        return c
      }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    })
  }

  // Delete chat
  const handleDeleteChat = async () => {
    if (!deletingChatId) return
    setDeleteLoading(true)
    try {
      await deleteChatApi(deletingChatId)
      setChats((prev) => prev.filter((c) => c._id !== deletingChatId))
      if (activeChat?._id === deletingChatId) {
        setActiveChat(null)
        navigate('/chats', { replace: true })
        setShowList(true)
      }
      toast.success('Chat deleted')
    } catch  {
      toast.error('Failed to delete chat')
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setDeletingChatId(null)
    }
  }

  // Determine the "other" person in a chat
  const getOtherPerson = (chat) => {
    if (!chat || !user) return null
    return chat.buyer?._id === user.id ? chat.seller : chat.buyer
  }

  return (
    <div className="flex h-full min-h-0">
      {/* ===== Chat List (Left Panel) ===== */}
      <div
        className={`${
          showList ? 'flex' : 'hidden'
        } lg:flex flex-col w-full lg:w-80 xl:w-96 border-r border-gray-200 bg-white flex-shrink-0`}
      >
        {/* List Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {chats.length}
          </span>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {loading ? (
            <Loader message="Loading chats..." />
          ) : chats.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              title="No conversations"
              description="Chat with buyers or sellers about properties."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {chats.map((chat) => {
                const other = getOtherPerson(chat)
                const lastMsg = chat.messages?.[chat.messages.length - 1]
                const isActive = activeChat?._id === chat._id

                return (
                  <div
                    key={chat._id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors relative group ${
                      isActive ? 'bg-teal-50' : ''
                    } ${!showList ? 'hidden lg:flex' : 'flex'}`}
                    onClick={() => handleSelectChat(chat)}
                  >
                    {/* Avatar */}
                    {other?.profilePic ? (
                      <img
                        src={other.profilePic}
                        alt={other.name}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {getInitials(other?.name)}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {other?.name || 'Unknown'}
                        </p>
                        {lastMsg?.createdAt && (
                          <span className="text-[10px] text-gray-400 flex-shrink-0">
                            {getRelativeTime(lastMsg.createdAt)}
                          </span>
                        )}
                      </div>
                      {chat.property && (
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {chat.property.title}
                        </p>
                      )}
                      {lastMsg && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {lastMsg.image ? '📷 Image' : truncate(lastMsg.text, 45)}
                        </p>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeletingChatId(chat._id)
                        setDeleteDialogOpen(true)
                      }}
                      className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all"
                      title="Delete chat"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== Chat Window (Right Panel) ===== */}
      <div
        className={`${
          showList ? 'hidden' : 'flex'
        } lg:flex flex-col flex-1 min-w-0 bg-gray-50`}
      >
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            onBack={handleBackToList}
            onChatUpdate={handleChatUpdate}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              title="Select a conversation"
              description="Choose a chat from the list to start messaging."
            />
          </div>
        )}
      </div>

      {/* ===== Delete Chat Dialog ===== */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setDeletingChatId(null)
        }}
        onConfirm={handleDeleteChat}
        title="Delete Chat"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  )
}