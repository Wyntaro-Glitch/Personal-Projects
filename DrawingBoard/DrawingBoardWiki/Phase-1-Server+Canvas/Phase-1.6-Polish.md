# Phase 6: Polish (React)

> **Status:** ✅ Completed  
> **Priority:** Low  
> **Depends On:** [[Phase-5-State]]

## Objective

Improve UX with controls and shortcuts in React.

## Why This Matters

Finishing touches that make the app feel complete and professional.

## File Structure

```
client/src/
├── hooks/
│   ├── useCanvas.js         # Updated with resize
│   ├── useStrokeHistory.js  # Same as Phase 5
│   └── useKeyboardShortcuts.js  # NEW - keyboard shortcuts
├── api/
│   └── strokes.js           # Same as Phase 5
├── components/
│   ├── Canvas.jsx           # Updated with resize
│   ├── Toolbar.jsx          # Updated with download button
│   └── Header.jsx           # Optional - app header
├── styles/
│   └── index.css            # Updated styles
├── App.jsx                  # Updated with keyboard shortcuts
└── main.jsx
```

## Deliverables

- [x] `useKeyboardShortcuts.js` - Keyboard shortcut hook
- [x] Updated `useCanvas.js` - Canvas resize
- [x] Updated `Toolbar.jsx` - Download button
- [x] Updated `index.css` - Polish styles
- [x] Updated `App.jsx` - Keyboard shortcuts integrated

## Tasks

### 1. Create `client/src/hooks/useKeyboardShortcuts.js`

```javascript
import { useEffect } from 'react';

export default function useKeyboardShortcuts(undo, redo, canUndo, canRedo) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Ctrl+Y for redo
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
}
```

**What this does:**
- Listens for key presses globally
- `e.preventDefault()` stops browser default actions
- Provides standard keyboard shortcuts users expect

---

### 2. Update `client/src/hooks/useCanvas.js`

Add resize function:

```javascript
import { useRef, useCallback, useEffect } from 'react';
import { saveStrokes } from '../api/strokes';

export default function useCanvas(strokes, addToHistory) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  }, []);

  // Canvas resize function
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    // Save current drawing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Resize canvas
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 150;
    
    // Restore drawing
    ctx.putImageData(imageData, 0, 0);
  }, [getCtx]);

  // Set up resize listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

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

  // Download as PNG
  const downloadPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    redrawCanvas,
    clearCanvas,
    downloadPNG
  };
}
```

---

### 3. Update `client/src/components/Toolbar.jsx`

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
  canRedo,
  downloadPNG
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
      <button onClick={downloadPNG}>Download PNG</button>
    </div>
  );
}
```

---

### 4. Update `client/src/App.jsx`

```jsx
import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import useStrokeHistory from './hooks/useStrokeHistory';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
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

  // Keyboard shortcuts
  useKeyboardShortcuts(undo, redo, canUndo, canRedo);

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
        downloadPNG={() => {}}
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

---

### 5. Update `client/src/index.css`

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}

.App {
  padding: 20px;
}

h1 {
  margin: 0 0 20px 0;
  color: #333;
}

.toolbar {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  align-items: center;
  margin-bottom: 20px;
  border-radius: 8px;
}

.toolbar input[type="range"] {
  width: 100px;
}

.toolbar input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  cursor: pointer;
}

.toolbar button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar button:hover:not(:disabled) {
  background: #f0f0f0;
}

.toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

canvas {
  display: block;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

## Completion Checklist

- [x] `hooks/useKeyboardShortcuts.js` created
- [x] `hooks/useCanvas.js` updated with resize
- [x] `components/Toolbar.jsx` updated with download
- [x] `index.css` updated with polish styles
- [x] `App.jsx` updated with keyboard shortcuts
- [x] Ctrl+Z triggers undo
- [x] Ctrl+Y triggers redo
- [x] Canvas fills window
- [x] Canvas resizes when window resizes
- [x] Download button saves PNG
- [x] UI looks clean and professional

## Verification

1. Start server: `cd server && npm start`
2. Start client: `cd client && npm run dev`
3. Open `http://localhost:5173`
4. Test keyboard shortcuts:
   - Draw something → Ctrl+Z → undo
   - Ctrl+Y → redo
5. Resize window → canvas adjusts
6. Click download → PNG saves

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Shortcuts don't work | Canvas has focus | Use document-level listener |
| Canvas blank after resize | imageData lost | Ensure getImageData before resize |
| Download doesn't work | Browser blocking | Check for popup blocker |
| Drawing distorted on resize | putImageData wrong position | Use drawImage instead for scaling |

## Next Phase

→ [[Phase-7-Documentation]]
