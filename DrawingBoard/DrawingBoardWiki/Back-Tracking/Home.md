# DrawingBoard Wiki

> Collaborative Canvas Drawing Application - Personal Project Tracker
> 
> **Last Updated:** 2026-08-31

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express (API)
- **Database:** MongoDB Atlas + Mongoose
- **Real-time:** Socket.io with room isolation
- **Auth:** JWT + bcrypt (username-based)
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
| 4.1 | Room Model | ✅ Completed | [[Phase-4-Rooms/Phase-4.1-Room-Model]] |
| 4.2 | Room API | ✅ Completed | [[Phase-4-Rooms/Phase-4.2-Room-API]] |
| 4.3 | Room UI | ✅ Completed | [[Phase-4-Rooms/Phase-4.3-Room-UI]] |
| 4.4 | Socket Rooms | ✅ Completed | [[Phase-4-Rooms/Phase-4.4-Socket-Rooms]] |
| 4.5 | Room Drawing | ✅ Completed | [[Phase-4-Rooms/Phase-4.5-Room-Drawing]] |

### Phase 5: Drawing Tools

| Sub-Phase | Name | Status | Link |
|-----------|------|--------|------|
| 5.1 | Shape Tools | ✅ Completed | [[Phase-5-Drawing-Tools/Phase-5.1-Shape-Tools]] |
| 5.2 | Fill Bucket | ✅ Completed | [[Phase-5-Drawing-Tools/Phase-5.2-Fill-Bucket]] |
| 5.3 | Text Tool | ✅ Completed | [[Phase-5-Drawing-Tools/Phase-5.3-Text-Tool]] |
| 5.4 | Tool UI | ✅ Completed | [[Phase-5-Drawing-Tools/Phase-5.4-Tool-UI]] |
| 5.5 | Broadcast Tools | ✅ Completed | [[Phase-5-Drawing-Tools/Phase-5.5-Broadcast-Tools]] |

### UI Enhancements

| Enhancement | Status | Notes |
|-------------|--------|-------|
| Sidebar | ✅ Completed | Collapsible sidebar with tool sections |
| Collapsible Sections | ✅ Completed | Tools, Brush, Color, Actions, Users |
| Bug Fixes | ✅ Completed | Socket disconnect, room switching |

## Project Structure

```
DrawingBoard/
├── server/                     # Backend
│   ├── server.js               # Express + Socket.io server
│   ├── models/
│   │   ├── User.js             # User model with isGuest
│   │   └── Room.js             # Room model with strokes
│   ├── routes/
│   │   ├── auth.js             # Auth endpoints
│   │   └── rooms.js            # Room endpoints
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   ├── .env                    # MongoDB URI, JWT secret
│   └── package.json
├── client/                     # Frontend (React)
│   ├── src/
│   │   ├── App.jsx             # Main app with room views
│   │   ├── main.jsx            # Entry point
│   │   ├── index.css           # All styles
│   │   ├── components/
│   │   │   ├── Canvas.jsx      # Drawing canvas
│   │   │   ├── Sidebar.jsx     # Collapsible sidebar
│   │   │   ├── Login.jsx       # Login form
│   │   │   ├── Register.jsx    # Register form
│   │   │   ├── GuestLogin.jsx  # Guest login
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoomList.jsx    # Room list
│   │   │   ├── CreateRoom.jsx  # Create room form
│   │   │   └── JoinRoom.jsx    # Join room form
│   │   ├── hooks/
│   │   │   ├── useCanvas.js    # Canvas logic + tools
│   │   │   ├── useSocket.js    # Socket.io hook
│   │   │   ├── useStrokeHistory.js
│   │   │   └── useKeyboardShortcuts.js
│   │   ├── api/
│   │   │   ├── auth.js         # Auth API calls
│   │   │   ├── rooms.js        # Room API calls
│   │   │   └── strokes.js      # Stroke API calls
│   │   └── context/
│   │       └── AuthContext.jsx # Auth state
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── DrawingBoardWiki/           # Project documentation
```

## Features

- ✅ Real-time collaborative drawing
- ✅ User authentication (register, login, guest)
- ✅ Room-based collaboration (create, join, leave)
- ✅ Drawing tools (pen, shapes, fill, text)
- ✅ Remote cursors visible
- ✅ Undo/redo functionality
- ✅ Canvas download as PNG
- ✅ Two-row topbar with menus
- ✅ Ribbon with menu placeholders
- ✅ Collapsible sidebar
- ✅ Room code masking with eye toggle
- ✅ Copy room code to clipboard
- ✅ Users hover dropdown with actions
- ✅ Logout and Back to Rooms in dropdown
- ✅ Room list shows only name
- ✅ Per-room stroke persistence

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
- [x] Strokes broadcast to room only
- [x] Remote cursors visible
- [x] Users tracked per room
- [x] User registration and login
- [x] Protected routes
- [x] Room creation and joining
- [x] Drawing tools (shapes, fill, text)
- [x] Collapsible sidebar
- [x] Socket disconnect bug fixed
