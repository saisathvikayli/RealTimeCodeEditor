// ── In-memory mock room store ─────────────────────────────────────────────────
// Simulates a backend database — rooms persist within a browser session

const makeId = () => Math.random().toString(36).slice(2, 10)
const makeRoomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()

const INITIAL_ROOMS = [
  {
    _id: 'room-1',
    name: 'Interview Prep',
    language: 'python',
    roomCode: 'ALPHA1',
    roomPassword: 'alpha123',
    members: [{ id: '1' }, { id: '2' }],
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    code: `# Two Sum — Classic interview problem\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\n# Test\nprint(two_sum([2, 7, 11, 15], 9))  # [0, 1]\nprint(two_sum([3, 2, 4], 6))        # [1, 2]\n`
  },
  {
    _id: 'room-2',
    name: 'React Hooks Demo',
    language: 'javascript',
    roomCode: 'BETA22',
    roomPassword: 'beta456',
    members: [{ id: '1' }],
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    code: `// Custom hook: useLocalStorage\nimport { useState, useEffect } from 'react'\n\nfunction useLocalStorage(key, initialValue) {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key)\n      return item ? JSON.parse(item) : initialValue\n    } catch (error) {\n      return initialValue\n    }\n  })\n\n  const setValue = value => {\n    setStoredValue(value)\n    window.localStorage.setItem(key, JSON.stringify(value))\n  }\n\n  return [storedValue, setValue]\n}\n\nexport default useLocalStorage\n`
  },
  {
    _id: 'room-3',
    name: 'Data Structures',
    language: 'cpp',
    roomCode: 'GAMMA3',
    roomPassword: 'gamma789',
    members: [{ id: '1' }, { id: '3' }, { id: '4' }],
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    code: `#include <iostream>\n#include <stack>\nusing namespace std;\n\n// Valid parentheses checker\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') {\n            st.push(c);\n        } else {\n            if (st.empty()) return false;\n            char top = st.top(); st.pop();\n            if ((c == ')' && top != '(') ||\n                (c == ']' && top != '[') ||\n                (c == '}' && top != '{')) return false;\n        }\n    }\n    return st.empty();\n}\n\nint main() {\n    cout << isValid("()[]{}") << endl;  // 1\n    cout << isValid("([)]") << endl;    // 0\n    return 0;\n}\n`
  }
]

let rooms = [...INITIAL_ROOMS]

export const roomsDb = {
  list: () => [...rooms],
  get: (id) => rooms.find(r => r._id === id) || null,

  // Find a room by its roomCode (for joining)
  findByCode: (roomCode) => rooms.find(r => r.roomCode === roomCode.toUpperCase()) || null,

  // Verify roomCode + roomPassword combo
  verifyPassword: (roomCode, password) => {
    const room = rooms.find(r => r.roomCode === roomCode.toUpperCase())
    if (!room) return { ok: false, error: 'Room not found. Check the Room ID.' }
    if (room.roomPassword !== password) return { ok: false, error: 'Incorrect Room Password.' }
    return { ok: true, room }
  },

  create: (name, language, userId, roomPassword) => {
    const room = {
      _id: makeId(),
      name,
      language,
      roomCode: makeRoomCode(),
      roomPassword: roomPassword || '',
      members: [{ id: userId }],
      updatedAt: new Date().toISOString(),
      code: `# ${name}\n# Language: ${language}\n\n`
    }
    rooms.unshift(room)
    return room
  },

  update: (id, patch) => {
    const idx = rooms.findIndex(r => r._id === id)
    if (idx === -1) return null
    rooms[idx] = { ...rooms[idx], ...patch, updatedAt: new Date().toISOString() }
    return rooms[idx]
  },

  delete: (id) => {
    rooms = rooms.filter(r => r._id !== id)
  }
}
