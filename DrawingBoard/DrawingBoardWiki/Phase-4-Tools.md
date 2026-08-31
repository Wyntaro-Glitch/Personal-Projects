# Phase 4: Drawing Tools (React)

> **Status:** ✅ Completed  
> **Priority:** Medium  
> **Depends On:** [[Phase-3-React-Canvas]]

## Objective

Add configurable drawing tools using React state.

## Why This Matters

Makes the canvas usable beyond basic black lines - real drawing apps need these controls.

## Deliverables

- [x] Brush size slider
- [x] Color picker input
- [x] Eraser mode
- [x] Tool selection UI

## Tasks

### 1. Create Toolbar Component

Create `client/src/components/Toolbar.jsx`:

```jsx
export default function Toolbar({ brushSize, setBrushSize, color, setColor, isEraser, setIsEraser, clearCanvas }) {
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
    </div>
  );
}
```

**What this does:**
- Creates UI controls above the canvas
- Range slider for brush size (1-50 pixels)
- Color picker for any color
- Buttons for eraser and clear

---

### 2. Update Canvas Component with State

```jsx
import { useRef, useEffect, useState } from 'react';

export default function Canvas({ brushSize, color, isEraser }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ border: '1px solid #000', cursor: 'crosshair' }}
    />
  );
}
```

**What each part does:**

| Control | Property Changed | Effect |
|---------|------------------|--------|
| Brush size slider | `ctx.lineWidth` | Thicker or thinner strokes |
| Color picker | `ctx.strokeStyle` | Changes stroke color |
| Eraser button | `isEraser` flag | Toggles eraser mode |

---

### 3. Update App.jsx

```jsx
import { useState } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

function App() {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);

  const clearCanvas = () => {
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
      />
      <Canvas brushSize={brushSize} color={color} isEraser={isEraser} />
    </div>
  );
}

export default App;
```

---

### 4. Add Styles

Update `client/src/index.css`:

```css
.toolbar {
  padding: 10px;
  background: #f0f0f0;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.toolbar button {
  padding: 5px 10px;
  cursor: pointer;
}

.toolbar button.active {
  background: #007bff;
  color: white;
}
```

## Completion Checklist

- [x] Brush size slider changes line thickness
- [x] Color picker changes stroke color
- [x] Eraser button toggles eraser mode
- [x] Clear button wipes canvas
- [x] UI looks clean and organized

## Verification

1. Start server: `cd server && npm start`
2. Start client: `cd client && npm run dev`
3. Open `http://localhost:5173`
4. Test each control:
   - Change slider → draw → thickness changes
   - Pick color → draw → color changes
   - Click eraser → draw → removes strokes
   - Click clear → canvas empties

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Slider doesn't affect size | Not updating lineWidth | Check brushSize state passed to Canvas |
| Color doesn't change | Not updating strokeStyle | Verify color state passed to Canvas |
| Eraser doesn't work | Drawing transparent | Use white color, not transparent |
| Clear doesn't work | Wrong canvas reference | Use document.querySelector |

## Next Phase

→ [[Phase-5-State-React]]
