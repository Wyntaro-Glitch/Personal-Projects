# Phase 2.2: Socket Client Connection

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** [[Phase-2.1-Socket-Server]]

## Objective

Create React hook to connect client to Socket.io server.

## Why This Matters

Client needs to establish connection before any real-time features can work.

## Deliverables

- [ ] socket.io-client installed
- [ ] `useSocket.js` hook created
- [ ] Connection status tracked
- [ ] Basic emit/listen functions ready

## Tasks

### 1. Install Socket.io Client

```bash
cd client
npm install socket.io-client
```

---

### 2. Create `client/src/hooks/useSocket.js`

```javascript
import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    return () => newSocket.close();
  }, []);

  const emit = useCallback((event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  }, [socket]);

  const on = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
  }, [socket]);

  return {
    socket,
    connected,
    emit,
    on
  };
}
```

---

### 3. Update `client/src/App.jsx`

Add socket connection:

```jsx
import useSocket from './hooks/useSocket';

function App() {
  const { socket, connected } = useSocket();

  return (
    <div className="App">
      <h1>Drawing Board {connected ? '🟢' : '🔴'}</h1>
      {/* Rest of components */}
    </div>
  );
}
```

---

### 4. Test Connection

1. Start server: `cd server && npm start`
2. Start client: `cd client && npm run dev`
3. Open browser console
4. Should see: "Connected to server"

## Completion Checklist

- [x] socket.io-client installed
- [x] `useSocket.js` created
- [x] Connection status shows in UI
- [x] Console shows connection log

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Not connecting | Wrong URL | Check localhost:3000 |
| CORS error | Missing config | Check server CORS settings |

## Next Phase

→ [[Phase-2.3-Broadcast-Strokes]]
