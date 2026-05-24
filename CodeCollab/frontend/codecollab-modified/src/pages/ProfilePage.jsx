import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import styles from './Profile.module.css'

const API = 'https://realtimecodeeditor-965r.onrender.com/api'

function getInitials(name = '') {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const LANG_COLORS = {
  python:     '#3776ab',
  javascript: '#f7df1e',
  typescript: '#3178c6',
  cpp:        '#00599c',
  java:       '#ed8b00',
  go:         '#00add8',
  rust:       '#dea584',
  unknown:    '#888'
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [pwd, setPwd] = useState('')
  const [pwdError, setPwdError] = useState('')

  // edit form state
  const [editForm, setEditForm] = useState({
    email: '',
    newPassword: '',
    currentPassword: ''
  })
  const [editError, setEditError] = useState('')
  const [editSuccess, setEditSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchProfile = async () => {
    if (!user?.name) return
    try {
      const res = await axios.get(`${API}/users/profile/${encodeURIComponent(user.name)}`)
      setProfile(res.data.profile)
    } catch (err) {
      console.error('Failed to load profile:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user])

  const handleEnterRoom = (e, room) => {
    e.preventDefault()
    setPwdError('')
    if (!pwd.trim()) { setPwdError('Password is required.'); return }
    if (pwd.trim() !== room.roomPassword) {
      setPwdError('Incorrect room password.')
      return
    }
    setModal(null)
    setPwd('')
    navigate(`/room/${room.roomId}`)
  }

  const openEditModal = () => {
    setEditForm({
      email: profile.email,
      newPassword: '',
      currentPassword: ''
    })
    setEditError('')
    setEditSuccess('')
    setModal({ type: 'edit' })
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setEditError('')
    setEditSuccess('')

    if (!editForm.currentPassword.trim()) {
      setEditError('Please enter your current password.')
      return
    }

    setSaving(true)
    try {
      const res = await axios.put(`${API}/users/profile/${encodeURIComponent(user.name)}`, {
        email: editForm.email.trim(),
        newPassword: editForm.newPassword.trim() || undefined,
        currentPassword: editForm.currentPassword
      })
      setEditSuccess('Profile updated successfully!')
      // refresh profile data
      await fetchProfile()
      // close modal after short delay
      setTimeout(() => setModal(null), 1500)
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingIcon}>&lt;/&gt;</span>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.loading}>
        <p>Could not load profile.</p>
      </div>
    )
  }

  const { stats, recentRooms, memberSince } = profile
  const languages = Object.entries(stats.languageCounts || {})
    .sort((a, b) => b[1] - a[1])

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back to Rooms
        </button>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>&lt;/&gt;</span>
          <span className={styles.brandName}>CodeCollab</span>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>Sign out</button>
      </header>

      <main className={styles.main}>
        {/* profile header card */}
        <div className={styles.profileCard}>
          <div className={styles.avatar}>{getInitials(profile.username)}</div>
          <div className={styles.profileInfo}>
            <h1 className={styles.username}>{profile.username}</h1>
            <p className={styles.email}>{profile.email}</p>
            <p className={styles.memberSince}>Member since {formatDate(memberSince)}</p>
          </div>
          <button className={styles.editBtn} onClick={openEditModal}>
            Edit Profile
          </button>
        </div>

        {/* stats grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.createdCount}</div>
            <div className={styles.statLabel}>Rooms Created</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.joinedCount}</div>
            <div className={styles.statLabel}>Rooms Joined</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.messageCount}</div>
            <div className={styles.statLabel}>Messages Sent</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{languages.length}</div>
            <div className={styles.statLabel}>Languages Used</div>
          </div>
        </div>

        {/* languages section */}
        {languages.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Languages Used</h2>
            <div className={styles.langTags}>
              {languages.map(([lang, count]) => {
                const color = LANG_COLORS[lang] || LANG_COLORS.unknown
                return (
                  <div
                    key={lang}
                    className={styles.langTag}
                    style={{ background: color + '22', border: `1px solid ${color}55`, color }}
                    title={`${lang}: used in ${count} room${count !== 1 ? 's' : ''}`}
                  >
                    <span className={styles.langName}>{lang}</span>
                    <span className={styles.langCount}>{count}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* recent rooms */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Rooms</h2>
          {recentRooms.length === 0 ? (
            <p className={styles.empty}>No rooms yet. Head back to the dashboard to create one!</p>
          ) : (
            <div className={styles.roomsGrid}>
              {recentRooms.map(room => (
                <button
                  key={room.roomId}
                  className={styles.roomCard}
                  onClick={() => setModal({ type: 'enter', room })}
                >
                  <div className={styles.roomHeader}>
                    <span className={styles.langBadge}>{room.language}</span>
                    <span className={styles.roomCode}>#{room.roomId}</span>
                  </div>
                  <h3 className={styles.roomName}>{room.name || 'Unnamed Room'}</h3>
                  <div className={styles.roomMeta}>
                    <span className={styles.memberCount}>{room.users?.length ?? 0} online</span>
                    <span className={styles.roomDate}>
                      {new Date(room.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* enter room password modal */}
      {modal?.type === 'enter' && (
        <div className={styles.overlay} onClick={() => { setModal(null); setPwd(''); setPwdError('') }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{modal.room.name || 'Enter Room'}</h2>
            <p className={styles.modalSub}>Enter the room password to continue.</p>

            {pwdError && <div className={styles.modalError}>{pwdError}</div>}

            <form onSubmit={e => handleEnterRoom(e, modal.room)} className={styles.modalForm}>
              <div className={styles.roomInfoRow}>
                <span className={styles.langBadge}>{modal.room.language}</span>
                <span className={styles.roomCode}>#{modal.room.roomId}</span>
              </div>

              <label className={styles.modalLabel}>Room Password</label>
              <input
                className={styles.modalInput}
                type="password"
                placeholder="Enter the room password"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                autoFocus required
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => { setModal(null); setPwd(''); setPwdError('') }}
                >Cancel</button>
                <button type="submit" className={styles.enterBtn}>Enter Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* edit profile modal */}
      {modal?.type === 'edit' && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Edit Profile</h2>
            <p className={styles.modalSub}>Update your email or password. Username cannot be changed.</p>

            {editError && <div className={styles.modalError}>{editError}</div>}
            {editSuccess && <div className={styles.modalSuccess}>{editSuccess}</div>}

            <form onSubmit={handleEdit} className={styles.modalForm}>
              <label className={styles.modalLabel}>Username</label>
              <input
                className={`${styles.modalInput} ${styles.disabledInput}`}
                value={profile.username}
                disabled
              />

              <label className={styles.modalLabel}>Email</label>
              <input
                className={styles.modalInput}
                type="email"
                value={editForm.email}
                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
              />

              <label className={styles.modalLabel}>New Password (optional)</label>
              <input
                className={styles.modalInput}
                type="password"
                value={editForm.newPassword}
                onChange={e => setEditForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="Leave blank to keep current"
              />

              <label className={styles.modalLabel}>Current Password (required)</label>
              <input
                className={styles.modalInput}
                type="password"
                value={editForm.currentPassword}
                onChange={e => setEditForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="Enter your current password"
                required
              />

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.enterBtn} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}