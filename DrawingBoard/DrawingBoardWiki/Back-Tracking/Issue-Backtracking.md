# Issue Backtracking Guide

> Quick reference for debugging issues by phase
> 
> **Last Updated:** 2026-09-02

## Symptoms → Likely Phase

| Symptom | Likely Phase | What to Check |
|---------|--------------|---------------|
| Server won't start | Phase 1 | `package.json`, port conflicts, missing express |
| React app won't load | Phase 1 | Vite config, npm install, port 5173 |
| Canvas blank | Phase 3 | Canvas component, useEffect, ref |
| Drawing invisible | Phase 3 | `ctx.stroke()` called, state updates |
| CORS error | Phase 2 | CORS middleware, proxy config |
| API not responding | Phase 2 | Server running, correct port |
| Colors wrong | Phase 5 | State updates, strokeStyle |
| Undo broken | Phase 5 | Stroke array state management |
| Strokes lost on reload | Phase 4 | Room storage, API calls |
| Socket disconnect on join | Phase 4 | React.StrictMode, socket lifecycle |
| Strokes in wrong room | Phase 4 | Room isolation, canvas clearing |
| Strokes don't reflect to other users | Phase 4/6 | Layer ID mismatch, socket rejoin |

## Recent Bug Fixes

### Socket Disconnect on Room Join

**Date:** 2026-08-31  
**Phase:** Phase 4 (Rooms)  
**Severity:** Critical

**Symptom:** User disconnects immediately after joining a room.

**Root Cause:** `React.StrictMode` in development mode causes components to mount → unmount → remount, which closes the socket connection.

**Fix:** Removed `React.StrictMode` from `client/src/main.jsx`

**Files Changed:**
- `client/src/main.jsx` - Removed StrictMode wrapper
- `client/src/hooks/useSocket.js` - Fixed socket lifecycle to not recreate on userInfo change

**Server Logs:**
```
[Socket] Connected: abc123
[Socket] join-room: abc123 -> room123
[Socket] Disconnected: abc123 | Reason: client namespace disconnect
```

**Prevention:**
- Don't use React.StrictMode with Socket.io
- Use refs for socket connections
- Don't put socket in useEffect dependencies

---

### Strokes Appearing in Wrong Room

**Date:** 2026-08-31  
**Phase:** Phase 4 (Rooms)  
**Severity:** High

**Symptom:** Drawing in Room A shows strokes in Room B.

**Root Cause:** Canvas and strokes not being cleared when switching rooms.

**Fix:** Clear canvas and stroke history on room switch.

**Files Changed:**
- `client/src/App.jsx` - Added room switch cleanup
- `server/server.js` - Per-room stroke storage

**Prevention:**
- Always clear state when changing context
- Use room-specific storage
- Test multi-room scenarios

---

### Guest Account Cleanup

**Date:** 2026-08-31  
**Phase:** Phase 3 (Auth)  
**Severity:** Medium

**Symptom:** Guest accounts not deleted on disconnect.

**Root Cause:** Disconnect handler not properly tracking guest users.

**Fix:** Added guestUsers Map to track guest socket IDs.

**Files Changed:**
- `server/server.js` - Added guest user tracking

---

### Users Dropdown Hover Issue

**Date:** 2026-08-31  
**Phase:** UI Enhancements  
**Severity:** Medium

**Symptom:** Dropdown closes when moving mouse to buttons.

**Root Cause:** Mouse events on trigger only, dropdown outside event bounds.

**Fix:** Added invisible bridge area using ::before pseudo-element.

**Files Changed:**
- `client/src/index.css` - Added bridge area for dropdown

---

### Room Name Color in List

**Date:** 2026-08-31  
**Phase:** UI Enhancements  
**Severity:** Low

**Symptom:** Room names showing in white text.

**Root Cause:** CSS specificity issue, room-info styles conflicting.

**Fix:** Scoped styles with .room-list prefix, set color to #333.

**Files Changed:**
- `client/src/index.css` - Fixed room name color

---

### Strokes Don't Reflect to Other Users

**Date:** 2026-09-02  
**Phase:** Phase 4 (Rooms) + Phase 6 (Layers)  
**Severity:** Critical

**Symptom:** User draws in a room, but the other user sees nothing. Socket is connected, server broadcasts `receive-stroke`, but the stroke never appears on the other client's canvas.

**Root Cause (two issues):**

1. **Layer ID mismatch:** Each client generated its own random layer IDs via `crypto.randomUUID()` in `useLayers.js`. User A's "Layer 1" had ID `aaa-111`, User B's had `bbb-222`. When User A sent a stroke with `layerId: aaa-111`, `addStrokeToLayer` on User B couldn't find that layer and silently dropped the stroke.

2. **Socket room not re-joined after server cold start:** On Render free tier, the server restarts after inactivity (cold start). The server loses all `currentRoomId` state. The client socket reconnects, but the `join-room` effect only ran when the `socket` reference changed — and the same socket instance reconnects, so the room was never re-joined. Server logs showed `new-stroke DROPPED - no currentRoomId`.

**Fix:**

1. **Server-side default layers** (`server/routes/rooms.js`): Room creation now generates default layers (paper + Layer 1) with server-side IDs stored in MongoDB. All clients load the same layer IDs from the DB. Existing rooms are backfilled with default layers on first access.

2. **Client fallback** (`client/src/hooks/useLayers.js`): `addStrokeToLayer` now falls back to the first available non-paper layer if the `layerId` isn't found, instead of silently dropping.

3. **Room re-join on reconnect** (`client/src/App.jsx`): Added `connected` to the `join-room` effect dependencies so it re-emits `join-room` every time the socket connects/reconnects, covering server cold starts.

