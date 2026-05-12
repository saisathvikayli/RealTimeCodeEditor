import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import styles from './Dashboard.module.css'

const API = 'http://localhost:5000/api'
const LANGS = ['python', 'javascript', 'typescript', 'cpp', 'java', 'go', 'rust']

function getInitials(name = '') {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

const EyeIcon = ({ open }) => open
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [rooms, setRooms]                 = useState([])
  const [loading, setLoading]             = useState(true)
  const [modal, setModal]                 = useState(null)

  const [newRoom, setNewRoom]             = useState({ name: '', language: 'python', roomPassword: '' })
  const [showCreatePwd, setShowCreatePwd] = useState(false)
  const [creating, setCreating]           = useState(false)
  const [createError, setCreateError]     = useState('')

  const [joinForm, setJoinForm]           = useState({ roomCode: '', roomPassword: '' })
  const [showJoinPwd, setShowJoinPwd]     = useState(false)
  const [joining, setJoining]             = useState(false)
  const [joinError, setJoinError]         = useState('')

  // fetch all rooms from backend
  const loadRooms = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/rooms`)
      setRooms(res.data.rooms || [])
    } catch (err) {
      console.error('failed to load rooms:', err.message)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRooms() }, [])

  const closeModal = () => {
    setModal(null)
    setNewRoom({ name: '', language: 'python', roomPassword: '' })
    setCreateError('')
    setJoinForm({ roomCode: '', roomPassword: '' })
    setJoinError('')
    setShowCreatePwd(false)
    setShowJoinPwd(false)
  }

  // create a new room
  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    if (!newRoom.name.trim()) { setCreateError('Room name is required.'); return }
    if (!newRoom.roomPassword.trim()) { setCreateError('Room password is required.'); return }
    if (newRoom.roomPassword.length < 4) { setCreateError('Password must be at least 4 characters.'); return }

    setCreating(true)
    try {
      const res = await axios.post(`${API}/rooms/create`, {
        username: user?.name,
        name: newRoom.name.trim(),
        language: newRoom.language,
        roomPassword: newRoom.roomPassword.trim()
      })
      closeModal()
      navigate(`/room/${res.data.room.roomId}`)
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create room.')
    } finally {
      setCreating(false)
    }
  }

  // join a room using room id and password
  const handleJoin = async (e) => {
    e.preventDefault()
    setJoinError('')
    if (!joinForm.roomCode.trim()) { setJoinError('Room ID is required.'); return }
    if (!joinForm.roomPassword.trim()) { setJoinError('Room password is required.'); return }

    setJoining(true)
    try {
      const res = await axios.get(`${API}/rooms/${joinForm.roomCode.trim()}`)
      const room = res.data.room
      if (room.roomPassword !== joinForm.roomPassword.trim()) {
        setJoinError('Incorrect room password.')
        setJoining(false)
        return
      }
      closeModal()
      navigate(`/room/${room.roomId}`)
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Room not found.')
    } finally {
      setJoining(false)
    }
  }

  // enter an existing room from the dashboard card
  const handleEnterRoom = async (e, room) => {
    e.preventDefault()
    setJoinError('')
    if (!joinForm.roomPassword.trim()) { setJoinError('Password is required.'); return }
    if (joinForm.roomPassword.trim() !== room.roomPassword) {
      setJoinError('Incorrect room password.')
      return
    }
    closeModal()
    navigate(`/room/${room.roomId}`)
  }

  // delete a room
  const handleDelete = async (e, roomId) => {
    e.stopPropagation()
    try {
      await axios.delete(`${API}/rooms/${roomId}`)
      setRooms(prev => prev.filter(r => r.roomId !== roomId))
    } catch (err) {
      console.error('failed to delete room:', err.message)
    }
  }

  return (
    <div className={styles.page}>

      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>&lt;/&gt;</span>
          <span className={styles.brandName}>CodeCollab</span>
        </div>
        <div className={styles.userArea}>
          <span className={styles.greeting}>Hey, {user?.name?.split(' ')[0]}</span>
          <div className={styles.avatar} title={user?.name}>{getInitials(user?.name || 'U')}</div>
          <button className={styles.logoutBtn} onClick={logout}>Sign out</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.heroRow}>
          <div>
            <h1 className={styles.title}>Your Rooms</h1>
            <p className={styles.subtitle}>Create a private room or join one using a room ID and password.</p>
          </div>
          <div className={styles.btnGroup}>
            <button className={styles.joinBtn} onClick={() => setModal('join')}>Join Room</button>
            <button className={styles.newBtn} onClick={() => setModal('create')}>+ New Room</button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : rooms.length === 0 ? (
          <div className={styles.empty}>
            <p>No rooms yet. Create one to get started.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {rooms.map(room => (
              <button
                key={room.roomId}
                className={styles.roomCard}
                style={{ position: 'relative' }}
                onClick={() => setModal({ type: 'enter', room })}
              >
                <div className={styles.roomHeader}>
                  <span className={styles.langBadge}>{room.language}</span>
                  <span className={styles.roomCode}>#{room.roomId}</span>
                </div>
                <h3 className={styles.roomName}>{room.name || 'Unnamed Room'}</h3>
                <div className={styles.roomMeta}>
                  <span className={styles.memberCount}>{room.users?.length ?? 0} online</span>
                  <span className={styles.roomDate}>{new Date(room.updatedAt).toLocaleDateString()}</span>
                </div>
                <button
                  style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 16, cursor: 'pointer', padding: '2px 6px', borderRadius: 4, lineHeight: 1 }}
                  onClick={e => handleDelete(e, room.roomId)}
                  title="Delete room"
                >x</button>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* create room modal */}
      {modal === 'create' && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Create a new room</h2>
                <p className={styles.modalSub}>Set a room password so only your team can join.</p>
              </div>
            </div>

            {createError && <div className={styles.modalError}>{createError}</div>}

            <form onSubmit={handleCreate} className={styles.modalForm}>
              <label className={styles.modalLabel}>Room Name</label>
              <input
                className={styles.modalInput}
                placeholder="e.g. Interview Prep"
                value={newRoom.name}
                onChange={e => setNewRoom(r => ({ ...r, name: e.target.value }))}
                autoFocus required
              />

              <label className={styles.modalLabel}>Language</label>
              <select
                className={styles.modalInput}
                value={newRoom.language}
                onChange={e => setNewRoom(r => ({ ...r, language: e.target.value }))}
              >
                {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>

              <label className={styles.modalLabel}>Room Password</label>
              <div className={styles.pwdRow}>
                <input
                  className={styles.modalInput}
                  type={showCreatePwd ? 'text' : 'password'}
                  placeholder="Min. 4 characters"
                  value={newRoom.roomPassword}
                  onChange={e => setNewRoom(r => ({ ...r, roomPassword: e.target.value }))}
                  required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowCreatePwd(v => !v)}>
                  <EyeIcon open={showCreatePwd} />
                </button>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.createBtn} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* join room modal */}
      {modal === 'join' && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Join a room</h2>
                <p className={styles.modalSub}>Enter the room ID and password shared by the host.</p>
              </div>
            </div>

            {joinError && <div className={styles.modalError}>{joinError}</div>}

            <form onSubmit={handleJoin} className={styles.modalForm}>
              <label className={styles.modalLabel}>Room ID</label>
              <input
                className={`${styles.modalInput} ${styles.codeInput}`}
                placeholder="e.g. A7X92B"
                value={joinForm.roomCode}
                onChange={e => setJoinForm(f => ({ ...f, roomCode: e.target.value.toUpperCase() }))}
                autoFocus required
                maxLength={10}
                spellCheck={false}
                autoComplete="off"
              />

              <label className={styles.modalLabel}>Room Password</label>
              <div className={styles.pwdRow}>
                <input
                  className={styles.modalInput}
                  type={showJoinPwd ? 'text' : 'password'}
                  placeholder="Enter the room password"
                  value={joinForm.roomPassword}
                  onChange={e => setJoinForm(f => ({ ...f, roomPassword: e.target.value }))}
                  required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowJoinPwd(v => !v)}>
                  <EyeIcon open={showJoinPwd} />
                </button>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.joinModalBtn} disabled={joining}>
                  {joining ? 'Verifying...' : 'Join Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* enter existing room modal */}
      {modal?.type === 'enter' && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{modal.room.name || 'Enter Room'}</h2>
                <p className={styles.modalSub}>Enter the room password to continue.</p>
              </div>
            </div>

            {joinError && <div className={styles.modalError}>{joinError}</div>}

            <form onSubmit={e => handleEnterRoom(e, modal.room)} className={styles.modalForm}>
              <div className={styles.roomInfoRow}>
                <span className={styles.langBadge}>{modal.room.language}</span>
                <span className={styles.roomCode}>#{modal.room.roomId}</span>
              </div>

              <label className={styles.modalLabel}>Room Password</label>
              <div className={styles.pwdRow}>
                <input
                  className={styles.modalInput}
                  type={showJoinPwd ? 'text' : 'password'}
                  placeholder="Enter the room password"
                  value={joinForm.roomPassword}
                  onChange={e => setJoinForm(f => ({ ...f, roomPassword: e.target.value }))}
                  autoFocus required
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowJoinPwd(v => !v)}>
                  <EyeIcon open={showJoinPwd} />
                </button>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={styles.joinModalBtn} disabled={joining}>
                  {joining ? 'Verifying...' : 'Enter Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}