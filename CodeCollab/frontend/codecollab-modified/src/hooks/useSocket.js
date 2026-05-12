import { useEffect, useRef } from 'react'
import { getSocket, EVENTS } from '../services/socket'

export function useSocket(roomId, username, handlers = {}) {
  const socketRef = useRef(null)
  const joinedRef = useRef(false)

  useEffect(() => {
    if (!roomId || !username) return
    if (joinedRef.current) return

    // connect to real socket server
    const socket = getSocket(username)
    socketRef.current = socket
    joinedRef.current = true

    // join the room
    socket.emit(EVENTS.JOIN_ROOM, { roomId, username })

    // register event handlers
    Object.entries(handlers).forEach(([event, fn]) => {
      socket.on(event, fn)
    })

    return () => {
      Object.entries(handlers).forEach(([event, fn]) => {
        socket.off(event, fn)
      })
      socket.emit(EVENTS.LEAVE_ROOM, { roomId })
      joinedRef.current = false
    }
  }, [roomId, username])

  const emit = (event, data) => socketRef.current?.emit(event, data)

  return { socket: socketRef.current, emit }
}