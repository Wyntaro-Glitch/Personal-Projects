# Phase 3: React App + Canvas

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-2-Server-API]]

## Objective

Create React app with Canvas component for drawing.

## Why This Matters

This is the core UI - React manages the canvas state and renders drawings.

## Deliverables

- [ ] React app runs at localhost:5173
- [ ] Canvas component renders
- [ ] Mouse events trigger drawing
- [ ] Lines appear on canvas
- [ ] Connected to API server

## Tasks

### 1. Create Canvas Component

Create `client/src/components/Canvas.jsx`:

```jsx
import { useRef, useEffect, useState } from 'react';

export default function Canvas() {
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

**What this does:**
- Uses React ref to access canvas element
- Handles mouse events for drawing
- State tracks if user is currently drawing

---

### 2. Update App.jsx

```jsx
import Canvas from './components/Canvas';

function App() {
  return (
    <div className="App">
      <h1>Drawing Board</h1>
      <Canvas />
    </div>
  );
}

export default App;
```

---

### 3. Update client/package.json

Add proxy for API server:

```json
{
  "name": "drawingboard-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  },
  "proxy": "http://localhost:3000"
}
```

**What this does:** Forwards API requests to Express server.

---

### 4. Update vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
```

---

### 5. Test Integration

Start both servers:

**Terminal 1 - Server:**
```bash
cd server
npm start
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

Open `http://localhost:5173` and draw.

## Completion Checklist

- [ ] React app loads at localhost:5173
- [ ] Canvas renders on page
- [ ] Drawing works with mouse
- [ ] Lines are smooth
- [ ] No console errors

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Canvas blank | Missing useEffect | Ensure canvas dimensions set |
| Drawing jagged | Missing lineCap | Add `ctx.lineCap = 'round'` |
| CORS error | Proxy not set | Check proxy in package.json |
| Port conflict | Both on same port | Vite uses 5173, Express uses 3000 |

## Next Phase

→ [[Phase-4-Tools]]
