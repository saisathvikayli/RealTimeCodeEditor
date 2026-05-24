import React from 'react'
import styles from './EditorTabBar.module.css'

export default function EditorTabBar({ tabs = [], activeTab, onTabSelect, onTabClose, onDiffView, onFoldAll, onFormat }) {
  return (
    <div className={styles.bar}>
      {/* File tabs */}
      <div className={styles.tabs}>
        {tabs.map(t => (
          <div
            key={t.name}
            className={`${styles.tab} ${activeTab === t.name ? styles.active : ''}`}
          >
            <button className={styles.tabName} onClick={() => onTabSelect?.(t.name)}>
              {t.name}
              {t.modified && <span className={styles.dot} />}
            </button>
            <button
              className={styles.closeBtn}
              onClick={e => { e.stopPropagation(); onTabClose?.(t.name) }}
              title="Close"
            >×</button>
          </div>
        ))}
        <button className={styles.addTab} title="New file">+</button>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={onDiffView} title="Diff view">
          <DiffIcon /> Diff View
        </button>
        <button className={styles.actionBtn} onClick={onFoldAll} title="Fold all">
          <FoldIcon /> Fold All
        </button>
        <button className={styles.actionBtn} onClick={onFormat} title="Format code">
          <FormatIcon /> Format
        </button>
      </div>
    </div>
  )
}

const DiffIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M15 3h4a2 2 0 0 1 2 2v4"/><path d="M9 21H5a2 2 0 0 1-2-2v-4"/><path d="M15 21h4a2 2 0 0 0 2-2v-4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
const FoldIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
const FormatIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
