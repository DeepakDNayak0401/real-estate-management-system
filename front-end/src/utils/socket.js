import { io } from 'socket.io-client'

let socket = null

/**
 * Get the socket.io client instance (creates one if it doesn't exist)
 * @returns {import('socket.io-client').Socket}
 */
export const getSocket = () => {
    if (!socket) {
        socket = io({
            autoConnect: false,
        })
    }
    return socket
}

/**
 * Connect the socket to the server
 */
export const connectSocket = () => {
    const s = getSocket()
    if (!s.connected) {
        s.connect()
    }
    return s
}

/**
 * Disconnect the socket from the server
 */
export const disconnectSocket = () => {
    if (socket && socket.connected) {
        socket.disconnect()
    }
}