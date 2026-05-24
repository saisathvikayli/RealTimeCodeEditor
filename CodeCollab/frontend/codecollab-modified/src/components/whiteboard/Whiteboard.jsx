import React, { useRef, useEffect, useState, useCallback } from 'react'
import { getSocket, EVENTS } from '../../services/socket'
import styles from './Whiteboard.module.css'

const COLORS = ['#000000', '#68d391', '#f6ad55', '#fc8181', '#63b3ed', '#b794f4']
const SIZES = [2, 4, 6, 10]

export default function Whiteboard({ roomId, username }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const isDrawing = useRef(false)
  const lastPoint = useRef(null)
  const strokesRef = useRef([])  // store all strokes locally

  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(2)
  const [isEraser, setIsEraser] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // draw a single stroke
  const drawStroke = useCallback((stroke) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.globalCompositeOperation = stroke.isEraser ? 'destination-out' : 'source-over'

    ctx.beginPath()
    ctx.moveTo(stroke.from.x * canvas.width, stroke.from.y * canvas.height)
    ctx.lineTo(stroke.to.x * canvas.width, stroke.to.y * canvas.height)
    ctx.stroke()
  }, [])

  // redraw everything from stroke history
  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    strokesRef.current.forEach(drawStroke)
  }, [drawStroke])

  // socket listeners
  useEffect(() => {
    if (!roomId || !username) return
    const socket = getSocket(username)

    socket.emit(EVENTS.WHITEBOARD_REQUEST, { roomId })

    const onState = ({ strokes }) => {
      strokesRef.current = [...strokes]
      redrawAll()
    }

    const onDraw = ({ stroke }) => {
      strokesRef.current.push(stroke)
      drawStroke(stroke)
    }

    const onClear = () => {
      strokesRef.current = []
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    socket.on(EVENTS.WHITEBOARD_STATE, onState)
    socket.on(EVENTS.WHITEBOARD_DRAW, onDraw)
    socket.on(EVENTS.WHITEBOARD_CLEAR, onClear)

    return () => {
      socket.off(EVENTS.WHITEBOARD_STATE, onState)
      socket.off(EVENTS.WHITEBOARD_DRAW, onDraw)
      socket.off(EVENTS.WHITEBOARD_CLEAR, onClear)
    }
  }, [roomId, username, drawStroke, redrawAll])

  // resize canvas and redraw all strokes from stored data
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      redrawAll()
    }

    // small delay for fullscreen transition to settle
    const timeout = setTimeout(resizeCanvas, 50)
    window.addEventListener('resize', resizeCanvas)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isFullscreen, redrawAll])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    return { x, y }
  }

  const handleMouseDown = (e) => {
    isDrawing.current = true
    lastPoint.current = getPos(e)
  }

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return

    const newPoint = getPos(e)
    const stroke = {
      from: lastPoint.current,
      to: newPoint,
      color,
      size,
      isEraser
    }

    strokesRef.current.push(stroke)
    drawStroke(stroke)

    const socket = getSocket(username)
    socket.emit(EVENTS.WHITEBOARD_DRAW, { roomId, stroke, drawer: username })

    lastPoint.current = newPoint
  }

  const handleMouseUp = () => {
    isDrawing.current = false
    lastPoint.current = null
  }

  const handleClear = () => {
    strokesRef.current = []
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    const socket = getSocket(username)
    socket.emit(EVENTS.WHITEBOARD_CLEAR, { roomId })
  }

  const toggleFullscreen = () => setIsFullscreen(prev => !prev)

  return (
    <div className={`${styles.wrapper} ${isFullscreen ? styles.fullscreen : ''}`}>
      <div className={styles.toolbar}>
        <span className={styles.label}>Whiteboard</span>

        <div className={styles.colors}>
          {COLORS.map(c => (
            <button
              key={c}
              className={`${styles.colorBtn} ${color === c && !isEraser ? styles.activeColor : ''}`}
              style={{ background: c }}
              onClick={() => { setColor(c); setIsEraser(false) }}
              title={c}
            />
          ))}
        </div>

        <div className={styles.sizes}>
          {SIZES.map(s => (
            <button
              key={s}
              className={`${styles.sizeBtn} ${size === s ? styles.activeSize : ''}`}
              onClick={() => setSize(s)}
            >
              <span className={styles.dot} style={{ width: s * 2, height: s * 2 }} />
            </button>
          ))}
        </div>

        <button
          className={`${styles.tool} ${isEraser ? styles.activeTool : ''}`}
          onClick={() => setIsEraser(prev => !prev)}
          title="Eraser"
        >
          Erase
        </button>

        <button className={styles.tool} onClick={handleClear} title="Clear all">
          Clear
        </button>

        <button className={styles.tool} onClick={toggleFullscreen} title="Toggle fullscreen">
          {isFullscreen ? 'Exit' : 'Full'}
        </button>
      </div>

      <div className={styles.canvasContainer} ref={containerRef}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  )
}