import React, { useState } from 'react'
import styles from './BottomBar.module.css'

export default function BottomBar({
  onFind, onCommit, followTarget, onFollow, onSaveAs, onSave,
  autoSavedAt, users = []
}) {
  const [following, setFollowing] = useState(false)
  const [followUser, setFollowUser] = useState(followTarget || null)

  const handleFollow = () => {
    if (following) { setFollowing(false); setFollowUser(null); onFollow?.(null) }
    else if (users.length > 0) {
      const u = users[0]
      setFollowing(true); setFollowUser(u.name); onFollow?.(u)
    }
  }

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <button className={styles.btn} onClick={onFind}>
          <FindIcon /> Find
        </button>
        <button className={styles.btn} onClick={onCommit}>
          <CommitIcon /> Commit
        </button>
        <button
          className={`${styles.btn} ${following ? styles.followActive : styles.followBtn}`}
          onClick={handleFollow}
        >
          <FollowIcon />
          {following ? `Following ${followUser}` : `Follow ${users[0]?.name ?? '…'}`}
        </button>
      </div>

      <div className={styles.right}>
        <button className={styles.btn} onClick={onSaveAs}>Save As</button>
        <button className={`${styles.btn} ${styles.saveBtn}`} onClick={onSave}>
          <SaveIcon /> Save
        </button>
        {autoSavedAt && (
          <span className={styles.autoSave}>
            <span className={styles.autoSaveDot} />
            Auto-saved at {autoSavedAt}
          </span>
        )}
      </div>
    </div>
  )
}

const FindIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const CommitIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>
const FollowIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const SaveIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
