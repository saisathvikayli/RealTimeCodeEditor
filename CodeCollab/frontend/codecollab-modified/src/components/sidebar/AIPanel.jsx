import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import styles from './AIPanel.module.css'

export default function AIPanel({ code, language }) {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef(null)

  // auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    // add user message to chat
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('https://realtimecodeeditor-965r.onrender.com/api/ai/ask', {
        question,
        code,
        language
      })
      setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, I could not respond. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>AI Assistant</h3>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <p className={styles.hint}>
            Ask me about your code — debugging, explanations, or improvements.
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`${styles.message} ${m.role === 'user' ? styles.user : styles.ai}`}
          >
            <span className={styles.label}>{m.role === 'user' ? 'You' : 'AI'}</span>
            <div className={styles.text}>{m.text}</div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.ai}`}>
            <span className={styles.label}>AI</span>
            <div className={styles.text}>Thinking...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="Ask AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={loading || !input.trim()}
        >
          {loading ? '...' : '↑'}
        </button>
      </form>
    </div>
  )
}