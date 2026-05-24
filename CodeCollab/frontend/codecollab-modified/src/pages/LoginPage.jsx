import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [typed, setTyped]     = useState('')

  const headline = 'Welcome back.'
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      setTyped(headline.slice(0, i + 1))
      i++
      if (i >= headline.length) clearInterval(t)
    }, 70)
    return () => clearInterval(t)
  }, [])

  const from = location.state?.from?.pathname || '/dashboard'
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>&lt;/&gt;</span>
          <span className={styles.logoText}>CodeCollab</span>
        </div>

        <h1 className={styles.headline}>
          {typed}<span className={styles.cursor}>|</span>
        </h1>
        <p className={styles.sub}>Sign in to your rooms and pick up where you left off.</p>

        {error && <div className={styles.error} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email address</label>
            <input
              id="email" name="email" type="email"
              className={styles.input}
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              autoComplete="email" required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password" name="password" type="password"
              className={styles.input}
              placeholder="Your password"
              value={form.password} onChange={handleChange}
              autoComplete="current-password" required
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <p className={styles.switchText}>
          No account yet?{' '}
          <Link to="/register" className={styles.link}>Create one free</Link>
        </p>

        <div className={styles.divider}>
          <span>Built for teams. Real-time. Everywhere.</span>
        </div>
      </div>
    </div>
  )
}
