# Phase 3: Canvas Frontend

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-2-Server]]

## Objective

Build a working HTML5 Canvas that responds to mouse input.

## Why This Matters

Core drawing functionality - without this, nothing renders. This is the heart of the application.

## Deliverables

- [ ] Full-viewport canvas element
- [ ] Mouse down → start stroke
- [ ] Mouse move → draw stroke
- [ ] Mouse up → end stroke
- [ ] Lines render smoothly

## Tasks

### 1. Create public/index.html

Create file `public/index.html`.

**What this does:** This is your main HTML page that the server serves to browsers.

---

### 2. Add Canvas Element

```html
<canvas id="canvas"></canvas>
```

**What this does:**
- Creates an HTML5 Canvas element
- This is the drawing surface - an element that JavaScript can manipulate
- Has a coordinate system (x, y) for drawing

---

### 3. Style the Canvas

```css
canvas {
  border: 1px solid #000;
  cursor: crosshair;
}
```

**What this does:**
- Adds visible border so you can see canvas boundaries
- Changes cursor to crosshair for drawing precision

---

### 4. Get Canvas Context

```javascript
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
```

**What this does:**
- Finds canvas element in DOM by ID
- Gets 2D drawing context - the API for all drawing commands
- All lines, colors, shapes go through `ctx` object

---

### 5. Track Mouse Events

```javascript
let drawing = false;

canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

canvas.addEventListener('mouseup', () => drawing = false);
```

**What each part does:**

| Event | What It Does | Why It Matters |
|-------|--------------|----------------|
| `mousedown` | Detects when user clicks | Tells your code "user started drawing" |
| `mousemove` | Detects mouse movement | Draws line segments while clicking |
| `mouseup` | Detects when user releases click | Tells your code "user finished this stroke" |
| `beginPath()` | Starts a new line path | Prevents connecting to previous stroke |
| `moveTo()` | Moves pen to starting point | Sets where stroke begins |
| `lineTo()` | Adds point to current path | Extends the line to new position |
| `stroke()` | Renders the path visibly | Actually draws the pixels on canvas |

---

### 6. Set Canvas Size

```javascript
canvas.width = 800;
canvas.height = 600;
```

**What this does:**
- Sets canvas dimensions in pixels
- Can also use CSS to display at different size
- Actual pixel count determines drawing resolution

## Complete Example Code

```html
<!DOCTYPE html>
<html>
<head>
  <title>Canvas Drawing</title>
  <style>
    canvas { border: 1px solid #000; cursor: crosshair; }
  </style>
</head>
<body>
  <canvas id="canvas" width="800" height="600"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    
    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });
    
    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    });
    
    canvas.addEventListener('mouseup', () => drawing = false);
  </script>
</body>
</html>
```

## Completion Checklist

- [ ] `public/index.html` exists
- [ ] Canvas element renders in browser
- [ ] Clicking and dragging draws lines
- [ ] Lines are visible (black by default)

## Verification

1. Start server: `node server.js`
2. Open `http://localhost:3000/index.html`
3. Click and drag on canvas
4. Lines should appear

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Canvas blank | No context or wrong ID | Check `getElementById` matches canvas ID |
| Nothing draws | Missing `stroke()` call | Ensure `ctx.stroke()` is called in mousemove |
| Lines jagged | Drawing every pixel | Add smoothing or use `lineTo` properly |
| Drawing starts at wrong point | Using `pageX/pageY` | Use `offsetX/offsetY` for canvas-relative coords |

## Debugging Flowchart

```
Nothing draws
    ↓
Is canvas element in DOM?
    ↓
├── No → Check HTML syntax
└── Yes → Is context obtained?
    ↓
    ├── No → Check getElementById
    └── Yes → Are events firing?
        ↓
        ├── No → Check addEventListener
        └── Yes → Is stroke() called?
            ↓
            ├── No → Add ctx.stroke()
            └── Yes → Check color/width
```

## Next Phase

→ [[Phase-4-Tools]]
