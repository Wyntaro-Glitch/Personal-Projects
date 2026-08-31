# Documentation

> **Status:** ✅ Completed  
> **Priority:** Medium  
> **Last Updated:** 2026-08-31

## Objective

Document the DrawingBoard application for maintainability and sharing.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express + Socket.io
- **Database:** MongoDB Atlas
- **Auth:** JWT + bcrypt

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd DrawingBoard

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:
```
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

### 3. Start Development

```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm run dev
```

### 4. Open Browser

```
http://localhost:5173
```

## Features

### Core Features
- ✅ Real-time collaborative drawing
- ✅ User authentication (register, login, guest)
- ✅ Room-based collaboration
- ✅ Drawing tools (pen, shapes, fill, text)
- ✅ Remote cursors visible
- ✅ Undo/redo functionality
- ✅ Canvas download as PNG

### Drawing Tools
- **Pen** - Freehand drawing
- **Rectangle** - Draw rectangles
- **Circle** - Draw circles
- **Line** - Draw straight lines
- **Fill** - Flood fill areas
- **Text** - Add text annotations
- **Eraser** - Erase strokes

### UI Features
- Collapsible sidebar
- Tool selection with icons
- Brush size preview
- Color presets
- Users list with "You" badge
- Room code display

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login with username |
| POST | /api/auth/guest | Login as guest |
| GET | /api/auth/me | Get current user |

### Rooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/rooms | Get all rooms |
| POST | /api/rooms | Create new room |
| GET | /api/rooms/:id | Get room by ID |
| POST | /api/rooms/:id/join | Join room |
| POST | /api/rooms/:id/leave | Leave room |
| DELETE | /api/rooms/:id | Delete room (owner) |

### Strokes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /strokes | Get saved strokes |
| POST | /strokes | Save strokes |

## Socket.io Events

### Client → Server
| Event | Data | Description |
|-------|------|-------------|
| join-room | roomId | Join a room |
| leave-room | roomId | Leave a room |
| new-stroke | stroke | Broadcast new stroke |
| cursor-move | {x, y, color} | Broadcast cursor position |
| user-info | {username, isGuest} | Send user info |

### Server → Client
| Event | Data | Description |
|-------|------|-------------|
| load-strokes | strokes[] | Load room strokes |
| receive-stroke | stroke | Receive new stroke |
| cursor-update | {userId, x, y, color} | Receive cursor update |
| users-update | users[] | Update users list |
| user-left | userId | User left room |

## Project Structure

```
DrawingBoard/
├── server/
│   ├── server.js           # Express + Socket.io
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── Room.js         # Room schema
│   ├── routes/
│   │   ├── auth.js         # Auth routes
│   │   └── rooms.js        # Room routes
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   └── .env                # Environment vars
├── client/
│   ├── src/
│   │   ├── App.jsx         # Main app
│   │   ├── components/
│   │   │   ├── Canvas.jsx  # Drawing canvas
│   │   │   ├── Topbar.jsx  # Two-row topbar
│   │   │   ├── Ribbon.jsx  # Menu ribbon
│   │   │   └── Sidebar.jsx # Tool sidebar
│   │   ├── hooks/
│   │   │   ├── useCanvas.js
│   │   │   └── useSocket.js
│   │   └── api/
│   │       ├── auth.js
│   │       └── rooms.js
│   └── package.json
└── DrawingBoardWiki/
```

## UI Components

### Topbar
- **Top Row:** Logo, menus, room info, users dropdown
- **Bottom Row:** Action buttons (Undo, Redo, Clear, Download)
- **Users Dropdown:** Shows connected users, Back to Rooms, Logout

### Ribbon
- Collapsible menu sections
- File, Edit, Layers, Select placeholders

### Sidebar
- Collapsible tool sections
- Drawing tools, Brush, Color

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Socket disconnect on join | React.StrictMode | Removed in main.jsx |
| Strokes appear in wrong room | Not clearing on room switch | Clear canvas on room change |
| User not found | Token expired | Re-login required |
| Room not found | Invalid room ID | Check room code |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | Secret for JWT tokens | - |
