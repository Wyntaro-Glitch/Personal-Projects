# Phase 4: Drawing Tools

> **Status:** ⬜ Not Started  
> **Priority:** Medium  
> **Depends On:** [[Phase-3-Canvas]]

## Objective

Add configurable drawing tools.

## Why This Matters

Makes the canvas usable beyond basic black lines - real drawing apps need these controls.

## Deliverables

- [ ] Brush size slider
- [ ] Color picker input
- [ ] Eraser mode
- [ ] Tool selection UI

## Tasks

### 1. Add HTML Controls

```html
<div id="toolbar">
  <input type="range" id="brushSize" min="1" max="50" value="5">
  <input type="color" id="colorPicker" value="#000000">
  <button id="eraserBtn">Eraser</button>
  <button id="clearBtn">Clear</button>
</div>
<canvas id="canvas" width="800" height="600"></canvas>
```

**What this does:**
- Creates UI controls above the canvas
- Range slider for brush size (1-50 pixels)
- Color picker for any color
- Buttons for eraser and clear

---

### 2. Style the Toolbar

```css
#toolbar {
  padding: 10px;
  background: #f0f0f0;
  margin-bottom: 10px;
}

#toolbar button {
  margin: 0 5px;
  padding: 5px 10px;
}
```

**What this does:**
- Separates controls from canvas visually
- Makes UI look organized

---

### 3. Bind Controls to Canvas Context

```javascript
const brushSize = document.getElementById('brushSize');
const colorPicker = document.getElementById('colorPicker');
const eraserBtn = document.getElementById('eraserBtn');

let currentColor = '#000000';
let isEraser = false;

brushSize.addEventListener('input', (e) => {
  ctx.lineWidth = e.target.value;
});

colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
  isEraser = false;
  eraserBtn.classList.remove('active');
});

eraserBtn.addEventListener('click', () => {
  isEraser = !isEraser;
  eraserBtn.classList.toggle('active');
});
```

**What each part does:**

| Control | Property Changed | Effect |
|---------|------------------|--------|
| Brush size slider | `ctx.lineWidth` | Thicker or thinner strokes |
| Color picker | `currentColor` variable | Changes stroke color |
| Eraser button | `isEraser` flag | Toggles eraser mode |

---

### 4. Update Drawing to Use Controls

```javascript
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
  
  // Set color for this stroke
  if (isEraser) {
    ctx.strokeStyle = '#FFFFFF'; // white for eraser
  } else {
    ctx.strokeStyle = currentColor;
  }
});

// In mousemove:
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});
```

**What this does:**
- Applies current color/eraser when stroke starts
- Each stroke uses the settings active at mousedown
- Eraser draws white (background color) over existing strokes

---

### 5. Implement Clear Button

```javascript
const clearBtn = document.getElementById('clearBtn');

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
```

**What this does:**
- `clearRect()` erases entire canvas area
- Parameters define rectangle to clear (x, y, width, height)

## Completion Checklist

- [ ] Brush size slider changes line thickness
- [ ] Color picker changes stroke color
- [ ] Eraser button toggles eraser mode
- [ ] Clear button wipes canvas
- [ ] UI looks clean and organized

## Verification

1. Start server: `node server.js`
2. Open `http://localhost:3000/index.html`
3. Test each control:
   - Change slider → draw → thickness changes
   - Pick color → draw → color changes
   - Click eraser → draw → removes strokes
   - Click clear → canvas empties

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Slider doesn't affect size | Not updating `lineWidth` | Check `ctx.lineWidth` assignment |
| Color doesn't change | Not updating `strokeStyle` | Verify event listener fires |
| Eraser doesn't work | Drawing transparent | Use white color, not transparent |
| Clear doesn't work | Wrong canvas dimensions | Check `clearRect` parameters |

## Next Phase

→ [[Phase-5-State]]
