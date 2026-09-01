# Phase 6.4: Canvas Layers

## Objective

Implement a multi-canvas rendering system that supports layers.

## Architecture

Instead of a single canvas, use multiple stacked canvas elements:

```
┌─────────────────────────────────────┐
│  Canvas Layer 3 (top)               │
├─────────────────────────────────────┤
│  Canvas Layer 2                     │
├─────────────────────────────────────┤
│  Canvas Layer 1 (bottom)            │
└─────────────────────────────────────┘
```

Each canvas element:
- Has the same dimensions
- Is positioned absolutely on top of each other
- Only renders strokes for its corresponding layer
- Respects layer visibility and opacity

## Implementation

### Canvas Container

```jsx
// client/src/components/Canvas.jsx

function Canvas({ layers, activeLayerId, ... }) {
  return (
    <div className="canvas-container">
      {layers.map((layer) => (
        <canvas
          key={layer.id}
          className={`layer-canvas ${layer.id === activeLayerId ? 'active' : ''}`}
          style={{
            opacity: layer.opacity,
            visibility: layer.visible ? 'visible' : 'hidden',
            zIndex: layer.order
          }}
          onMouseDown={layer.locked ? null : handleMouseDown}
          onMouseMove={layer.locked ? null : handleMouseMove}
          onMouseUp={layer.locked ? null : handleMouseUp}
        />
      ))}
      {/* Remote cursors overlay */}
    </div>
  );
}
```

### Layer Canvas Rendering

```javascript
// Each canvas renders only its layer's strokes
const renderLayerCanvas = (canvas, layer) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  layer.strokes.forEach(stroke => {
    if (stroke.type === 'shape') {
      drawShape(ctx, stroke);
    } else if (stroke.type === 'stroke') {
      drawStroke(ctx, stroke);
    }
  });
};
```

## Tasks

- [ ] Update `Canvas.jsx` to render multiple canvases
- [ ] Modify `useCanvas.js` to handle layer-specific drawing
- [ ] Implement layer-aware stroke rendering
- [ ] Add canvas stacking with proper z-index
- [ ] Handle mouse events on active layer only
- [ ] Update remote cursors to work with layers

## CSS

```css
.canvas-container {
  position: relative;
}

.layer-canvas {
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
  cursor: crosshair;
}

.layer-canvas.active {
  z-index: 10;
}

.layer-canvas:not(.active) {
  pointer-events: none;
}
```

## Notes

- Only the active layer canvas receives mouse events
- Other layer canvases have `pointer-events: none`
- Layer opacity is applied via CSS opacity
- Layer visibility is controlled via CSS visibility
- Z-index ensures proper layer stacking
