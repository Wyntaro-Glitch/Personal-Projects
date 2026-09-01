# Phase 6.5: Layer Tools

## Objective

Implement layer-specific operations and tools.

## Operations

### 1. Merge Layers

Combine two or more layers into one:

```javascript
const mergeLayers = (layerIds, targetLayerId) => {
  // Combine strokes from all selected layers
  // Remove merged layers
  // Keep target layer with combined strokes
};
```

### 2. Flatten Layers

Merge all layers into a single layer:

```javascript
const flattenLayers = () => {
  // Combine all layer strokes into one
  // Remove all layers except one
  // Reset layer order
};
```

### 3. Duplicate Layer

Create a copy of a layer:

```javascript
const duplicateLayer = (layerId) => {
  // Create new layer with same strokes
  // Add to layers array
  // Position above original
};
```

### 4. Clear Layer

Remove all strokes from a layer:

```javascript
const clearLayer = (layerId) => {
  // Clear strokes array for layer
  // Re-render canvas
};
```

## Layer Operations UI

Add layer operations to the layer panel:

```jsx
<div className="layer-operations">
  <button onClick={mergeSelected}>Merge Selected</button>
  <button onClick={flattenAll}>Flatten All</button>
  <button onClick={duplicateActive}>Duplicate Active</button>
  <button onClick={clearActive}>Clear Active</button>
</div>
```

## Tasks

- [ ] Implement merge layers functionality
- [ ] Implement flatten layers functionality
- [ ] Implement duplicate layer functionality
- [ ] Implement clear layer functionality
- [ ] Add layer operations UI to LayerPanel
- [ ] Add confirmation dialogs for destructive operations
- [ ] Broadcast layer operations to room

## Notes

- Merge and flatten are destructive operations (require confirmation)
- Duplicate creates an exact copy of the layer
- Clear only affects the selected layer
- All operations should be broadcast to other users in the room
