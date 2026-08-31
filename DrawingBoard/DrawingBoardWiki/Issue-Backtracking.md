# Issue Backtracking Guide

> Quick reference for debugging issues by phase

## Symptoms → Likely Phase

| Symptom | Likely Phase | What to Check |
|---------|--------------|---------------|
| Server won't start | [[Phase-1-Setup-React\|Phase 1]] or [[Phase-2-Server-API\|Phase 2]] | `package.json`, port conflicts, missing express |
| React app won't load | [[Phase-1-Setup-React\|Phase 1]] or [[Phase-3-React-Canvas\|Phase 3]] | Vite config, npm install, port 5173 |
| Canvas blank | [[Phase-3-React-Canvas\|Phase 3]] | Canvas component, useEffect, ref |
| Drawing invisible | [[Phase-3-React-Canvas\|Phase 3]] | `ctx.stroke()` called, state updates |
| CORS error | [[Phase-2-Server-API\|Phase 2]] | CORS middleware, proxy config |
| API not responding | [[Phase-2-Server-API\|Phase 2]] | Server running, correct port |
| Colors wrong | [[Phase-4-Tools\|Phase 4]] | State updates, strokeStyle |
| Undo broken | [[Phase-5-State\|Phase 5]] | Stroke array state management |
| Strokes lost on reload | [[Phase-5-State\|Phase 5]] | API calls, fetch on mount |

## React-Specific Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `useRef is null` | Canvas not mounted | Check useEffect dependency |
| `useState not updating` | Stale closure | Use functional updates |
| `Event handler not firing` | Wrong event name | Check onMouseDown vs onClick |
| `Component not rendering` | Import error | Check component export/import |
| `Vite dev server error` | Config issue | Check vite.config.js |

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

Look at terminal where `node server.js` is running for error messages.

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

### Check Network Tab

- Filter by `XHR` to see API calls
- Red entries = failed requests
- Click request to see response

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

### "vite: command not found"

**Cause:** Vite not installed

**Fix:**
```bash
cd client
npm install
```

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
UI issues → Phase 6
```
