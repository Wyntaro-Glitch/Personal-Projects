# Issue Backtracking Guide

> Quick reference for debugging issues by phase

## Symptoms → Likely Phase

| Symptom | Likely Phase | What to Check |
|---------|--------------|---------------|
| Server won't start | [[Phase-1-Setup\|Phase 1]] or [[Phase-2-Server\|Phase 2]] | `package.json`, port conflicts, missing express |
| Page won't load in browser | [[Phase-2-Server\|Phase 2]] | Static file path, server actually running |
| Canvas blank | [[Phase-3-Canvas\|Phase 3]] | Event listeners, canvas element exists in DOM |
| Drawing invisible | [[Phase-3-Canvas\|Phase 3]] | `ctx.stroke()` called, `ctx.beginPath()` used |
| Colors wrong | [[Phase-4-Tools\|Phase 4]] | `ctx.strokeStyle` updated before drawing |
| Undo broken | [[Phase-5-State\|Phase 5]] | Stroke array state management |
| Strokes lost on reload | [[Phase-5-State\|Phase 5]] | Server endpoints, fetch on load |
| Keyboard shortcuts don't fire | [[Phase-6-Polish\|Phase 6]] | Canvas has focus, use document listener |

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
npm install express
```

### "ECONNREFUSED"

**Cause:** Server not running or wrong port

**Fix:**
1. Check server is running
2. Verify port number matches

### "SyntaxError: Unexpected token < in JSON"

**Cause:** Server returning HTML instead of JSON

**Fix:**
1. Check you're calling correct endpoint
2. Verify server returns JSON

## Phase-Specific Debugging

### Phase 1-2: Server Issues

```bash
# Verify node installed
node --version

# Verify npm installed
npm --version

# Check package.json exists
cat package.json

# Check node_modules exists
ls node_modules/express
```

### Phase 3-4: Canvas Issues

```javascript
// Add to console to verify canvas exists
console.log('Canvas:', document.getElementById('canvas'));
console.log('Context:', ctx);

// Check if events are firing
canvas.addEventListener('mousedown', (e) => {
  console.log('mousedown at', e.offsetX, e.offsetY);
});
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
Canvas issues → Phase 3-4
Drawing issues → Phase 4
State issues → Phase 5
UI issues → Phase 6
```
