# Layer Mask

## Description

A layer mask controls the visibility of a layer using grayscale values. White reveals, black conceals, gray partially reveals.

## Visual Example

```
Layer Content        Mask                 Result
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ ███████████ │     │ ███████████ │     │ ███████████ │
│ ███████████ │     │ █████░░░░░░ │     │ █████░░░░░░ │
│ ███████████ │     │ █████░░░░░░ │     │ █████░░░░░░ │
│ ███████████ │     │ ███████████ │     │ ███████████ │
│ ███████████ │     │ ███████████ │     │ ███████████ │
└─────────────┘     └─────────────┘     └─────────────┘
   (full)          (gradient mask)     (partially hidden)
```

## Operation

```javascript
{
  type: "ADD_LAYER_MASK",
  payload: {
    layerId: "layer-001",
    mask: null // Creates empty (white) mask
  }
}
```

```javascript
{
  type: "DELETE_LAYER_MASK",
  payload: {
    layerId: "layer-001",
    mask: { // Preserve for undo
      width: 1920,
      height: 1080,
      data: [...]
    }
  }
}
```

## Implementation

```javascript
const layer = {
  id: "layer-001",
  name: "Line Art",
  mask: {
    enabled: true,
    data: Uint8ClampedArray // Grayscale values 0-255
  }
};

// During rendering
if (layer.mask && layer.mask.enabled) {
  // Apply mask using composite operations
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.putImageData(maskImageData, 0, 0);
  ctx.restore();
}
```

## Use Cases

- Non-destructive erasing
- Soft edges on layers
- Gradient visibility
- Hiding parts of a layer without deleting

## Priority

High - Essential for non-destructive workflow
