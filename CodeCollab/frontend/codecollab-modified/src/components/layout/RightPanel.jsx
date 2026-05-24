import React, { useState } from 'react'
import ChatPanel from '../chat/ChatPanel'
import AIPanel from '../sidebar/AIPanel'
import styles from './RightPanel.module.css'

export default function RightPanel({ messages, onSendMessage, currentUser, code, language }) {
  const [tab, setTab] = useState('chat')

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'chat' ? styles.active : ''}`}
          onClick={() => setTab('chat')}
        >
          <ChatIcon />
          <span>Chat</span>
        </button>
        <button
          className={`${styles.tab} ${tab === 'ai' ? styles.active : ''}`}
          onClick={() => setTab('ai')}
        >
          <AIIcon />
          <span>AI</span>
        </button>
      </div>

      <div className={styles.content}>
        {tab === 'chat' && (
          <ChatPanel
            messages={messages}
            onSend={onSendMessage}
            currentUser={currentUser}
          />
        )}
        {tab === 'ai' && (
          <AIPanel code={code} language={language} />
        )}
      </div>
    </div>
  )
}

const ChatIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

const AIIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
)