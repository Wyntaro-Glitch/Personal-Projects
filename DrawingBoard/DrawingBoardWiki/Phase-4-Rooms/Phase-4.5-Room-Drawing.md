# Phase 4.5: Room Drawing

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-4.4-Socket-Rooms]]

## Objective

Connect drawing features to work with rooms.

## Deliverables

- [ ] Load room strokes on join
- [ ] Save strokes to room
- [ ] Clear room canvas

## Tasks

### 1. Update App.jsx

```jsx
// When entering a room
useEffect(() => {
  if (currentRoom) {
    socket.emit('join-room', currentRoom._id);
    // Load room strokes
    loadRoomStrokes(currentRoom._id);
  }
  return () => {
    if (currentRoom) {
      socket.emit('leave-room', currentRoom._id);
    }
  };
}, [currentRoom]);
```

### 2. Update Strokes to Include Room

```javascript
const handleStrokesChange = (stroke) => {
  addToHistory(stroke);
  emitStroke(stroke); // Stroke includes room context via socket
};
```

## Completion Checklist

- [ ] Room strokes load on join
- [ ] New strokes saved to room
- [ ] Canvas shows only room content

## Phase Complete

All Room phases done! 🎉
