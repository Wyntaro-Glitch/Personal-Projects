const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const Room = require('./models/Room');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
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
app.use('/api/rooms', roomRoutes);

// Track connected users per room
const roomUsers = new Map();
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

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let currentRoomId = null;
  let currentUserInfo = { id: socket.id, username: 'Guest', color: getRandomColor() };

  // Listen for user info after connection
  socket.on('user-info', (userInfo) => {
    currentUserInfo.username = userInfo.username;
    currentUserInfo.isGuest = userInfo.isGuest || false;
    currentUserInfo.userId = userInfo.userId;
    
    if (userInfo.isGuest) {
      guestUsers.set(socket.id, userInfo.userId);
    }
  });

  // Join a room
  socket.on('join-room', async (roomId) => {
    // Leave previous room if any
    if (currentRoomId) {
      socket.leave(currentRoomId);
      const prevUsers = roomUsers.get(currentRoomId) || [];
      roomUsers.set(currentRoomId, prevUsers.filter(u => u.id !== socket.id));
      io.to(currentRoomId).emit('users-update', roomUsers.get(currentRoomId) || []);
    }

    // Join new room
    socket.join(roomId);
    currentRoomId = roomId;

    // Add user to room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, []);
    }
    const users = roomUsers.get(roomId);
    if (!users.find(u => u.id === socket.id)) {
      users.push(currentUserInfo);
    }

    // Notify room
    io.to(roomId).emit('users-update', users);

    // Load room strokes from database
    try {
      const room = await Room.findById(roomId);
      if (room) {
        socket.emit('load-strokes', room.strokes || []);
      }
    } catch (err) {
      console.error('Error loading room strokes:', err);
    }

    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Leave room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    const users = roomUsers.get(roomId) || [];
    roomUsers.set(roomId, users.filter(u => u.id !== socket.id));
    io.to(roomId).emit('users-update', roomUsers.get(roomId) || []);
    io.to(roomId).emit('user-left', socket.id);
    currentRoomId = null;
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  // Broadcast new stroke to room only
  socket.on('new-stroke', async (stroke) => {
    if (currentRoomId) {
      // Save stroke to database
      try {
        await Room.findByIdAndUpdate(currentRoomId, {
          $push: { strokes: stroke }
        });
      } catch (err) {
        console.error('Error saving stroke:', err);
      }
      
      // Broadcast to room
      socket.to(currentRoomId).emit('receive-stroke', stroke);
    }
  });

  // Broadcast cursor position to room only
  socket.on('cursor-move', (data) => {
    if (currentRoomId) {
      socket.to(currentRoomId).emit('cursor-update', {
        userId: socket.id,
        ...data
      });
    }
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    
    // Check if this was a guest user
    const guestUserId = guestUsers.get(socket.id);
    if (guestUserId) {
      await deleteGuestAccount(guestUserId);
      guestUsers.delete(socket.id);
    }
    
    // Remove from room
    if (currentRoomId) {
      const users = roomUsers.get(currentRoomId) || [];
      roomUsers.set(currentRoomId, users.filter(u => u.id !== socket.id));
      io.to(currentRoomId).emit('users-update', roomUsers.get(currentRoomId) || []);
      io.to(currentRoomId).emit('user-left', socket.id);
    }
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
