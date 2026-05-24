import React from 'react'
import styles from './BottomBar.module.css'

export default function BottomBar({ autoSavedAt, code = '' }) {
  const lines = code.split('\n').length
  const characters = code.length
  const codeLines = code.split('\n').filter(l => l.trim().length > 0).length

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{lines}</span>
          <span className={styles.statLabel}>lines</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{codeLines}</span>
          <span className={styles.statLabel}>code lines</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{characters}</span>
          <span className={styles.statLabel}>chars</span>
        </div>
      </div>

      <div className={styles.right}>
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