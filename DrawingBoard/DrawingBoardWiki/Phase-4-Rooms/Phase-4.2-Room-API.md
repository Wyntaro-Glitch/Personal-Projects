# Phase 4.2: Room API

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-4.1-Room-Model]]

## Objective

Create API endpoints for room management.

## Deliverables

- [ ] POST /api/rooms - Create room
- [ ] GET /api/rooms - List user's rooms
- [ ] POST /api/rooms/join - Join by code
- [ ] POST /api/rooms/leave - Leave room
- [ ] GET /api/rooms/:id - Get room details

## Tasks

### 1. Create `server/routes/rooms.js`

```javascript
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Create room
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const code = generateRoomCode();
    
    const room = new Room({
      name,
      code,
      owner: req.userId,
      members: [req.userId]
    });
    
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List user's rooms
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ 
      members: req.userId,
      isActive: true 
    });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Join room by code
router.post('/join', auth, async (req, res) => {
  try {
    const { code } = req.body;
    const room = await Room.findOne({ code, isActive: true });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    if (!room.members.includes(req.userId)) {
      room.members.push(req.userId);
      await room.save();
    }
    
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
```

## Completion Checklist

- [ ] All endpoints created
- [ ] Auth middleware applied
- [ ] Room code validation works

## Next Phase

→ [[Phase-4.3-Room-UI]]
