# Duplicate Layer

## Description

Creates an exact copy of a layer, including all strokes, properties, and settings.

## Operation

```javascript
{
  type: "DUPLICATE_LAYER",
  payload: {
    sourceLayerId: "layer-001",
    newLayerId: "layer-002",
    newLayer: {
      id: "layer-002",
      name: "Layer 1 Copy",
      type: "stroke",
      visible: true,
      opacity: 1,
      blendMode: "source-over",
      locked: false,
      clipping: false,
      alphaLock: false,
      strokes: [...], // Deep copy of all strokes
      transform: {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0
      }
    },
    index: 1 // Position above original
  }
}
```

## Inverse

```javascript
{
  type: "DELETE_LAYER",
  payload: {
    layerId: "layer-002",
    layer: { ... }, // Preserve for undo
    index: 1
  }
}
```

## Implementation

```javascript
function duplicateLayer(document, layerId) {
  const sourceIndex = document.layers.findIndex(l => l.id === layerId);
  const sourceLayer = document.layers[sourceIndex];
  
  const newLayer = {
    ...structuredClone(sourceLayer),
    id: crypto.randomUUID(),
    name: `${sourceLayer.name} Copy`
  };
  
  // Insert above source
  document.layers.splice(sourceIndex + 1, 0, newLayer);
  
  return newLayer;
}
```

## Use Cases

- Creating variations of a layer
- Backing up before experiments
- Creating symmetrical elements
- Building complex compositions

## Priority

High - Very common operation
