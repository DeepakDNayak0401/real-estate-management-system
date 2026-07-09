import { createContext, useState, useEffect, useCallback } from 'react'
import { getMe, loginUser as loginUserApi, registerUser as registerUserApi } from '../api/auth.api.js'
import { getChats } from '../api/chat.api.js'
import { connectSocket, disconnectSocket, getSocket } from '../utils/socket.js'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // ✅ NEW: Global state for unread messages
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

  // Fetch current user on mount if token exists
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const res = await getMe()
      setUser(res.data.user)
      connectSocket()
    } catch  {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(fetchUser)
  }, [fetchUser])

  // ✅ NEW: Initialize unread messages count on load
  useEffect(() => {
    if (!user) {
      return
    }

    const checkUnread = async () => {
      try {
        const res = await getChats()
        const chats = res.data.chats || []
        const lastSeen = localStorage.getItem('lastSeenChatsAt')

        if (!lastSeen) {
          // First time visiting, set baseline so we don't show badge for old messages
          localStorage.setItem('lastSeenChatsAt', new Date().toISOString())
          return
        }

        const lastSeenDate = new Date(lastSeen)
        let count = 0

        // Count ALL unread messages across all chats
        chats.forEach(chat => {
          chat.messages?.forEach(msg => {
            if (new Date(msg.createdAt) > lastSeenDate) {
              // Only count if the message is from the OTHER person
              if (msg.sender?._id !== user.id && msg.sender !== user.id) {
                count++
              }
            }
          })
        })
        setUnreadMessagesCount(count)
      } catch  {
        // Silently fail
      }
    }

    checkUnread()
  }, [user])

  // ✅ NEW: Listen for real-time messages via Socket.io
  useEffect(() => {
    if (!user) return
    const s = getSocket()
    if (!s) return

    const handleReceive = (msg) => {
      // If user is NOT on the chats page, increment unread count
      if (!window.location.pathname.startsWith('/chats')) {
        if (msg.sender?._id !== user.id && msg.sender !== user.id) {
          setUnreadMessagesCount(prev => prev + 1)
        }
      }
    }

    s.on('receiveMessage', handleReceive)
    return () => {
      s.off('receiveMessage', handleReceive)
    }
  }, [user])

  // ✅ NEW: Mark all chats as read (called when user visits /chats)
  const markChatsAsRead = () => {
    setUnreadMessagesCount(0)
    localStorage.setItem('lastSeenChatsAt', new Date().toISOString())
  }

  // Listen for auth expiry events from axios interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null)
      setUnreadMessagesCount(0)
    }
    window.addEventListener('auth:expired', handleAuthExpired)
    return () => window.removeEventListener('auth:expired', handleAuthExpired)
  }, [])

  // Login
  const login = async (credentials) => {
    const res = await loginUserApi(credentials)
    const { token, user: userData } = res.data
    localStorage.setItem('token', token)
    setUser(userData)
    connectSocket()
    return userData
  }

  // Register
  const register = async (data) => {
    const res = await registerUserApi(data)
    return res.data
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setUnreadMessagesCount(0)
    disconnectSocket()
  }

  // Update user data in context (e.g., after profile update)
  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isBuyer: user?.role === 'buyer',
    isSeller: user?.role === 'seller',
    isSellerApproved: user?.role === 'seller' && user?.isApproved === true,
    isSellerPending: user?.role === 'seller' && user?.isApproved === false,
    isAdmin: user?.role === 'admin',
    unreadMessagesCount, // ✅ Expose to components
    markChatsAsRead,     // ✅ Expose to components
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}