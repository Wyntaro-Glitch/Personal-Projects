# Phase 2: Server Layer

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-1-Setup]]

## Objective

Create a web server that serves static files to the browser.

## Why This Matters

The server must serve your HTML/JS files to the browser and provide API endpoints for saving strokes. Without this, the browser can't load your canvas application.

## Deliverables

- [ ] Express server listening on port 3000
- [ ] Static file serving from `public/`
- [ ] `node server.js` launches without errors

## Tasks

### 1. Create server.js

Create file `server.js` in project root.

**What this does:** This is your server's main file - it defines how HTTP requests are handled.

---

### 2. Import Express Module

```javascript
const express = require('express');
```

**What this does:**
- Loads the Express library into your script
- Without this line, `express()` function doesn't exist
- `require()` is Node.js way of importing libraries

---

### 3. Create Express App

```javascript
const app = express();
```

**What this does:**
- Creates an Express application instance
- This object has methods for handling routes, middleware, etc.

---

### 4. Configure Static File Middleware

```javascript
app.use(express.static('public'));
```

**What this does:**
- Tells Express to serve files from `public/` folder
- When browser requests `/index.html` → server returns the actual file
- Also serves CSS, JS, images automatically

---

### 5. Set Port and Start Server

```javascript
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

**What this does:**
- `app.listen()` starts the server and binds to port 3000
- Callback function runs when server is ready
- Server now accepts incoming HTTP connections

---

### 6. Test the Server

Run in terminal:
```bash
node server.js
```

Open browser to `http://localhost:3000`

**What this does:**
- Starts the Node.js process
- Server begins listening for connections
- You should see the console log message

## File Structure After This Phase

```
DrawingBoard/
├── server.js          # NEW - your server
├── package.json       # from Phase 1
├── node_modules/      # from Phase 1
└── public/            # empty for now
```

## Completion Checklist

- [ ] `server.js` exists
- [ ] `node server.js` starts without errors
- [ ] Console shows "Server running at http://localhost:3000"
- [ ] Browser can connect to localhost:3000 (shows directory listing or 404)

## Verification Commands

**Start server:**
```bash
node server.js
```

**Test in another terminal:**
```bash
curl http://localhost:3000
```

Should return HTML or directory listing.

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `port already in use` | Another process using port 3000 | Change PORT constant to 3001 |
| `Cannot find module 'express'` | Not installed or wrong directory | Run `npm install express` again |
| `express is not defined` | Typo in require statement | Check spelling: `express` not `Express` |

## Debugging Flowchart

```
Server won't start
    ↓
Check error message
    ↓
├── "port in use" → Change PORT number
├── "module not found" → Run npm install
└── "syntax error" → Check server.js for typos
```

## Next Phase

→ [[Phase-3-Canvas]]
