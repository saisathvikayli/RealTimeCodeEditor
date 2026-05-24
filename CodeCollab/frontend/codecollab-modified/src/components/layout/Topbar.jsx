import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Topbar.module.css'

const LANGUAGES = ['python','javascript','typescript','cpp','java','go','rust','html','css']

export default function Topbar({
  roomCode, language, onLanguageChange,
  onRun, running, onCopy, onShare
}) {
  const navigate = useNavigate()

  return (
    <header className={styles.topbar}>
      {/* Left: logo + room badge */}
      <div className={styles.left}>
        <button className={styles.logo} onClick={() => navigate('/dashboard')}>
          <span className={styles.logoIcon}>&lt;/&gt;</span>
          <span className={styles.logoText}>CodeCollab</span>
        </button>
        <div className={styles.roomBadge}>
          <span className={styles.roomCode}>ROOM #{roomCode}</span>
          <span className={styles.liveDot} />
          <span className={styles.liveLabel}>Live</span>
        </div>
      </div>

      {/* Right: controls */}
      <div className={styles.right}>
        <select
          className={styles.langSelect}
          value={language}
          onChange={e => onLanguageChange?.(e.target.value)}
        >
          {LANGUAGES.map(l => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>

        <button className={styles.iconBtn} onClick={onCopy} title="Copy code">
          <CopyIcon />
          <span>Copy</span>
        </button>

        <button className={styles.shareBtn} onClick={onShare} title="Share room">
          <ShareIcon />
          <span>Share</span>
        </button>

        <button
          className={`${styles.runBtn} ${running ? styles.running : ''}`}
          onClick={onRun}
          disabled={running}
          title="Run code"
        >
          {running ? <StopIcon /> : <RunIcon />}
          <span>{running ? 'Running…' : 'Run'}</span>
        </button>

        <button className={styles.leaveBtn} onClick={() => navigate('/dashboard')}>
          Leave
        </button>
      </div>
    </header>
  )
}

const CopyIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
const ShareIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
const RunIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const StopIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
