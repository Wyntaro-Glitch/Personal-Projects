# Phase 5.1: Shape Tools

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-4-Rooms/Phase-4-Rooms]]

## Objective

Add shape drawing tools (rectangle, circle, line).

## Why This Matters

Shapes enable diagrams, arrows, and structured drawings essential for collaboration.

## Deliverables

- [ ] Rectangle tool
- [ ] Circle/ellipse tool
- [ ] Line tool
- [ ] Arrow tool
- [ ] Shape preview while drawing

## Tasks

### 1. Create `client/src/utils/drawingTools.js`

```javascript
export function drawRectangle(ctx, startX, startY, endX, endY, color, width, fill = false) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  
  const rectX = Math.min(startX, endX);
  const rectY = Math.min(startY, endY);
  const rectWidth = Math.abs(endX - startX);
  const rectHeight = Math.abs(endY - startY);
  
  if (fill) {
    ctx.fillStyle = color;
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  } else {
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
  }
}

export function drawCircle(ctx, startX, startY, endX, endY, color, width, fill = false) {
  const radiusX = Math.abs(endX - startX) / 2;
  const radiusY = Math.abs(endY - startY) / 2;
  const centerX = startX + (endX - startX) / 2;
  const centerY = startY + (endY - startY) / 2;
  
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

export function drawLine(ctx, startX, startY, endX, endY, color, width) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function drawArrow(ctx, startX, startY, endX, endY, color, width) {
  const headLength = 15;
  const angle = Math.atan2(endY - startY, endX - startX);
  
  // Draw line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  
  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}
```

### 2. Update `client/src/hooks/useCanvas.js`

Add shape drawing state and handlers.

## Completion Checklist

- [ ] Rectangle tool works
- [ ] Circle tool works
- [ ] Line tool works
- [ ] Arrow tool works
- [ ] Preview while dragging

## Next Phase

→ [[Phase-5.2-Fill-Bucket]]
