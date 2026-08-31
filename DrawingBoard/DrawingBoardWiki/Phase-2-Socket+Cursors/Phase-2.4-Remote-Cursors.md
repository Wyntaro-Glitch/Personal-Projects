# Phase 2.4: Remote Cursors

> **Status:** ⬜ Not Started  
> **Priority:** Medium  
> **Depends On:** [[Phase-2.3-Broadcast-Strokes]]

## Objective

Show other users' cursor positions in real-time.

## Why This Matters

Visual feedback that others are present and drawing. Essential for collaboration awareness.

## Deliverables

- [ ] Cursor positions broadcast to all users
- [ ] Remote cursors rendered on canvas
- [ ] Cursor colors unique per user
- [ ] Cursors disappear on disconnect

## Tasks

### 1. Update `server/server.js`

Add cursor events:

```javascript
io.on('connection', (socket) => {
  // ... existing code ...

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
```

---

### 2. Update `client/src/hooks/useSocket.js`

Add cursor functions:

```javascript
export default function useSocket() {
  // ... existing code ...

  const emitCursor = useCallback((data) => {
    if (socket) {
      socket.emit('cursor-move', data);
    }
  }, [socket]);

  const onCursorUpdate = useCallback((callback) => {
    if (socket) {
      socket.on('cursor-update', callback);
      return () => socket.off('cursor-update', callback);
    }
  }, [socket]);

  const onUserLeft = useCallback((callback) => {
    if (socket) {
      socket.on('user-left', callback);
      return () => socket.off('user-left', callback);
    }
  }, [socket]);

  return {
    socket,
    connected,
    emitStroke,
    onReceiveStroke,
    onLoadStrokes,
    emitCursor,
    onCursorUpdate,
    onUserLeft
  };
}
```

---

### 3. Update `client/src/components/Canvas.jsx`

Add remote cursors:

```jsx
export default function Canvas({
  brushSize,
  color,
  isEraser,
  strokes,
  onStrokesChange,
  remoteCursors,
  onCursorMove
}) {
  // ... existing code ...

  const handleMouseMove = (e) => {
    draw(e);
    onCursorMove({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      color
    });
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => startDrawing(e, brushSize, color, isEraser)}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '1px solid #000', cursor: 'crosshair' }}
      />
      {Object.entries(remoteCursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="remote-cursor"
          style={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: cursor.color,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
}
```

---

### 4. Update `client/src/App.jsx`

Handle cursor state:

```jsx
const [remoteCursors, setRemoteCursors] = useState({});

useEffect(() => {
  const cleanup = onCursorUpdate((data) => {
    setRemoteCursors(prev => ({
      ...prev,
      [data.userId]: { x: data.x, y: data.y, color: data.color }
    }));
  });
  return cleanup;
}, [onCursorUpdate]);

useEffect(() => {
  const cleanup = onUserLeft((userId) => {
    setRemoteCursors(prev => {
      const newCursors = { ...prev };
      delete newCursors[userId];
      return newCursors;
    });
  });
  return cleanup;
}, [onUserLeft]);

const handleCursorMove = (data) => {
  emitCursor(data);
};
```

---

### 5. Add CSS

```css
.canvas-container {
  position: relative;
}

.remote-cursor {
  position: absolute;
  pointer-events: none;
}
```

---

### 6. Test Cursors

1. Open two browser tabs
2. Move mouse in tab 1
3. Should see cursor in tab 2
4. Close tab 1 → cursor disappears

## Completion Checklist

- [ ] Cursor positions broadcast
- [ ] Remote cursors rendered
- [ ] Cursors disappear on disconnect

## Next Phase

→ [[Phase-2.5-User-Management]]
