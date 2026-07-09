import api from './axios.js'

/**
 * Create a new chat or get existing one
 * POST /api/chat/
 */
export const createOrGetChat = (data) => {
    return api.post('/chat/', data)
}

/**
 * Send a message in a chat (persists to DB)
 * POST /api/chat/send
 */
export const sendMessage = (data) => {
    return api.post('/chat/send', data)
}

/**
 * Get all chats for the current user
 * GET /api/chat/
 */
export const getChats = () => {
    return api.get('/chat/')
}

/**
 * Get a specific chat with all messages
 * GET /api/chat/:chatId
 */
export const getChatMessages = (chatId) => {
    return api.get(`/chat/${chatId}`)
}

/**
 * Delete an entire chat
 * DELETE /api/chat/:chatId
 */
export const deleteChat = (chatId) => {
    return api.delete(`/chat/${chatId}`)
}

/**
 * Delete a specific message within a chat
 * DELETE /api/chat/:chatId/message/:messageId
 */
export const deleteMessage = (chatId, messageId) => {
    return api.delete(`/chat/${chatId}/message/${messageId}`)
}