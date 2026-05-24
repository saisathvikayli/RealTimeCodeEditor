import React, { useState } from 'react'
import styles from './RoomInfo.module.css'

export default function RoomInfo({ room }) {
  const [copied, setCopied] = useState(null)

  if (!room) return null

  const copyToClipboard = (text, label) => {
    navigator.clipboard?.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }

  const copyShareInfo = () => {
    const shareText = `Join my CodeCollab room!\nRoom ID: ${room.roomId}\nPassword: ${room.roomPassword}\nLink: ${window.location.href}`
    copyToClipboard(shareText, 'share')
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Room Info</h3>

      <div className={styles.row}>
        <span className={styles.label}>Name</span>
        <span className={styles.value}>{room.name || 'Unnamed'}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>ID</span>
        <button
          className={styles.copyable}
          onClick={() => copyToClipboard(room.roomId, 'id')}
          title="Click to copy"
        >
          {copied === 'id' ? 'Copied!' : `#${room.roomId}`}
        </button>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Language</span>
        <span className={styles.value}>{room.language}</span>
      </div>

      <button className={styles.shareBtn} onClick={copyShareInfo}>
        {copied === 'share' ? 'Copied!' : 'Copy Invite Info'}
      </button>
    </section>
  )
}