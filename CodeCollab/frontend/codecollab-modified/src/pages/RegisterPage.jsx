import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [typed, setTyped]     = useState('')

  // Typewriter effect for headline
  const headline = 'Start collaborating.'
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      setTyped(headline.slice(0, i + 1))
      i++
      if (i >= headline.length) clearInterval(t)
    }, 60)
    return () => clearInterval(t)
  }, [])

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>&lt;/&gt;</span>
          <span className={styles.logoText}>CodeCollab</span>
        </div>

        <h1 className={styles.headline}>
          {typed}<span className={styles.cursor}>|</span>
        </h1>
        <p className={styles.sub}>Create your account and join a room instantly.</p>

        {error && <div className={styles.error} role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Display name</label>
            <input
              id="name" name="name" type="text"
              className={styles.input}
              placeholder="e.g. Arjun"
              value={form.name} onChange={handleChange}
              autoComplete="name" required
            />
          </div>

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

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password" name="password" type="password"
                className={styles.input}
                placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange}
                autoComplete="new-password" required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="confirm" className={styles.label}>Confirm password</label>
              <input
                id="confirm" name="confirm" type="password"
                className={styles.input}
                placeholder="Repeat password"
                value={form.confirm} onChange={handleChange}
                autoComplete="new-password" required
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.btn}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : null}
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>Sign in</Link>
        </p>

        <div className={styles.divider}>
          <span>Built for teams. Real-time. Everywhere.</span>
        </div>
      </div>
    </div>
  )
}
