# Phase 2: Server (API Only)

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-1-Setup-React]]

## Objective

Create Express server that only serves API endpoints (not static files).

## Why This Matters

Server now only handles data (strokes), not HTML. React handles all UI rendering.

## Deliverables

- [ ] Express server in `server/` folder
- [ ] CORS enabled for React dev server
- [ ] `GET /strokes` endpoint
- [ ] `POST /strokes` endpoint
- [ ] Server runs on port 3000

## Tasks

### 1. Update server.js

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let savedStrokes = [];

// API Endpoints
app.get('/strokes', (req, res) => {
  res.json(savedStrokes);
});

app.post('/strokes', (req, res) => {
  savedStrokes = req.body;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
```

**What this does:**
- Enables CORS for React dev server (port 5173)
- Parses JSON request bodies
- Provides GET/POST endpoints for strokes
- No static file serving (React handles that)

---

### 2. Update server/package.json

```json
{
  "name": "drawingboard-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^5.2.1"
  }
}
```

**What this does:** Adds start scripts and proper dependencies.

---

### 3. Test API Endpoints

Start server:
```bash
cd server
npm start
```

Test GET:
```bash
curl http://localhost:3000/strokes
```

Test POST:
```bash
curl -X POST http://localhost:3000/strokes \
  -H "Content-Type: application/json" \
  -d '[{"points":[{"x":0,"y":0}],"color":"#000","width":5}]'
```

## Completion Checklist

- [ ] Server starts without errors
- [ ] GET /strokes returns array
- [ ] POST /strokes saves data
- [ ] CORS enabled
- [ ] No static file serving

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS error | React on different port | Ensure `cors()` middleware added |
| Cannot POST | Missing JSON parser | Add `express.json()` middleware |
| Strokes not saving | Variable scope | Check `savedStrokes` is in global scope |

## Next Phase

→ [[Phase-3-React-Canvas]]
