const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Create room
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length < 1) {
      return res.status(400).json({ error: 'Room name required' });
    }

    let code;
    let codeExists = true;
    
    // Generate unique code
    while (codeExists) {
      code = Room.generateCode();
      const existing = await Room.findOne({ code });
      codeExists = !!existing;
    }
    
    const room = new Room({
      name: name.trim(),
      code,
      owner: req.userId,
      members: [req.userId]
    });
    
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error('Create room error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// List user's rooms
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ 
      members: req.userId,
      isActive: true 
    }).populate('owner', 'username').populate('members', 'username');
    
    res.json(rooms);
  } catch (err) {
    console.error('List rooms error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get room by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('owner', 'username')
      .populate('members', 'username');
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(room);
  } catch (err) {
    console.error('Get room error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Join room by code
router.post('/join', auth, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code || code.length !== 6) {
      return res.status(400).json({ error: 'Invalid room code' });
    }
    
    const room = await Room.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    if (!room.members.includes(req.userId)) {
      room.members.push(req.userId);
      await room.save();
    }
    
    const populated = await Room.findById(room._id)
      .populate('owner', 'username')
      .populate('members', 'username');
    
    res.json(populated);
  } catch (err) {
    console.error('Join room error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Leave room
router.post('/leave', auth, async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    room.members = room.members.filter(m => m.toString() !== req.userId);
    
    if (room.members.length === 0) {
      room.isActive = false;
    }
    
    await room.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Leave room error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Delete room (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only owner can delete room' });
    }
    
    room.isActive = false;
    await room.save();
    
    res.json({ success: true });
  } catch (err) {
    console.error('Delete room error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
