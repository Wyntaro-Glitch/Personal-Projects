# Phase 5: State Management

> **Status:** ⬜ Not Started  
> **Priority:** Medium  
> **Depends On:** [[Phase-4-Tools]]

## Objective

Enable undo/redo and persist strokes to server memory.

## Why This Matters

Prevents data loss and enables persistence across page reloads. Without this, closing the browser loses everything.

## Deliverables

- [ ] `undo` restores previous canvas state
- [ ] `redo` reapplies undone stroke
- [ ] `clear` wipes canvas
- [ ] Server stores strokes array in memory
- [ ] On page load, strokes reload from server

## Tasks

### 1. Create Stroke Data Structure

```javascript
// Array to store all strokes
let strokes = [];
let currentStroke = null;

// Each stroke is an object:
// {
//   points: [{x, y}, {x, y}, ...],
//   color: '#000000',
//   width: 5
// }
```

**What this does:**
- Organizes drawing data for saving/loading
- Each stroke tracks its points, color, and width
- Array preserves order of strokes

---

### 2. Update mousedown to Start Stroke

```javascript
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  currentStroke = {
    points: [],
    color: isEraser ? '#FFFFFF' : currentColor,
    width: ctx.lineWidth
  };
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
  currentStroke.points.push({x: e.offsetX, y: e.offsetY});
});
```

**What this does:**
- Creates new stroke object when user starts drawing
- Records first point
- Stores color and width for this stroke

---

### 3. Update mousemove to Record Points

```javascript
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  currentStroke.points.push({x: e.offsetX, y: e.offsetY});
});
```

**What this does:**
- Adds each point to stroke data as user draws
- Visual rendering happens immediately
- Data is captured for saving

---

### 4. Update mouseup to Save Stroke

```javascript
canvas.addEventListener('mouseup', () => {
  drawing = false;
  if (currentStroke && currentStroke.points.length > 0) {
    strokes.push(currentStroke);
    currentStroke = null;
    saveToServer();
  }
});
```

**What this does:**
- Adds completed stroke to strokes array
- Clears current stroke reference
- Triggers save to server

---

### 5. Implement Undo/Redo

```javascript
let undoStack = [];
let redoStack = [];

function undo() {
  if (strokes.length === 0) return;
  const lastStroke = strokes.pop();
  undoStack.push(lastStroke);
  redrawCanvas();
}

function redo() {
  if (undoStack.length === 0) return;
  const stroke = undoStack.pop();
  strokes.push(stroke);
  redrawCanvas();
}

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes.forEach(stroke => {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    stroke.points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  });
}
```

**What each function does:**

| Function | What It Does | Why It Matters |
|----------|--------------|----------------|
| `undo()` | Moves last stroke to undo stack | Reverses last action |
| `redo()` | Moves stroke back from undo stack | Reapplies undone action |
| `redrawCanvas()` | Clears and redraws all strokes | Ensures visual matches data |

---

### 6. Add Undo/Redo Buttons

```html
<button id="undoBtn">Undo</button>
<button id="redoBtn">Redo</button>
```

```javascript
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);
```

---

### 7. Create Server Endpoints

Update `server.js`:

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json()); // Enable JSON parsing

let savedStrokes = [];

// GET endpoint to retrieve strokes
app.get('/strokes', (req, res) => {
  res.json(savedStrokes);
});

// POST endpoint to save strokes
app.post('/strokes', (req, res) => {
  savedStrokes = req.body;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

**What this does:**
- `GET /strokes` - Returns all saved strokes as JSON
- `POST /strokes` - Receives and stores strokes array
- `savedStrokes` array keeps data in server memory

---

### 8. Save Strokes to Server

```javascript
async function saveToServer() {
  try {
    await fetch('/strokes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strokes)
    });
  } catch (err) {
    console.error('Save failed:', err);
  }
}
```

**What this does:**
- Sends strokes array to server as JSON
- Called after each stroke completes
- Server stores in memory

---

### 9. Load Strokes on Page Load

```javascript
async function loadFromServer() {
  try {
    const response = await fetch('/strokes');
    strokes = await response.json();
    redrawCanvas();
  } catch (err) {
    console.error('Load failed:', err);
  }
}

// Call on page load
window.addEventListener('load', loadFromServer);
```

**What this does:**
- Fetches strokes from server when page loads
- Rebuilds canvas from saved data
- Provides persistence across reloads

## Completion Checklist

- [ ] Undo button works
- [ ] Redo button works
- [ ] Clear button works
- [ ] Strokes save to server after each stroke
- [ ] Strokes reload on page refresh
- [ ] No data loss on reload

## Verification

1. Start server: `node server.js`
2. Open `http://localhost:3000/index.html`
3. Draw something
4. Refresh page → drawing should persist
5. Click undo → last stroke removed
6. Click redo → stroke reappears

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Undo doesn't work | Not tracking strokes array | Ensure strokes are added on mouseup |
| Strokes lost on reload | Server endpoints missing | Check GET/POST routes |
| Canvas blank on load | Not calling redrawCanvas | Ensure redrawCanvas() in loadFromServer |
| Save fails | fetch() error | Check server is running, endpoints exist |

## Debugging Flowchart

```
Strokes not persisting
    ↓
Is saveToServer() called?
    ↓
├── No → Check mouseup handler
└── Yes → Is server receiving?
    ↓
    ├── No → Check fetch URL
    └── Yes → Is server storing?
        ↓
        ├── No → Check savedStrokes array
        └── Yes → Is loadFromServer() called?
            ↓
            ├── No → Add window load listener
            └── Yes → Check response parsing
```

## Next Phase

→ [[Phase-6-Polish]]
