# DrawingBoard Wiki

> Local Canvas Drawing Server - Personal Project Tracker
> 
> **Last Updated:** 2026-08-31

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express (API)
- **Database:** MongoDB + Mongoose
- **Real-time:** Socket.io
- **Auth:** JWT + bcrypt
- **Canvas:** HTML5 Canvas API

## Quick Links

- [[Progress]] - Overall project status
- [[Issue-Backtracking]] - Debugging guide
- [[Recommendations]] - Best practices and improvements
- [[Backtrack-Changes]] - Changes needed from original plan

## Phases

### Phase 1: Server + Canvas

| Sub-Phase | Name | Status | Link |
|-----------|------|--------|------|
| 1.1 | Setup React | ✅ Completed | [[Phase-1-Server+Canvas/Phase-1.1-Setup-React]] |
| 1.2 | Server API | ✅ Completed | [[Phase-1-Server+Canvas/Phase-1.2-Server-API]] |
| 1.3 | React Canvas | ✅ Completed | [[Phase-1-Server+Canvas/Phase-1.3-React-Canvas]] |
| 1.4 | Drawing Tools | ✅ Completed | [[Phase-1-Server+Canvas/Phase-1.4-Tools]] |
| 1.5 | State Management | ✅ Completed | [[Phase-1-Server+Canvas/Phase-1.5-State]] |
| 1.6 | Polish | ✅ Completed | [[Phase-1-Server+Canvas/Phase-1.6-Polish]] |

### Phase 2: Socket + Cursors

| Sub-Phase | Name | Status | Link |
|-----------|------|--------|------|
| 2.1 | Socket Server | ✅ Completed | [[Phase-2-Socket+Cursors/Phase-2.1-Socket-Server]] |
| 2.2 | Socket Client | ✅ Completed | [[Phase-2-Socket+Cursors/Phase-2.2-Socket-Client]] |
| 2.3 | Broadcast Strokes | ✅ Completed | [[Phase-2-Socket+Cursors/Phase-2.3-Broadcast-Strokes]] |
| 2.4 | Remote Cursors | ✅ Completed | [[Phase-2-Socket+Cursors/Phase-2.4-Remote-Cursors]] |
| 2.5 | User Management | ✅ Completed | [[Phase-2-Socket+Cursors/Phase-2.5-User-Management]] |

### Phase 3: User Authentication

| Sub-Phase | Name | Status | Link |
|-----------|------|--------|------|
| 3.1 | User Model | ✅ Completed | [[Phase-3-Auth/Phase-3.1-User-Model]] |
| 3.2 | Register | ✅ Completed | [[Phase-3-Auth/Phase-3.2-Register]] |
| 3.3 | Login | ✅ Completed | [[Phase-3-Auth/Phase-3.3-Login]] |
| 3.4 | Auth UI | ✅ Completed | [[Phase-3-Auth/Phase-3.4-Auth-UI]] |
| 3.5 | Protected Routes | ✅ Completed | [[Phase-3-Auth/Phase-3.5-Protected-Routes]] |

### Phase 4: Room Creation

| Sub-Phase | Name | Status | Link |
|-----------|------|--------|------|
| 4.1 | Room Model | ⬜ Not Started | [[Phase-4-Rooms/Phase-4.1-Room-Model]] |
| 4.2 | Room API | ⬜ Not Started | [[Phase-4-Rooms/Phase-4.2-Room-API]] |
| 4.3 | Room UI | ⬜ Not Started | [[Phase-4-Rooms/Phase-4.3-Room-UI]] |
| 4.4 | Socket Rooms | ⬜ Not Started | [[Phase-4-Rooms/Phase-4.4-Socket-Rooms]] |
| 4.5 | Room Drawing | ⬜ Not Started | [[Phase-4-Rooms/Phase-4.5-Room-Drawing]] |

## Project Structure (Target)

```
DrawingBoard/
├── server/                 # Backend
│   ├── server.js           # Express API server
│   ├── models/
│   │   └── User.js         # User model
│   ├── routes/
│   │   └── auth.js         # Auth routes
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   ├── .env                # Environment variables
│   └── package.json
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── components/
│   │   │   ├── Canvas.jsx  # Drawing canvas
│   │   │   ├── Toolbar.jsx # Drawing controls
│   │   │   ├── Users.jsx   # Connected users
│   │   │   ├── Login.jsx   # Login form
│   │   │   ├── Register.jsx # Register form
│   │   │   └── ProtectedRoute.jsx # Route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state
│   │   ├── hooks/
│   │   │   ├── useCanvas.js
│   │   │   ├── useStrokeHistory.js
│   │   │   ├── useKeyboardShortcuts.js
│   │   │   └── useSocket.js
│   │   ├── api/
│   │   │   ├── strokes.js
│   │   │   └── auth.js
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── DrawingBoardWiki/       # This wiki
```

## Success Criteria

- [x] `npm start` runs both server and client
- [x] React app loads at localhost:5173
- [x] Express API runs at localhost:3000
- [x] Drawing works in React canvas component
- [x] Brush size and color can be changed
- [x] Undo/redo works
- [x] Strokes persist via API
- [x] Socket.io server configured
- [x] Client connects to Socket.io
- [x] Strokes broadcast to all users
- [x] Remote cursors visible
- [x] Users tracked
- [x] User registration and login
- [x] Protected routes
