import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../hooks/useSocket'
import { EVENTS } from '../services/socket'
import axios from 'axios'

import Topbar       from '../components/layout/Topbar'
import Sidebar      from '../components/sidebar/Sidebar'
import OutputPanel  from '../components/editor/OutputPanel'
import BottomBar    from '../components/editor/BottomBar'
import RightPanel   from '../components/layout/RightPanel'
import Whiteboard   from '../components/whiteboard/Whiteboard'

import styles from './RoomPage.module.css'

import { Editor as MonacoEditor } from '@monaco-editor/react'

const DEFAULT_CODE = {
  python:     '# Welcome to CodeCollab!\ndef greet(name):\n    print(f"Hello, {name}!")\n\ndef add(a, b):\n    return a + b\n\ngreet("CodeCollab")\nresult = add(10, 20)\nprint(f"Result: {result}")\n',
  javascript: '// Welcome to CodeCollab!\nfunction greet(name) {\n  console.log(`Hello, ${name}!`);\n}\n\nfunction add(a, b) {\n  return a + b;\n}\n\ngreet("CodeCollab");\nconst result = add(10, 20);\nconsole.log("Result:", result);\n',
  typescript: '// Welcome to CodeCollab!\nfunction greet(name: string): void {\n  console.log(`Hello, ${name}!`);\n}\n\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\ngreet("CodeCollab");\nconst result = add(10, 20);\nconsole.log("Result:", result);\n',
  cpp:        '#include <iostream>\nusing namespace std;\n\nvoid greet(string name) {\n    cout << "Hello, " << name << "!" << endl;\n}\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    greet("CodeCollab");\n    cout << "Result: " << add(10, 20) << endl;\n    return 0;\n}\n',
  java:       'public class Main {\n    static void greet(String name) {\n        System.out.println("Hello, " + name + "!");\n    }\n\n    static int add(int a, int b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        greet("CodeCollab");\n        System.out.println("Result: " + add(10, 20));\n    }\n}\n',
  go:         'package main\n\nimport "fmt"\n\nfunc greet(name string) {\n    fmt.Printf("Hello, %s!\\n", name)\n}\n\nfunc add(a, b int) int {\n    return a + b\n}\n\nfunc main() {\n    greet("CodeCollab")\n    fmt.Printf("Result: %d\\n", add(10, 20))\n}\n',
  rust:       'fn greet(name: &str) {\n    println!("Hello, {}!", name);\n}\n\nfn add(a: i32, b: i32) -> i32 {\n    a + b\n}\n\nfn main() {\n    greet("CodeCollab");\n    let result = add(10, 20);\n    println!("Result: {}", result);\n}\n',
}

const LANG_MAP = {
  python: 'python', javascript: 'javascript', typescript: 'typescript',
  cpp: 'cpp', java: 'java', go: 'go', rust: 'rust'
}

const USER_COLORS = ['#68d391', '#f6ad55', '#63b3ed', '#fc8181', '#b794f4', '#f687b3', '#4fd1c5']
const colorForUser = (name) => {
  if (!name) return USER_COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length]
}

