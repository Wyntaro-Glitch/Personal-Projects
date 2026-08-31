# Phase 2.3: Broadcast Strokes

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** [[Phase-2.2-Socket-Client]]

## Objective

Send and receive strokes in real-time across all connected users.

## Why This Matters

Core collaborative feature - when one user draws, everyone sees it instantly.

## Deliverables

- [ ] Server broadcasts strokes to all users
- [ ] New users receive existing strokes
- [ ] Strokes sync across browser tabs

## Tasks

### 1. Update `server/server.js`

Add stroke events:

```javascript
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send existing strokes to new user
  socket.emit('load-strokes', savedStrokes);

  // Broadcast new stroke to all users
  socket.on('new-stroke', (stroke) => {
    savedStrokes.push(stroke);
    socket.broadcast.emit('receive-stroke', stroke);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

---

### 2. Update `client/src/hooks/useSocket.js`

Add stroke functions:

```javascript
export default function useSocket() {
  // ... existing code ...

  const emitStroke = useCallback((stroke) => {
    if (socket) {
      socket.emit('new-stroke', stroke);
    }
  }, [socket]);

  const onReceiveStroke = useCallback((callback) => {
    if (socket) {
      socket.on('receive-stroke', callback);
      return () => socket.off('receive-stroke', callback);
    }
  }, [socket]);

  const onLoadStrokes = useCallback((callback) => {
    if (socket) {
      socket.on('load-strokes', callback);
      return () => socket.off('load-strokes', callback);
    }
  }, [socket]);

  return {
    socket,
    connected,
    emitStroke,
    onReceiveStroke,
    onLoadStrokes
  };
}
```

---

### 3. Update `client/src/App.jsx`

Connect strokes to socket:

```jsx
useEffect(() => {
  const cleanup = onLoadStrokes((loadedStrokes) => {
    setInitialStrokes(loadedStrokes);
  });
  return cleanup;
}, [onLoadStrokes, setInitialStrokes]);

useEffect(() => {
  const cleanup = onReceiveStroke((stroke) => {
    addToHistory(stroke);
  });
  return cleanup;
}, [onReceiveStroke, addToHistory]);

const handleStrokesChange = (stroke) => {
  addToHistory(stroke);
  emitStroke(stroke);
};
```

---

### 4. Test Broadcasting

1. Start server and client
2. Open two browser tabs
3. Draw in tab 1
4. Should appear in tab 2

## Completion Checklist

- [x] Server broadcasts strokes
- [x] New users load existing strokes
- [x] Strokes sync across tabs

## Next Phase

→ [[Phase-2.4-Remote-Cursors]]
