import React, { useRef, useEffect } from 'react'
import styles from './OutputPanel.module.css'

export default function OutputPanel({ output = '', onClear }) {
  const outputRef = useRef(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  return (
    <div className={styles.panel}>
      {/* header */}
      <div className={styles.tabBar}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>Output</button>
        </div>
        <button className={styles.clearBtn} onClick={onClear}>✕ Clear</button>
      </div>

      {/* content */}
      <div className={styles.content} ref={outputRef}>
        <pre className={styles.outputText}>
          {output || <span className={styles.empty}>{`> Run your code to see output here...`}</span>}
        </pre>
      </div>
    </div>
  )
}