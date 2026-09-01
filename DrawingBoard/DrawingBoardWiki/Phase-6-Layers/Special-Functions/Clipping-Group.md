# Clipping Group

## Description

A clipping group clips the current layer to the content of the layer directly below it. The top layer is only visible where the bottom layer has content.

## Visual Example

```
Layer 2 (Color)     Layer 1 (Line Art)     Result
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ ███████████ │     │      █      │     │      █      │
│ ███████████ │     │     ███     │     │     ███     │
│ ███████████ │     │    █████    │     │    █████    │
│ ███████████ │     │     ███     │     │     ███     │
│ ███████████ │     │      █      │     │      █      │
└─────────────┘     └─────────────┘     └─────────────┘
   (full color)      (circle shape)      (color only inside circle)
```

## Operation

```javascript
{
  type: "SET_LAYER_CLIPPING",
  payload: {
    layerId: "layer-002",
    previousClipping: false,
    newClipping: true
  }
}
```

## Implementation

```javascript
// During rendering
if (layer.clipping && layerIndex > 0) {
  // Use layer below as mask
  const belowLayer = layers[layerIndex - 1];
  
  // Only render where below layer has content
  ctx.globalCompositeOperation = "source-in";
  renderLayer(belowLayer, ctx);
  
  ctx.globalCompositeOperation = "source-over";
  renderLayer(layer, ctx);
}
```

## Use Cases

- Color layers clipped to line art
- Shading layers clipped to base color
- Texture layers clipped to shape

## Priority

High - Very common in digital art workflows
