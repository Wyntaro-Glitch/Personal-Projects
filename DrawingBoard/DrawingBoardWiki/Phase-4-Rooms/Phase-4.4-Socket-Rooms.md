# Phase 4.4: Socket Rooms

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-4.3-Room-UI]]

## Objective

Isolate Socket.io connections per room.

## Why This Matters

Without room isolation, all users see all drawings. Rooms ensure only room members see each other's work.

## Deliverables

- [ ] Join Socket.io room on connect
- [ ] Broadcast only to room members
- [ ] Leave room on disconnect

## Tasks

### 1. Update `server/server.js`

```javascript
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Leave room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    socket.roomId = null;
  });

  // Broadcast to room only
  socket.on('new-stroke', (stroke) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('receive-stroke', stroke);
    }
  });

  // Cursor to room only
  socket.on('cursor-move', (data) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit('cursor-update', {
        userId: socket.id,
        ...data
      });
    }
  });
});
```

## Completion Checklist

- [ ] Room join/leave works
- [ ] Strokes isolated per room
- [ ] Cursors isolated per room

## Next Phase

→ [[Phase-4.5-Room-Drawing]]
