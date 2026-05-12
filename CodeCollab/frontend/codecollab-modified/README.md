# CodeCollab — Standalone Frontend (No Backend Required)

This is the fully working frontend that runs **without any server or backend**.

## What changed from the original

| File | Change |
|---|---|
| `src/context/AuthContext.jsx` | Uses localStorage mock — accepts any credentials |
| `src/services/mockDb.js` | NEW — In-memory room store with 3 sample rooms |
| `src/services/socket.js` | Replaced Socket.IO with a mock that simulates other users |
| `src/hooks/useSocket.js` | Uses the mock socket |
| `src/pages/RoomPage.jsx` | Loads from mockDb, simulated code execution output |
| `src/pages/DashboardPage.jsx` | CRUD against mockDb, delete button added |
| `vite.config.js` | Proxy config removed (no backend) |
| `package.json` | axios, socket.io-client, yjs removed (not needed) |

## How to run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Login
Enter **any email and password** — it creates a local user automatically.

## Features working
- Login / Register (local, no real auth)
- Dashboard with 3 sample rooms + create/delete rooms
- Monaco Editor with syntax highlighting
- Language switching (Python, JS, TS, C++, Java, Go, Rust)
- Simulated code run output
- Chat panel (messages stay in session)
- Mock collaborative users appear after ~1.5s
- Auto-save to in-memory store
