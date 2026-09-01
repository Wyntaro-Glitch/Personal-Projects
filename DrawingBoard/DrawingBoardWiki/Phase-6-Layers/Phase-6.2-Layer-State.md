# Phase 6.2: Layer State

## Objective

Implement React state management for layers using a custom hook.

## Hook Design

```javascript
// client/src/hooks/useLayers.js

export default function useLayers(roomId) {
  const [layers, setLayers] = useState([]);
  const [activeLayerId, setActiveLayerId] = useState(null);

  // Create a new layer
  const createLayer = (name) => { ... }

  // Delete a layer
  const deleteLayer = (layerId) => { ... }

  // Rename a layer
  const renameLayer = (layerId, name) => { ... }

  // Toggle visibility
  const toggleVisibility = (layerId) => { ... }

  // Toggle lock
  const toggleLock = (layerId) => { ... }

  // Reorder layers
  const reorderLayers = (fromIndex, toIndex) => { ... }

  // Set active layer
  const setActiveLayer = (layerId) => { ... }

  // Update layer opacity
  const setOpacity = (layerId, opacity) => { ... }

  // Add stroke to active layer
  const addStrokeToLayer = (stroke) => { ... }

  // Load layers from room
  const loadLayers = (roomLayers) => { ... }

  return {
    layers,
    activeLayerId,
    createLayer,
    deleteLayer,
    renameLayer,
    toggleVisibility,
    toggleLock,
    reorderLayers,
    setActiveLayer,
    setOpacity,
    addStrokeToLayer,
    loadLayers
  };
}
```

## Tasks

- [ ] Create `client/src/hooks/useLayers.js`
- [ ] Implement all layer operations
- [ ] Integrate with `useCanvas` for layer-aware drawing
- [ ] Add layer state to `App.jsx`
- [ ] Pass layer props to Canvas component

## State Structure

```javascript
{
  layers: [
    {
      id: 'layer-1',
      name: 'Background',
      visible: true,
      locked: false,
      opacity: 1,
      order: 0,
      strokes: []
    },
    {
      id: 'layer-2',
      name: 'Foreground',
      visible: true,
      locked: false,
      opacity: 1,
      order: 1,
      strokes: []
    }
  ],
  activeLayerId: 'layer-2'
}
```

## Notes

- Only the active layer can receive new strokes
- Locked layers cannot be edited
- Hidden layers are not rendered
- Layer order determines rendering order (bottom to top)
