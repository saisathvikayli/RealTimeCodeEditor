import React, { useState } from 'react'
import ChatPanel from '../chat/ChatPanel'
import styles from './RightPanel.module.css'

export default function RightPanel({ messages, onSendMessage, currentUser, history = [] }) {
  const [tab, setTab] = useState('chat')

  return (
    <div className={styles.panel}>
      {/* Mini code preview strip */}
      <div className={styles.minimap} aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={styles.minimapLine} style={{ width: `${30 + Math.random() * 60}%`, opacity: 0.3 + Math.random() * 0.4 }} />
        ))}
      </div>

      {/* Tab switcher */}
      <div className={styles.tabs}>
        {['Chat','History','Settings'].map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t.toLowerCase() ? styles.active : ''}`}
            onClick={() => setTab(t.toLowerCase())}
          >
            {t === 'Chat'     && <ChatIcon />}
            {t === 'History'  && <HistoryIcon />}
            {t === 'Settings' && <SettingsIcon />}
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={styles.content}>
        {tab === 'chat' && (
          <ChatPanel
            messages={messages}
            onSend={onSendMessage}
            currentUser={currentUser}
          />
        )}
        {tab === 'history' && (
          <div className={styles.history}>
            {history.length === 0
              ? <p className={styles.empty}>No history yet.</p>
              : history.map((h, i) => (
                  <div key={i} className={styles.historyItem}>
                    <span className={styles.historyTime}>{h.time}</span>
                    <span className={styles.historyDesc}>{h.description}</span>
                  </div>
                ))
            }
          </div>
        )}
        {tab === 'settings' && (
          <div className={styles.settings}>
            <p className={styles.settingsNote}>Room settings coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ChatIcon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const HistoryIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const SettingsIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
