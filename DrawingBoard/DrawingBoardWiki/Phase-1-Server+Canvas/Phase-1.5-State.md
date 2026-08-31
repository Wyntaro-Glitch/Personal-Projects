# Phase 5: State Management (React)

> **Status:** ✅ Completed  
> **Priority:** Medium  
> **Depends On:** [[Phase-4-Tools]]

## Objective

Enable undo/redo and persist strokes to server memory using React hooks.

## Why This Matters

Prevents data loss and enables persistence across page reloads. Without this, closing the browser loses everything.

## File Structure

```
client/src/
├── hooks/
│   ├── useCanvas.js         # Drawing logic
│   └── useStrokeHistory.js  # Undo/redo logic
├── api/
│   └── strokes.js           # API calls
├── components/
│   ├── Canvas.jsx           # Updated with hooks
│   └── Toolbar.jsx          # Updated with undo/redo buttons
└── App.jsx                  # Updated with state
```

## Deliverables

- [x] `useCanvas.js` - Custom hook for drawing
- [x] `useStrokeHistory.js` - Undo/redo logic
- [x] `strokes.js` - API calls
- [x] Updated `Canvas.jsx` - Uses hooks
- [x] Updated `Toolbar.jsx` - Undo/redo buttons
- [x] Updated `App.jsx` - State management

## Tasks

### 1. Create `client/src/api/strokes.js`

```javascript
const API_URL = 'http://localhost:3000';

export async function saveStrokes(strokes) {
  try {
    const response = await fetch(`${API_URL}/strokes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strokes)
    });
    return await response.json();
  } catch (err) {
    console.error('Save failed:', err);
  }
}

export async function loadStrokes() {
  try {
    const response = await fetch(`${API_URL}/strokes`);
    return await response.json();
  } catch (err) {
    console.error('Load failed:', err);
    return [];
  }
}
```

**What this does:**
- `saveStrokes()` - Sends strokes to server
- `loadStrokes()` - Fetches strokes from server
- Centralized API logic

---

### 2. Create `client/src/hooks/useStrokeHistory.js`

```javascript
import { useState, useCallback } from 'react';

export default function useStrokeHistory() {
  const [strokes, setStrokes] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  const addToHistory = useCallback((stroke) => {
    setStrokes(prev => [...prev, stroke]);
    setUndoStack([]); // Clear redo stack on new action
  }, []);

  const undo = useCallback(() => {
    if (strokes.length === 0) return null;
    const lastStroke = strokes[strokes.length - 1];
    setStrokes(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, lastStroke]);
    return lastStroke;
  }, [strokes]);

  const redo = useCallback(() => {
    if (undoStack.length === 0) return null;
    const stroke = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setStrokes(prev => [...prev, stroke]);
    return stroke;
  }, [undoStack]);

  const clearHistory = useCallback(() => {
    setStrokes([]);
    setUndoStack([]);
  }, []);

  const setInitialStrokes = useCallback((initialStrokes) => {
    setStrokes(initialStrokes);
    setUndoStack([]);
  }, []);

  return {
    strokes,
    undo,
    redo,
    addToHistory,
    clearHistory,
    setInitialStrokes,
    canUndo: strokes.length > 0,
    canRedo: undoStack.length > 0
  };
}
```

**What each function does:**

| Function | What It Does | Why It Matters |
|----------|--------------|----------------|
| `addToHistory()` | Adds new stroke | Tracks drawing |
| `undo()` | Removes last stroke | Reverses action |
| `redo()` | Reapplies undone stroke | Restores action |
| `clearHistory()` | Empties all stacks | Fresh start |
| `setInitialStrokes()` | Loads saved strokes | Persistence |

---

### 3. Create `client/src/hooks/useCanvas.js`

```javascript
import { useRef, useCallback } from 'react';
import { saveStrokes } from '../api/strokes';

