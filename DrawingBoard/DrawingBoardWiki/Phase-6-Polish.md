# Phase 6: Polish

> **Status:** ⬜ Not Started  
> **Priority:** Low  
> **Depends On:** [[Phase-5-State]]

## Objective

Improve UX with controls and shortcuts.

## Why This Matters

Finishing touches that make the app feel complete and professional.

## Deliverables

- [ ] Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)
- [ ] Canvas resizes with window
- [ ] Download canvas as PNG button
- [ ] Clean, minimal UI

## Tasks

### 1. Add Keyboard Shortcuts

```javascript
document.addEventListener('keydown', (e) => {
  // Ctrl+Z for undo
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault();
    undo();
  }
  // Ctrl+Y for redo
  if (e.ctrlKey && e.key === 'y') {
    e.preventDefault();
    redo();
  }
});
```

**What this does:**
- Listens for key presses globally
- `e.preventDefault()` stops browser default actions (like browser undo)
- Provides standard keyboard shortcuts users expect

---

### 2. Canvas Resize on Window Resize

```javascript
function resizeCanvas() {
  // Save current drawing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Resize canvas
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 100;
  
  // Restore drawing
  ctx.putImageData(imageData, 0, 0);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial size
```

**What this does:**
- Saves current canvas content as image data
- Resizes canvas to fill window
- Restores the saved image
- Called on window resize and initial load

---

### 3. Download as PNG

```html
<button id="downloadBtn">Download PNG</button>
```

```javascript
document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});
```

**What this does:**
- Creates temporary download link
- `toDataURL()` converts canvas to base64 PNG image
- Triggers browser download with specified filename

---

### 4. Style the UI

```css
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}

#toolbar {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  align-items: center;
}

#toolbar button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

#toolbar button:hover {
  background: #f0f0f0;
}

#toolbar button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

canvas {
  display: block;
  background: white;
}
```

**What this does:**
- Makes toolbar look modern and clean
- Flexbox layout aligns controls horizontally
- Hover and active states for buttons
- Clean canvas background

## Completion Checklist

- [ ] Ctrl+Z triggers undo
- [ ] Ctrl+Y triggers redo
- [ ] Canvas fills window
- [ ] Canvas resizes when window resizes
- [ ] Download button saves PNG
- [ ] UI looks clean and professional

## Verification

1. Start server: `node server.js`
2. Open `http://localhost:3000/index.html`
3. Test keyboard shortcuts:
   - Draw something → Ctrl+Z → undo
   - Ctrl+Y → redo
4. Resize window → canvas adjusts
5. Click download → PNG saves

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Shortcuts don't work | Canvas has focus | Use document-level listener |
| Canvas blank after resize | imageData lost | Ensure getImageData before resize |
| Download doesn't work | Browser blocking | Check for popup blocker |
| Drawing distorted on resize | putImageData wrong position | Use drawImage instead for scaling |

## Next Phase

→ [[Phase-7-Documentation]]
