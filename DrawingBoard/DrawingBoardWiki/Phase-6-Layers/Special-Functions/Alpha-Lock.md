# Alpha Lock

## Description

Alpha Lock prevents editing of transparent pixels. Only existing opaque pixels can be modified. Useful for shading or recoloring without going outside lines.

## Visual Example

```
Original Layer       After Alpha Lock + Paint
┌─────────────┐     ┌─────────────┐
│      █      │     │      █      │
│     ███     │     │     ▓▓▓     │
│    █████    │     │    ▓▓▓▓▓    │
│     ███     │     │     ▓▓▓     │
│      █      │     │      █      │
└─────────────┘     └─────────────┘
  (black circle)     (blue only on black pixels)
```

## Operation

```javascript
{
  type: "SET_LAYER_ALPHA_LOCK",
  payload: {
    layerId: "layer-001",
    previousAlphaLock: false,
    newAlphaLock: true
  }
}
```

## Implementation

```javascript
// During drawing
if (activeLayer.alphaLock) {
  // Get existing pixel data
  const existingData = ctx.getImageData(0, 0, width, height);
  
  // Draw new stroke
  drawStroke(ctx, stroke);
  
  // Get updated pixel data
  const newData = ctx.getImageData(0, 0, width, height);
  
  // Only keep pixels where original had alpha > 0
  for (let i = 3; i < newData.data.length; i += 4) {
    if (existingData.data[i] === 0) {
      newData.data[i] = 0; // Restore transparency
    }
  }
  
  ctx.putImageData(newData, 0, 0);
}
```

## Use Cases

- Shading inside existing shapes
- Recoloring line art
- Adding texture to painted areas
- Locking transparency for gradient fills

## Priority

Medium - Common in coloring workflows
