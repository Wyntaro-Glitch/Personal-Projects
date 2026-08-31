# Phase 4.1: Room Model

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-3-Auth/Phase-3-Auth]]

## Objective

Create MongoDB Room model for storing room data.

## Why This Matters

Rooms need to be stored so users can join/leave and drawings persist.

## Deliverables

- [ ] Room model with owner, members, strokes
- [ ] Room ID generation
- [ ] Member tracking

## Tasks

### 1. Create `server/models/Room.js`

```javascript
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 6
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  strokes: [{
    points: [{ x: Number, y: Number }],
    color: String,
    width: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
```

---

### 2. Generate Room Code

```javascript
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

## Completion Checklist

- [ ] Room model created
- [ ] Room code generator works
- [ ] Model connected to MongoDB

## Next Phase

→ [[Phase-4.2-Room-API]]
