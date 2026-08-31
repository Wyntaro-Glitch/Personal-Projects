# Phase 2.1: Socket Server Setup

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** [[Phase-6-Polish]]

## Objective

Install Socket.io and configure server for real-time communication.

## Why This Matters

Foundation for all real-time features. Server must accept WebSocket connections before client can connect.

## Deliverables

- [ ] Socket.io installed on server
- [ ] HTTP server created for Socket.io
- [ ] CORS configured for React dev server
- [ ] Basic connection/disconnection handling

## Tasks

### 1. Install Socket.io

```bash
cd server
npm install socket.io
```

---

### 2. Update `server/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let savedStrokes = [];

// API Endpoints
app.get('/strokes', (req, res) => {
  res.json(savedStrokes);
});

app.post('/strokes', (req, res) => {
  savedStrokes = req.body;
  res.json({ success: true });
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

**What this does:**
- Creates HTTP server (required for Socket.io)
- Configures CORS for React dev server
- Handles basic connection/disconnection
- Ready for next phases

---

### 3. Test Server

```bash
cd server
npm start
```

Should show: `Server running at http://localhost:3000`

## Completion Checklist

- [x] Socket.io installed
- [x] HTTP server created
- [x] CORS configured
- [x] Server starts without errors
- [x] Connection logs work

## Next Phase

→ [[Phase-2.2-Socket-Client]]
