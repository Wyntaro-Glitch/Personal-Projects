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

  // Send existing strokes to new user
  socket.emit('load-strokes', savedStrokes);

  // Broadcast new stroke to all users
  socket.on('new-stroke', (stroke) => {
    savedStrokes.push(stroke);
    socket.broadcast.emit('receive-stroke', stroke);
  });

  // Broadcast cursor position
  socket.on('cursor-move', (data) => {
    socket.broadcast.emit('cursor-update', {
      userId: socket.id,
      ...data
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('user-left', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
