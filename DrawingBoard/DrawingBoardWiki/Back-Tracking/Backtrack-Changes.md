# Backtrack Changes

> What changed from the original vanilla JS plan to React + Vite
> 
> **Date:** 2026-08-31

## Summary

Original plan used vanilla HTML5 Canvas. Now using React + Vite for frontend with full-stack features.

## Phase Structure Change

**Original:** 7 phases (1-7)  
**New:** 5 phases with sub-phases + UI enhancements

| Original | New |
|----------|-----|
| Phase 1 | Phase 1 (Server + Canvas) |
| Phase 2 | Phase 2 (Socket + Cursors) |
| Phase 3 | Phase 3 (Auth) |
| Phase 4 | Phase 4 (Rooms) |
| Phase 5 | Phase 5 (Drawing Tools) |
| Phase 6 | UI Enhancements |
| Phase 7 | - |

## What Stays the Same

| Item | Status |
|------|--------|
| Node.js backend | ✅ Same |
| Express server | ✅ Same |
| API endpoints | ✅ Same |
| Socket.io real-time | ✅ Added |

## What Changes

### Folder Structure

| Original | New |
|----------|-----|
| `public/index.html` | `client/src/App.jsx` |
| `public/app.js` | `client/src/components/*.jsx` |
| `public/style.css` | `client/src/index.css` |
| `server.js` (root) | `server/server.js` |

### Package.json

| Original | New |
|----------|-----|
| Single `package.json` | Two: `server/package.json` + `client/package.json` |
| `express` only | `express` + React + Socket.io |

### Development Server

| Original | New |
|----------|-----|
| `node server.js` (port 3000) | `npm run dev` in client (port 5173) |
| Server serves HTML | Vite serves React app |
| Static files | Hot module reload |

### Code Structure

| Original | New |
|----------|-----|
| Global variables | React state hooks |
| `addEventListener` | React event handlers |
| Direct DOM manipulation | JSX rendering |
| Single file | Component-based |

## Recent Changes

### Sidebar Addition (2026-08-31)

Added collapsible sidebar with tool sections:
- `client/src/components/Sidebar.jsx` - New sidebar component
- Tools grid with icons (Pen, Rectangle, Circle, Line, Fill, Text, Eraser)
- Brush size slider with preview
- Color picker with presets

### Topbar and Ribbon (2026-08-31)

Added two-row topbar with ribbon:
- `client/src/components/Topbar.jsx` - Top navigation bar
- `client/src/components/Ribbon.jsx` - Ribbon with menu placeholders

**Topbar Features:**
- Top row: Logo, menus (File, Edit, Layers, Select), room info, users
- Bottom row: Action buttons (Undo, Redo, Clear, Download)
- Room code with asterisks masking
- Eye toggle to show/hide room code
- Copy button with clipboard support
- Users hover dropdown with actions
- Logout and Back to Rooms buttons in dropdown

**Ribbon Features:**
- File: New, Save, Save As, Export, Print
- Edit: Undo, Redo, Copy, Paste, Cut, Find
- Layers: Add/Delete Layer, Arrange, Opacity
- Select: Selection tools, Transform, Align

### Dropdown Hover Fix (2026-08-31)

Fixed users dropdown hover issue:
- Added invisible bridge area (::before pseudo-element)
- Allows mouse to travel from trigger to dropdown
- Prevents dropdown from closing when moving to buttons

### Socket Disconnect Bug Fix (2026-08-31)

Fixed critical bug where joining a room disconnected the user:

**Root Cause:** `React.StrictMode` in development mode causes components to mount → unmount → remount, which closed the socket connection.

**Fix:** Removed `React.StrictMode` from `main.jsx`

**Files Changed:**
- `client/src/main.jsx` - Removed StrictMode
- `client/src/hooks/useSocket.js` - Fixed socket lifecycle
- `server/server.js` - Added diagnostic logging

### Room Isolation Fix (2026-08-31)

Fixed bug where strokes from one room appeared in another:

**Root Cause:** Strokes weren't being cleared when switching rooms, and global stroke save was interfering with per-room saves.

**Fix:** Clear canvas and strokes on room switch, remove global stroke save.

**Files Changed:**
- `client/src/App.jsx` - Room switch cleanup
- `server/server.js` - Per-room stroke storage

## Files to Delete (Original Plan)

These files from the original plan are no longer needed:

- `public/index.html` (replaced by React)
- `public/app.js` (replaced by React components)
- `public/style.css` (replaced by React CSS)

## Files to Keep

- `server.js` → Move to `server/server.js`
- `package.json` → Split into two
- `.gitignore` → Update for React
- `DrawingBoardWiki/` → Keep as-is

## New Dependencies

### Server (`server/package.json`)
- express
- cors (for cross-origin requests)
- dotenv
- socket.io
- mongoose (MongoDB)
- jsonwebtoken (JWT auth)
- bcryptjs (password hashing)

### Client (`client/package.json`)
- react
- react-dom
- react-router-dom
- vite
- @vitejs/plugin-react
- socket.io-client

## Current File Structure

```
DrawingBoard/
├── server/
│   ├── server.js           # Express + Socket.io server
│   ├── models/
│   │   ├── User.js         # User model with isGuest
│   │   └── Room.js         # Room model with strokes
│   ├── routes/
│   │   ├── auth.js         # Auth endpoints
│   │   └── rooms.js        # Room endpoints
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   └── .env                # MongoDB URI, JWT secret
├── client/
│   ├── src/
│   │   ├── App.jsx         # Main app with room views
│   │   ├── main.jsx        # Entry point
│   │   ├── index.css       # All styles
│   │   ├── components/
│   │   │   ├── Canvas.jsx      # Drawing canvas
│   │   │   ├── Sidebar.jsx     # Collapsible sidebar
│   │   │   ├── Toolbar.jsx     # Legacy toolbar (kept)
│   │   │   ├── Users.jsx       # Legacy users panel (kept)
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
│   └── package.json
└── DrawingBoardWiki/        # Project documentation
```