export default function RoomPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { user }   = useAuth()

  const [room, setRoom]                 = useState(null)
  const [language, setLang]             = useState('python')
  const [code, setCode]                 = useState(DEFAULT_CODE.python)
  const [output, setOutput]             = useState('')
  const [running, setRunning]           = useState(false)
  const [messages, setMessages]         = useState([])
  const [onlineUsers, setOnlineUsers]   = useState([])
  const [activity, setActivity]         = useState(['Room created'])
  const [autoSaved, setAutoSaved]       = useState(null)

  const editorRef         = useRef(null)
  const monacoRef         = useRef(null)
  const autoSaveTimer     = useRef(null)
  const cursorDecorations = useRef({})
  const cursorPositions   = useRef({})

  // load room from backend
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`https://realtimecodeeditor-965r.onrender.com/api/rooms/${id}`)
        const r = res.data.room
        setRoom(r)
        setLang(r.language || 'python')
        setCode(r.code || DEFAULT_CODE[r.language] || DEFAULT_CODE.python)
      } catch (err) {
        navigate('/dashboard')
      }
    }
    fetchRoom()
  }, [id])

  // redraw all cursors after code updates
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return
    Object.entries(cursorPositions.current).forEach(([username, pos]) => {
      drawRemoteCursor(username, pos.line, pos.column)
    })
  }, [code])

  // draw a remote user's cursor
  const drawRemoteCursor = (username, line, column) => {
    if (!editorRef.current || !monacoRef.current) return
    const monaco = monacoRef.current
    const color = colorForUser(username)

    cursorPositions.current[username] = { line, column }

    const newDecorations = [
      {
        range: new monaco.Range(line, column, line, column + 1),
        options: {
          className: 'remote-cursor-' + username.replace(/\s/g, ''),
          hoverMessage: { value: username },
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        }
      }
    ]

    const styleId = 'cursor-style-' + username.replace(/\s/g, '')
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.innerHTML = `
        .remote-cursor-${username.replace(/\s/g, '')}::before {
          content: '';
          display: inline-block;
          width: 2px;
          height: 18px;
          background: ${color};
          position: absolute;
          margin-left: -1px;
        }
        .remote-cursor-${username.replace(/\s/g, '')}::after {
          content: '${username}';
          position: absolute;
          background: ${color};
          color: #000;
          font-size: 10px;
          font-family: 'Inter', sans-serif;
          padding: 1px 6px;
          border-radius: 3px;
          margin-top: -16px;
          margin-left: -1px;
          white-space: nowrap;
          z-index: 10;
        }
      `
      document.head.appendChild(style)
    }

    const oldIds = cursorDecorations.current[username] || []
    const newIds = editorRef.current.deltaDecorations(oldIds, newDecorations)
    cursorDecorations.current[username] = newIds
  }

  // socket events
  const { emit } = useSocket(id, user?.name || 'User', {
    [EVENTS.ROOM_USERS]:   (users) => setOnlineUsers(users),
    [EVENTS.CODE_SYNC]:    ({ code }) => setCode(code),
    [EVENTS.CHAT_MESSAGE]: (msg) => setMessages(ms => [...ms, {
      userId: msg.sender,
      userName: msg.sender,
      text: msg.text,
      timestamp: msg.ts || Date.now()
    }]),
    [EVENTS.CHAT_HISTORY]: (msgs) => setMessages(msgs.map(m => ({
      userId: m.sender,
      userName: m.sender,
      text: m.text,
      timestamp: m.createdAt || Date.now()
    }))),
    [EVENTS.ACTIVITY]:     (msg) => setActivity(a => [msg, ...a].slice(0, 10)),
    [EVENTS.CODE_OUTPUT]:  ({ output, status }) => {
      setOutput(`Status: ${status}\n\n${output || 'No output'}`)
      setRunning(false)
    },
    [EVENTS.CURSOR_UPDATE]: ({ username, line, column }) => {
      if (username === user?.name) return
      drawRemoteCursor(username, line, column)
    },
    [EVENTS.LANGUAGE_SYNC]: ({ language, code }) => {
      setLang(language)
      setCode(code)
      setActivity(a => [`language changed to ${language}`, ...a].slice(0, 10))
    }
  })

  const handleCodeChange = useCallback(val => {
    setCode(val)
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      emit(EVENTS.CODE_CHANGE, { roomId: id, code: val })
      const now = new Date()
      setAutoSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`)
    }, 1500)
  }, [id, emit])

  const handleRun = () => {
    setRunning(true)
    setOutput(`Running ${language} code...\n`)
    emit(EVENTS.CODE_RUN, { roomId: id, code, language, input: '' })
    setActivity(a => [`${user?.name || 'You'} ran the code`, ...a].slice(0, 10))
  }

  const handleCopy = () => navigator.clipboard?.writeText(code)

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    setActivity(a => ['Room link copied to clipboard', ...a].slice(0, 10))
  }

  const handleSendMessage = useCallback(text => {
    emit(EVENTS.CHAT_SEND, { roomId: id, text, sender: user?.name || 'You' })
  }, [user, id, emit])

  const handleLanguageChange = (lang) => {
    setLang(lang)
    emit(EVENTS.LANGUAGE_CHANGE, { roomId: id, language: lang, code })
    setActivity(a => [`${user?.name || 'You'} switched to ${lang}`, ...a].slice(0, 10))
  }

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    let throttle = null
    editor.onDidChangeCursorPosition((e) => {
      clearTimeout(throttle)
      throttle = setTimeout(() => {
        emit(EVENTS.CURSOR_MOVE, {
          roomId: id,
          line: e.position.lineNumber,
          column: e.position.column,
          username: user?.name || 'User'
        })
      }, 100)
    })
  }

  // dedupe online users by username
  const uniqueOnline = []
  const seen = new Set([user?.name])
  for (const u of onlineUsers) {
    if (!seen.has(u.username)) {
      seen.add(u.username)
      uniqueOnline.push({
        id: u.socketId,
        name: u.username,
        isYou: false,
        status: 'in room'
      })
    }
  }

  const currentUserPresence = {
    id: user?.id, name: user?.name || 'You', isYou: true, status: `coding in ${language}`
  }
  const allUsers = [currentUserPresence, ...uniqueOnline]

  if (!room) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingIcon}>&lt;/&gt;</span>
        <p>Loading room...</p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Topbar
        roomCode={room.roomCode || room.roomId}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        running={running}
        onCopy={handleCopy}
        onShare={handleShare}
      />

      <div className={styles.body}>
        <Sidebar
          users={allUsers}
          activity={activity}
          room={room}
          code={code}
          language={language}
        />

        <div className={styles.editorArea}>
          <div className={styles.editorWrapper}>
            <MonacoEditor
              height="100%"
              language={LANG_MAP[language] || 'python'}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              onMount={handleEditorMount}
              options={{
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12 },
                lineHeight: 22,
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                renderLineHighlight: 'gutter',
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true },
                automaticLayout: true,
              }}
            />
          </div>

          <BottomBar
  autoSavedAt={autoSaved}
  code={code}
/>

          <div className={styles.outputArea}>
            <OutputPanel
              output={output}
              onClear={() => setOutput('')}
            />
          </div>
        </div>

        <div className={styles.rightWrapper}>
          <Whiteboard roomId={id} username={user?.name || 'User'} />

          <RightPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUser={{ id: user?.id, name: user?.name }}
            code={code}
            language={language}
          />
        </div>
      </div>
    </div>
  )
}