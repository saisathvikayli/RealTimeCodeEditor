# CodeCollab - A Real-Time Collaborative Code Editor

CodeCollab is a web-based collaborative coding platform that lets multiple developers write, edit, and execute code together in real time. Built as a full MERN stack application, it combines synchronized code editing, live chat, an AI coding assistant, and a shared whiteboard inside private, password-protected rooms.

---

## Key Features

### Core Functionality
- **Real-Time Code Sync** — Multiple users can edit the same code simultaneously with changes synced across all participants within seconds.
- **Live Cursor Tracking** — Each user's cursor is visible to others, with their username displayed next to a colored caret.
- **Multi-Language Support** — Seven languages supported: Python, JavaScript, TypeScript, C++, Java, Go, and Rust.
- **In-Editor Code Execution** — Run code directly from the editor and view output in the integrated output panel. Powered by the Judge0 API.
- **Syntax Highlighting** — Built on Monaco Editor (the same engine that powers VS Code), with full syntax support across all languages.
- **Room-Based Sessions** — Each coding session lives inside a private room with a unique ID and password. Users can create or join rooms.
- **In-Room Chat** — Real-time chat panel inside every room with persisted message history.
- **Invite via Share Link** — One-click copy of the room ID, password, and direct link for inviting collaborators.

### Additional Features
- **AI Code Assistant** — A Google Gemini-powered assistant available in every room. Users can ask coding questions and the AI automatically receives the current code as context, providing relevant explanations, debugging suggestions, and improvements.
- **Collaborative Whiteboard** — A real-time drawing canvas alongside the editor. Users can sketch out logic, draw architecture diagrams, or brainstorm visually together. Includes multiple colors, brush sizes, eraser, clear, and fullscreen mode.
- **User Profile Page** — Each user has a dedicated profile page showing personal stats: rooms created, rooms joined, messages sent, languages used (as a tag cloud), and a list of recent rooms with quick re-entry.
- **Edit Profile** — Users can update their email and password from within the profile page, with current-password verification for security.
- **Live Activity Feed** — A real-time stream of room events (users joining/leaving, code runs, language changes) visible in the sidebar.
- **Room Info Card** — Sidebar panel displaying room name, ID, language, and a one-click invite-info copy button.
- **Code Statistics** — Live stats display showing line count, code lines, and character count of the current code in the editor.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Monaco Editor, Socket.IO Client, Axios |
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens), bcrypt password hashing |
| Real-Time Engine | Socket.IO |
| Code Execution | Judge0 API |
| AI Integration | Google Gemini API |
| Styling | CSS Modules with custom theming |

---

### Login / Register
*[Screenshot placeholder]*

### Dashboard - Your Rooms
*[Screenshot placeholder]*

### Room - Real-Time Collaboration
*[Screenshot placeholder]*

### AI Code Assistant in Action
*[Screenshot placeholder]*

### Collaborative Whiteboard
*[Screenshot placeholder]*

### User Profile Page
*[Screenshot placeholder]*

---

## Architecture Overview

CodeCollab uses a Socket.IO-driven real-time architecture on top of a standard REST API. The flow looks like this:

- **REST API endpoints** handle authentication, room CRUD, profile data, and AI requests.
- **Socket.IO** handles all real-time events: code sync, cursor tracking, chat, language changes, whiteboard drawing, and live activity broadcasts.
- **MongoDB** persists user data, rooms, and chat messages. Whiteboard strokes are kept in server memory for the duration of a room's active session.
- **Authentication** is JWT-based with bcrypt-hashed passwords. Rooms are additionally protected by a room-level password set by the creator.

---

## Folder Structure
CodeCollab/
├── backend/
│   ├── config/         # database connection
│   ├── models/         # mongoose schemas (user, room, message)
│   ├── routes/         # api endpoints (auth, rooms, messages, code execution, ai, user profile)
│   ├── sockets/        # socket.io event handlers
│   └── server.js       # express + socket.io server entry point
│
└── frontend/codecollab-modified/
└── src/
├── components/ # ui components (editor, sidebar, chat, whiteboard, layout)
├── context/    # auth context provider
├── hooks/      # custom react hooks (useSocket)
├── pages/      # main pages (login, register, dashboard, room, profile)
├── services/   # socket and api service layer
└── styles/     # global styles and css variables
---

## Local Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- A Google Gemini API key (free tier)

### Backend Setup

```bash
cd CodeCollab/backend
npm install
```

Create a `.env` file in the backend folder with:
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Start the backend:

```bash
npm start
```

### Frontend Setup

```bash
cd CodeCollab/frontend/codecollab-modified
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default and connects to the backend at `http://localhost:5000`.

---

## API Overview

### REST Endpoints
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Authenticate and receive a JWT
- `GET /api/rooms` — List rooms created by the user
- `POST /api/rooms/create` — Create a new room
- `GET /api/rooms/:roomId` — Get a specific room
- `DELETE /api/rooms/:roomId` — Delete a room
- `GET /api/users/profile/:username` — Get profile data with stats
- `PUT /api/users/profile/:username` — Update profile (email/password)
- `POST /api/ai/ask` — Query the AI assistant with optional code context

### Socket Events
- `room:join`, `room:leave`, `room:users` — Room presence management
- `code:change`, `code:sync` — Code synchronization
- `cursor:move`, `cursor:update` — Live cursor tracking
- `chat:send`, `chat:message`, `chat:history` — Chat messaging
- `language:change`, `language:sync` — Language switching
- `code:run`, `code:output` — Code execution
- `whiteboard:draw`, `whiteboard:clear`, `whiteboard:state` — Whiteboard sync
- `activity:log` — Live activity broadcasts

---

## Future Improvements

Some directions the project could be extended in the future:
- Voice and video chat using WebRTC
- Code review mode with inline comments and suggestions
- Multi-file rooms with a tabbed editor and file tree
- Light/dark theme toggle
- Persistent whiteboard storage in MongoDB
- Avatar/profile picture upload
- Public room discovery
- Code snippet library and templates

---

## License

This project was built as an academic group project. All third-party libraries and APIs used retain their respective licenses.