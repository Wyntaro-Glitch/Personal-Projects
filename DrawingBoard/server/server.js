const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Clean up any leftover guest accounts on server start
    await cleanupGuestAccounts();
  })
  .catch(err => console.error('MongoDB connection error:', err));

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

// Routes
app.use('/api/auth', authRoutes);

// In-memory storage
let savedStrokes = [];
let connectedUsers = [];

// Track guest users by socket ID
const guestUsers = new Map();

// Clean up all guest accounts on server start
async function cleanupGuestAccounts() {
  try {
    const User = require('./models/User');
    const result = await User.deleteMany({ isGuest: true });
    if (result.deletedCount > 0) {
      console.log(`Cleaned up ${result.deletedCount} guest accounts`);
    }
  } catch (err) {
    console.error('Error cleaning up guest accounts:', err);
  }
}

// Delete guest account when they disconnect
async function deleteGuestAccount(userId) {
  try {
    const User = require('./models/User');
    await User.deleteOne({ _id: userId, isGuest: true });
    console.log(`Guest account deleted: ${userId}`);
  } catch (err) {
    console.error('Error deleting guest account:', err);
  }
}

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

  // Listen for user info after connection
  socket.on('user-info', (userInfo) => {
    // Update user with display name
    const userIndex = connectedUsers.findIndex(u => u.id === socket.id);
    if (userIndex !== -1) {
      connectedUsers[userIndex].username = userInfo.username;
      connectedUsers[userIndex].isGuest = userInfo.isGuest || false;
    }
    if (userInfo.isGuest) {
      guestUsers.set(socket.id, userInfo.userId);
    }
    io.emit('users-update', connectedUsers);
  });

  // Add user to connected list
  connectedUsers.push({ id: socket.id, color: getRandomColor(), username: 'Guest' });
  io.emit('users-update', connectedUsers);

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

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    
    // Check if this was a guest user
    const guestUserId = guestUsers.get(socket.id);
    if (guestUserId) {
      await deleteGuestAccount(guestUserId);
      guestUsers.delete(socket.id);
    }
    
    connectedUsers = connectedUsers.filter(u => u.id !== socket.id);
    io.emit('users-update', connectedUsers);
    io.emit('user-left', socket.id);
  });
});

function getRandomColor() {
  const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#9999CC', '#B34D4D', '#80B300', '#E6B3B3',
    '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#33FFCC', '#66994D',
    '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF',
    '#E666FF', '#4DB3FF', '#1AB399', '#E666B3', '#33991A', '#CC9999',
    '#B3B31A', '#00E680', '#4D8066', '#809980', '#E6FF80', '#1AFF33',
    '#999933', '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#8099B3'];
  return colors[Math.floor(Math.random() * colors.length)];
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
