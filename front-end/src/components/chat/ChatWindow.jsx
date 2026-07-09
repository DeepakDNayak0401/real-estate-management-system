/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
// ✅ FIX: Added sendMessage to the imports at the top
import { getChatMessages, sendMessage, deleteMessage } from '../../api/chat.api.js'
import { getSocket } from '../../utils/socket.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { getInitials } from '../../utils/helpers.js'
import MessageBubble from './MessageBubble.jsx'
import ChatInput from './ChatInput.jsx'
import Loader from '../common/Loader.jsx'
import EmptyState from '../common/EmptyState.jsx'

/**
 * The main chat conversation view.
 */
export default function ChatWindow({ chat, onBack, onChatUpdate }) {
  const { user } = useAuth()
  const toast = useToast()
  const socket = getSocket()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  // ✅ FIX: Properly destructure BOTH the state value and the setter function
  const [deletingId, setDeletingId] = useState(null)

  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  // The other person in this chat
  const otherPerson = chat?.buyer?._id === user?.id ? chat?.seller : chat?.buyer

  // Fetch messages when chat changes
  useEffect(() => {
    if (!chat?._id) return
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const res = await getChatMessages(chat._id)
        setMessages(res.data.chat.messages || [])
      } catch  {
        toast.error('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
    socket.emit('joinChat', chat._id)
  }, [chat?._id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for real-time messages
  useEffect(() => {
    const handleReceiveMessage = (incoming) => {
      if (incoming.chatId === chat?._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === incoming._id)
          if (exists) return prev
          return [...prev, incoming]
        })
      }
      if (onChatUpdate) {
        onChatUpdate(incoming)
      }
    }
    socket.on('receiveMessage', handleReceiveMessage)
    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
    }
  }, [chat?._id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ✅ FIX: Cleaned up send logic using the properly imported sendMessage
  const handleSend = async (text) => {
    if (!chat?._id || !text.trim()) return
    setSending(true)
    try {
      const result = await sendMessage({ chatId: chat._id, text })
      const savedMsg = result.data.message

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === savedMsg._id)
        if (exists) return prev
        return [...prev, savedMsg]
      })

      socket.emit('sendMessage', {
        chatId: chat._id,
        _id: savedMsg._id,
        sender: { _id: user.id, name: user.name },
        text: savedMsg.text,
        image: savedMsg.image,
        createdAt: savedMsg.createdAt,
      })

      if (onChatUpdate) {
        onChatUpdate(savedMsg)
      }
    } catch  {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // ✅ FIX: Cleaned up delete logic using the properly imported deleteMessage
  const handleDeleteMessage = async (messageId) => {
    setDeletingId(messageId)
    try {
      await deleteMessage(chat._id, messageId)
      setMessages((prev) => prev.filter((m) => m._id !== messageId))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete message')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={onBack}
          className="lg:hidden p-1.5 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Back to chats"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {otherPerson?.profilePic ? (
          <img
            src={otherPerson.profilePic}
            alt={otherPerson.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {getInitials(otherPerson?.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{otherPerson?.name}</p>
          {chat?.property && (
            <p className="text-xs text-gray-500 truncate">
              Re: {chat.property.title}
            </p>
          )}
        </div>

        {chat?.property?.images?.[0] && (
          <img
            src={chat.property.images[0]}
            alt={chat.property.title}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
          />
        )}
      </div>

      {/* Messages Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin"
      >
        {loading ? (
          <Loader message="Loading messages..." />
        ) : messages.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="No messages yet"
            description="Start the conversation by sending a message."
          />
        ) : (
          <div>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                onDelete={msg.sender?._id === user?.id ? handleDeleteMessage : null}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={sending || loading} />
    </div>
  )
}