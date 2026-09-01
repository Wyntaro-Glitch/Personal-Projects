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

### Cursor Offset Fix (2026-08-31)

Fixed cursor drawing offset issue:
- **Problem:** Drawing appeared upper-left of cursor position
- **Cause:** CSS `max-width: 100%` and `height: auto` scaled canvas visually but not coordinates
- **Fix:** Removed CSS scaling, let canvas use actual pixel dimensions

**Files Changed:**
- `client/src/index.css` - Removed `max-width: 100%` and `height: auto` from canvas
- `client/src/components/Canvas.jsx` - Removed conflicting 800x600 size setting

### Clear Canvas Broadcast (2026-08-31)

Added real-time canvas clear broadcast:
- **Feature:** When user clears canvas, all users in room see it immediately
- **Confirmation:** Shows prompt when multiple users in room
- **Message:** "There are X people in this room. Are you sure you want to clear the canvas?"

**Files Changed:**
- `server/server.js` - Added `clear-canvas` socket event
- `client/src/hooks/useSocket.js` - Added `emitClearCanvas` and `onCanvasCleared`
- `client/src/App.jsx` - Added confirmation prompt and broadcast

### Real-time Stroke Broadcasting (2026-08-31)

Added real-time stroke broadcasting as user draws:
- **Feature:** Strokes are broadcast to other users as they are being drawn
- **How it works:** Each mouse move during drawing emits the current stroke data
- **Other users see:** Drawing appear in real-time without waiting for stroke completion

**Files Changed:**
- `client/src/hooks/useCanvas.js` - Added `onDraw` callback parameter
- `client/src/components/Canvas.jsx` - Added `onDraw` prop
- `client/src/App.jsx` - Added `handleDraw`, `drawShape` helper, and `onRealtimeStroke` listener
- `client/src/hooks/useSocket.js` - Added `emitRealtimeStroke` and `onRealtimeStroke`
- `server/server.js` - Added `realtime-stroke` socket event

### MongoDB Cluster Update (2026-08-31)

Updated to new MongoDB Atlas cluster:
- **New Connection:** `mongodb+srv://sherwincalantoc_db_user@drawingboard.3olmlxt.mongodb.net`
- **File Changed:** `server/.env` - Updated MONGODB_URI

### Phase 6: Layer System (2026-08-31)

Implemented full layer system with Clip Studio Paint-inspired features:

**Operation System:**
- Created operation types (ADD_LAYER, DELETE_LAYER, ADD_STROKE, etc.)
- Created operation handlers with apply/inverse functions
- Created operation executor for applying operations
- Created undo/redo manager with operation-based history

**Layer Model:**
- Updated Room schema with layers array
- Each layer has: id, name, type, visible, opacity, blendMode, locked, clipping, alphaLock, strokes[], transform
- Strokes stored inside each layer (not separate array)

**Layer UI:**
- Redesigned layer panel with properties at top
- Blend modes: Normal, Multiply, Screen, Overlay, Darken, Lighten
- Opacity slider
- Layer actions: New, Duplicate, Clear, Delete
- Layer badges: Clipping, Alpha Lock, Locked

**Multi-Canvas Rendering:**
- One canvas per layer, stacked with CSS
- Each layer renders independently
- Active layer receives pointer events
- Blend modes applied via CSS mix-blend-mode

**Files Created:**
- `client/src/operations/operationTypes.js` - Operation type definitions
- `client/src/operations/operationHandlers.js` - Apply/inverse functions
- `client/src/operations/operationExecutor.js` - Operation executor
- `client/src/operations/undoManager.js` - Undo/redo manager
- `client/src/hooks/useLayers.js` - Layer state with operations
- `client/src/canvas/layerRenderer.js` - Layer rendering functions

**Files Modified:**
- `server/models/Room.js` - Added layers schema
- `client/src/App.jsx` - Integrated useLayers hook
- `client/src/components/Canvas.jsx` - Multi-canvas rendering
- `client/src/components/LayerPanel.jsx` - New layer panel UI
- `client/src/hooks/useSocket.js` - Added operation events
- `server/server.js` - Added document:operation handler

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
