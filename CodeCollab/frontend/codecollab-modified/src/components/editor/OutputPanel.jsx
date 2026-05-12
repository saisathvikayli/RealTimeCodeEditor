import React, { useState, useRef, useEffect } from 'react'
import styles from './OutputPanel.module.css'

export default function OutputPanel({ output = '', problems = [], onClear, onCommand }) {
  const [tab, setTab] = useState('output')
  const [cmd, setCmd] = useState('')
  const outputRef = useRef(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleCmd = e => {
    e.preventDefault()
    if (!cmd.trim()) return
    onCommand?.(cmd.trim())
    setCmd('')
  }

  return (
    <div className={styles.panel}>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'output' ? styles.active : ''}`}
            onClick={() => setTab('output')}
          >Output</button>
          <button
            className={`${styles.tab} ${tab === 'problems' ? styles.active : ''}`}
            onClick={() => setTab('problems')}
          >
            Problems {problems.length > 0 && (
              <span className={styles.badge}>{problems.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${tab === 'terminal' ? styles.active : ''}`}
            onClick={() => setTab('terminal')}
          >Terminal</button>
        </div>
        <button className={styles.clearBtn} onClick={onClear}>✕ Clear</button>
      </div>

      {/* Content */}
      <div className={styles.content} ref={outputRef}>
        {tab === 'output' && (
          <pre className={styles.outputText}>
            {output || <span className={styles.empty}>{`> Run a command…`}</span>}
          </pre>
        )}

        {tab === 'problems' && (
          <div className={styles.problems}>
            {problems.length === 0
              ? <span className={styles.empty}>No problems detected.</span>
              : problems.map((p, i) => (
                  <div key={i} className={`${styles.problem} ${styles[p.severity]}`}>
                    <span className={styles.problemIcon}>{p.severity === 'error' ? '✗' : '⚠'}</span>
                    <span className={styles.problemMsg}>{p.message}</span>
                    <span className={styles.problemLoc}>Line {p.line}</span>
                  </div>
                ))
            }
          </div>
        )}

        {tab === 'terminal' && (
          <div className={styles.terminal}>
            <pre className={styles.outputText}>{output}</pre>
            <form className={styles.cmdRow} onSubmit={handleCmd}>
              <span className={styles.prompt}>$</span>
              <input
                className={styles.cmdInput}
                value={cmd}
                onChange={e => setCmd(e.target.value)}
                placeholder="Run a command…"
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
