import React, { useState, useEffect, useRef } from 'react'
import styles from './ChatPanel.module.css'

function getInitials(name = '') {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

export default function ChatPanel({ messages = [], onSend, currentUser }) {
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = e => {
    e.preventDefault()
    const msg = text.trim()
    if (!msg) return
    onSend?.(msg)
    setText('')
  }

  return (
    <div className={styles.panel}>
      <div className={styles.messages}>
        {messages.map((m, i) => {
          const isMe = m.userName === currentUser?.name
          return (
            <div key={i} className={`${styles.message} ${isMe ? styles.me : ''}`}>
              {!isMe && (
                <div
                  className={styles.avatar}
                  style={{ '--user-color': m.color || 'var(--accent-blue)' }}
                >
                  {getInitials(m.userName)}
                </div>
              )}
              <div className={styles.bubble}>
                {!isMe && (
                  <span className={styles.sender} style={{ color: m.color || 'var(--accent-blue)' }}>
                    {m.userName}
                  </span>
                )}
                <div className={styles.text}>{m.text}</div>
                <span className={styles.time}>{formatTime(m.timestamp)}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form className={styles.inputRow} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          placeholder="Message…"
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={500}
        />
        <button type="submit" className={styles.sendBtn} disabled={!text.trim()}>
          <SendIcon />
        </button>
      </form>
    </div>
  )
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
