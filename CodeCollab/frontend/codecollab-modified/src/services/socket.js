import { io } from 'socket.io-client'

const URL = 'http://localhost:5000'

let socket = null

export const getSocket = (username) => {
  if (!socket || !socket.connected) {
    socket = io(URL, {
      auth: { username },
      transports: ['websocket']
    })
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const EVENTS = {
  JOIN_ROOM:       'room:join',
  LEAVE_ROOM:      'room:leave',
  ROOM_USERS:      'room:users',
  CODE_CHANGE:     'code:change',
  CODE_SYNC:       'code:sync',
  CURSOR_MOVE:     'cursor:move',
  CURSOR_UPDATE:   'cursor:update',
  CHAT_SEND:       'chat:send',
  CHAT_MESSAGE:    'chat:message',
  CHAT_HISTORY:    'chat:history',
  ACTIVITY:        'activity:log',
  CODE_RUN:        'code:run',
  CODE_OUTPUT:     'code:output',
  LANGUAGE_CHANGE: 'language:change',
  LANGUAGE_SYNC:   'language:sync',
}