**Files Changed:**
- `server/routes/rooms.js` - Server-generated default layers, backfill for existing rooms
- `client/src/hooks/useLayers.js` - `addStrokeToLayer` fallback for unknown layer IDs
- `client/src/App.jsx` - Re-join room on socket reconnect (added `connected` dependency)

**Debugging Steps (for similar issues):**
1. Check Render backend logs for `[Socket] Room ... has X sockets` — if only 1 socket, the other client never joined
2. Check for `[Socket] new-stroke DROPPED - no currentRoomId` — means socket reconnected but room wasn't re-joined
3. Add `console.log` in the `onReceiveStroke` callback in App.jsx to verify the event arrives client-side
4. Check `addStrokeToLayer` — if the layer ID doesn't match, the stroke is silently dropped

**Prevention:**
- Always generate shared state (like layer IDs) on the server, not independently per client
- Handle socket reconnection explicitly — don't assume room membership persists across reconnects
- Never silently drop data — log warnings when expected state is missing

---

| Symptom | Cause | Fix |
|---------|-------|-----|
| `useRef is null` | Canvas not mounted | Check useEffect dependency |
| `useState not updating` | Stale closure | Use functional updates |
| `Event handler not firing` | Wrong event name | Check onMouseDown vs onClick |
| `Component not rendering` | Import error | Check component export/import |
| `Vite dev server error` | Config issue | Check vite.config.js |
| `Socket disconnects on mount` | React.StrictMode | Remove StrictMode |

## Debugging Flowchart

```
Issue occurs
    ↓
Identify symptom from table above
    ↓
Go to that phase's wiki page
    ↓
Check "Common Issues" section
    ↓
Follow "Debugging Flowchart" in that phase
    ↓
Still stuck? Check server logs in terminal
```

## Terminal Debugging

### Check if server is running

```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

### Check server logs

Look at terminal where `npm start` is running for error messages.

### Test API endpoints manually

```bash
# Test GET
curl http://localhost:3000/strokes

# Test POST
curl -X POST http://localhost:3000/strokes \
  -H "Content-Type: application/json" \
  -d '[]'
```

## Browser Debugging

### Open Developer Tools

- Windows/Linux: `F12` or `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

### Check Console Tab

Look for JavaScript errors. Common ones:

| Error | Cause | Fix |
|-------|-------|-----|
| `Uncaught TypeError: Cannot read property` | Variable is null | Check element exists |
| `Failed to fetch` | Server not running | Start server |
| `SyntaxError: Unexpected token` | JSON parse error | Check POST data format |
| `CORS policy` | Missing CORS | Check server middleware |
| `client namespace disconnect` | Socket closed | Check React.StrictMode |

### Check Network Tab

- Filter by `XHR` to see API calls
- Red entries = failed requests
- Click request to see response

## Socket.io Debugging

### Common Socket Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `client namespace disconnect` | React.StrictMode | Remove from main.jsx |
| `transport error` | Network issue | Check connection |
| `timeout` | Server not responding | Check server logs |
| `connect_error` | Connection refused | Verify server running |

### Socket Debug Logging

Server logs to watch:
```
[Socket] Connected: <id>
[Socket] join-room: <id> -> <roomId>
[Socket] Disconnected: <id> | Reason: <reason>
```

Client logs (F12 console):
```
[Socket] Connected: <id>
[Socket] Disconnected, reason: <reason>
```

## Common Error Messages

### "Port 3000 already in use"

**Cause:** Another process using the port

**Fix:** Change port in server.js:
```javascript
const PORT = 3001; // Change from 3000
```

### "Cannot find module 'express'"

**Cause:** Express not installed

**Fix:**
```bash
cd server
npm install
```

### "ECONNREFUSED"

**Cause:** Server not running or wrong port

**Fix:**
1. Check server is running
2. Verify port number matches

### "Access to fetch blocked by CORS policy"

**Cause:** Missing CORS middleware

**Fix:**
```bash
cd server
npm install cors
```

Then add to server.js:
```javascript
const cors = require('cors');
app.use(cors());
```

### "client namespace disconnect"

**Cause:** Socket.io client disconnected intentionally

**Fix:**
1. Remove React.StrictMode
2. Check socket lifecycle in useSocket.js
3. Ensure socket not recreated on re-renders

## Phase-Specific Debugging

### Phase 1: Project Setup

```bash
# Verify node installed
node --version

# Verify npm installed
npm --version

# Check server folder
ls server/package.json

# Check client folder
ls client/package.json
```

### Phase 2: Server Issues

```bash
# Test server
cd server
npm start

# Test API
curl http://localhost:3000/strokes
```

### Phase 3-4: React Canvas Issues

```javascript
// Add to Canvas component to debug
useEffect(() => {
  console.log('Canvas ref:', canvasRef.current);
  console.log('Context:', canvasRef.current?.getContext('2d'));
}, []);

// Check if events are firing
const startDrawing = (e) => {
  console.log('mousedown at', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  // ... rest of code
};
```

### Phase 5: State Issues

```javascript
// Add to verify strokes are being saved
console.log('Strokes array:', strokes);
console.log('Current stroke:', currentStroke);

// Check server response
fetch('/strokes')
  .then(r => r.json())
  .then(data => console.log('Server strokes:', data));
```

## Getting Help

1. Check terminal for error messages
2. Check browser console (F12)
3. Verify each phase's completion checklist
4. Search error message online
5. Ask with specific error message and context

## Quick Reference Card

```
Server issues → Phase 1-2
React issues → Phase 1, 3
Canvas issues → Phase 3-4
API issues → Phase 2
State issues → Phase 5
Socket issues → Phase 4
Room issues → Phase 4
UI issues → Sidebar
```
