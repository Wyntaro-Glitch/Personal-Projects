# Phase 5.2: Fill Bucket

> **Status:** ⬜ Not Started  
> **Priority:** Medium  
> **Depends On:** [[Phase-5.1-Shape-Tools]]

## Objective

Add flood fill tool to color enclosed areas.

## Why This Matters

Fill tool speeds up coloring and enables quick area changes.

## Deliverables

- [ ] Flood fill algorithm
- [ ] Tolerance setting
- [ ] Works with all colors

## Tasks

### 1. Add to `client/src/utils/drawingTools.js`

```javascript
export function floodFill(ctx, startX, startY, fillColor, tolerance = 32) {
  const canvas = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const targetColor = getPixelColor(data, startX, startY, canvas.width);
  
  if (colorsMatch(targetColor, hexToRgb(fillColor))) return;
  
  const stack = [[startX, startY]];
  const visited = new Set();
  
  while (stack.length > 0) {
    const [x, y] = stack.pop();
    const key = `${x},${y}`;
    
    if (visited.has(key)) continue;
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
    
    const currentColor = getPixelColor(data, x, y, canvas.width);
    if (!colorsMatch(currentColor, targetColor, tolerance)) continue;
    
    visited.add(key);
    setPixelColor(data, x, y, canvas.width, hexToRgb(fillColor));
    
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function getPixelColor(data, x, y, width) {
  const index = (y * width + x) * 4;
  return { r: data[index], g: data[index + 1], b: data[index + 2], a: data[index + 3] };
}

function setPixelColor(data, x, y, width, color) {
  const index = (y * width + x) * 4;
  data[index] = color.r;
  data[index + 1] = color.g;
  data[index + 2] = color.b;
  data[index + 3] = 255;
}

function colorsMatch(c1, c2, tolerance = 0) {
  return Math.abs(c1.r - c2.r) <= tolerance &&
         Math.abs(c1.g - c2.g) <= tolerance &&
         Math.abs(c1.b - c2.b) <= tolerance;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
```

## Completion Checklist

- [ ] Flood fill works
- [ ] Tolerance adjustable
- [ ] Works with all colors

## Next Phase

→ [[Phase-5.3-Text-Tool]]