export default function useCanvas(strokes, addToHistory) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  }, []);

  const startDrawing = useCallback((e, brushSize, color, isEraser) => {
    const ctx = getCtx();
    if (!ctx) return;

    isDrawingRef.current = true;
    currentStrokeRef.current = {
      points: [],
      color: isEraser ? '#FFFFFF' : color,
      width: brushSize
    };

    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    currentStrokeRef.current.points.push({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
  }, [getCtx]);

  const draw = useCallback((e) => {
    if (!isDrawingRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    currentStrokeRef.current.points.push({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
  }, [getCtx]);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      addToHistory(currentStrokeRef.current);
      currentStrokeRef.current = null;
    }
  }, [addToHistory]);

  const redrawCanvas = useCallback((strokesToRedraw) => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesToRedraw.forEach(stroke => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }, [getCtx]);

  const clearCanvas = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [getCtx]);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    redrawCanvas,
    clearCanvas
  };
}
```

**What this does:**
- Encapsulates all canvas logic
- Tracks current stroke
- Provides redraw function for undo/redo

---

### 4. Update `client/src/components/Canvas.jsx`

```jsx
import { useEffect } from 'react';
import useCanvas from '../hooks/useCanvas';

export default function Canvas({ brushSize, color, isEraser, strokes, onStrokesChange }) {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    redrawCanvas
  } = useCanvas(strokes, onStrokesChange);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 600;
    }
  }, [canvasRef]);

  useEffect(() => {
    redrawCanvas(strokes);
  }, [strokes, redrawCanvas]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={(e) => startDrawing(e, brushSize, color, isEraser)}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ border: '1px solid #000', cursor: 'crosshair' }}
    />
  );
}
```

---

### 5. Update `client/src/components/Toolbar.jsx`

```jsx
export default function Toolbar({
  brushSize,
  setBrushSize,
  color,
  setColor,
  isEraser,
  setIsEraser,
  clearCanvas,
  undo,
  redo,
  canUndo,
  canRedo
}) {
  return (
    <div className="toolbar">
      <input
        type="range"
        min="1"
        max="50"
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          setIsEraser(false);
        }}
      />
      <button
        className={isEraser ? 'active' : ''}
        onClick={() => setIsEraser(!isEraser)}
      >
        Eraser
      </button>
      <button onClick={clearCanvas}>Clear</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
}
```

---

### 6. Update `client/src/App.jsx`

```jsx
import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import useStrokeHistory from './hooks/useStrokeHistory';
import { saveStrokes, loadStrokes } from './api/strokes';

function App() {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);

  const {
    strokes,
    undo,
    redo,
    addToHistory,
    clearHistory,
    setInitialStrokes,
    canUndo,
    canRedo
  } = useStrokeHistory();

  // Load strokes on mount
  useEffect(() => {
    async function init() {
      const savedStrokes = await loadStrokes();
      if (savedStrokes.length > 0) {
        setInitialStrokes(savedStrokes);
      }
    }
    init();
  }, [setInitialStrokes]);

  // Save strokes when they change
  useEffect(() => {
    if (strokes.length > 0) {
      saveStrokes(strokes);
    }
  }, [strokes]);

  const handleStrokesChange = (stroke) => {
    addToHistory(stroke);
  };

  const clearCanvas = () => {
    clearHistory();
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="App">
      <h1>Drawing Board</h1>
      <Toolbar
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        color={color}
        setColor={setColor}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        clearCanvas={clearCanvas}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <Canvas
        brushSize={brushSize}
        color={color}
        isEraser={isEraser}
        strokes={strokes}
        onStrokesChange={handleStrokesChange}
      />
    </div>
  );
}

export default App;
```

## Completion Checklist

- [x] `api/strokes.js` created
- [x] `hooks/useStrokeHistory.js` created
- [x] `hooks/useCanvas.js` created
- [x] `Canvas.jsx` updated
- [x] `Toolbar.jsx` updated with undo/redo buttons
- [x] `App.jsx` updated with state management
- [x] Undo button works
- [x] Redo button works
- [x] Strokes save to server
- [x] Strokes reload on page refresh

## Verification

1. Start server: `cd server && npm start`
2. Start client: `cd client && npm run dev`
3. Open `http://localhost:5173`
4. Draw something
5. Click Undo → last stroke removed
6. Click Redo → stroke reappears
7. Refresh page → drawing persists

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Undo doesn't work | Not using hook | Check useStrokeHistory imported |
| Strokes lost on reload | API URL wrong | Check localhost:3000 |
| Canvas blank on load | Not calling redrawCanvas | Check useEffect in Canvas.jsx |
| Save fails | Server not running | Start server first |

## Next Phase

→ [[Phase-6-Polish]]
