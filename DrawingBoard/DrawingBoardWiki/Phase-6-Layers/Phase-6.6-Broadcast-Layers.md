# Phase 6.6: Broadcast Layers

## Objective

Implement real-time synchronization of layer changes across all users in a room.

## Socket Events

### Client → Server

```javascript
// Create a new layer
socket.emit('create-layer', { name, order });

// Delete a layer
socket.emit('delete-layer', { layerId });

// Rename a layer
socket.emit('rename-layer', { layerId, name });

// Toggle visibility
socket.emit('toggle-layer-visibility', { layerId });

// Toggle lock
socket.emit('toggle-layer-lock', { layerId });

// Reorder layers
socket.emit('reorder-layers', { layerIds });

// Update layer opacity
socket.emit('update-layer-opacity', { layerId, opacity });

// Merge layers
socket.emit('merge-layers', { layerIds, targetLayerId });

// Flatten layers
socket.emit('flatten-layers', {});

// Duplicate layer
socket.emit('duplicate-layer', { layerId });

// Clear layer
socket.emit('clear-layer', { layerId });

// Add stroke to layer
socket.emit('layer-stroke', { layerId, stroke });
```

### Server → Client

```javascript
// Layer created
socket.on('layer-created', (layer) => { ... });

// Layer deleted
socket.on('layer-deleted', (layerId) => { ... });

// Layer renamed
socket.on('layer-renamed', (layerId, name) => { ... });

// Layer visibility toggled
socket.on('layer-visibility-changed', (layerId, visible) => { ... });

// Layer lock toggled
socket.on('layer-lock-changed', (layerId, locked) => { ... });

// Layers reordered
socket.on('layers-reordered', (layerIds) => { ... });

// Layer opacity updated
socket.on('layer-opacity-changed', (layerId, opacity) => { ... });

// Layers merged
socket.on('layers-merged', (targetLayer, removedLayerIds) => { ... });

// Layers flattened
socket.on('layers-flattened', (flattenedLayer) => { ... });

// Layer duplicated
socket.on('layer-duplicated', (newLayer, originalLayerId) => { ... });

// Layer cleared
socket.on('layer-cleared', (layerId) => { ... });

// Stroke added to layer
socket.on('layer-stroke-added', (layerId, stroke) => { ... });
```

## Implementation

### Server Handler

```javascript
// server/server.js

socket.on('create-layer', async ({ name, order }) => {
  if (currentRoomId) {
    const newLayer = {
      name: name || `Layer ${Date.now()}`,
      visible: true,
      locked: false,
      opacity: 1,
      order: order || 0,
      strokes: []
    };
    
    await Room.findByIdAndUpdate(currentRoomId, {
      $push: { layers: newLayer }
    });
    
    io.to(currentRoomId).emit('layer-created', newLayer);
  }
});
```

### Client Listener

```javascript
// client/src/hooks/useSocket.js

const onLayerCreated = useCallback((callback) => {
  if (socket) {
    socket.on('layer-created', callback);
    return () => socket.off('layer-created', callback);
  }
}, [socket]);
```

## Tasks

- [ ] Add layer socket events to server
- [ ] Add layer event listeners to useSocket hook
- [ ] Integrate layer events with useLayers hook
- [ ] Broadcast layer creation/deletion/reordering
- [ ] Broadcast layer property changes (visibility, lock, opacity)
- [ ] Broadcast layer operations (merge, flatten, duplicate, clear)
- [ ] Handle incoming layer updates from other users
- [ ] Test multi-user layer synchronization

## Notes

- All layer changes should be persisted to MongoDB
- All layer changes should be broadcast to room
- Incoming layer updates should update local state
- Conflict resolution for simultaneous edits (last-write-wins)
