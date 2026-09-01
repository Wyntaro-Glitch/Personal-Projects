# Phase 6: Layers

## Overview

This phase implements a layer system for the DrawingBoard application, allowing users to organize their drawings into separate layers that can be independently manipulated, hidden, locked, and reordered.

## Goals

1. Layer management (create, delete, rename layers)
2. Layer visibility toggle (show/hide layers)
3. Layer locking (prevent edits to specific layers)
4. Layer reordering (drag to reorder layers)
5. Active layer selection (draw on specific layer)
6. Layer opacity control
7. Broadcast layer changes to all users in room

## Sub-Phases

| Sub-Phase | Name | Status | Description |
|-----------|------|--------|-------------|
| 6.1 | Layer Model | ⬜ Pending | MongoDB schema for layers |
| 6.2 | Layer State | ⬜ Pending | React state management for layers |
| 6.3 | Layer UI | ⬜ Pending | Layer panel in sidebar |
| 6.4 | Canvas Layers | ⬜ Pending | Multi-canvas rendering system |
| 6.5 | Layer Tools | ⬜ Pending | Layer-specific operations |
| 6.6 | Broadcast Layers | ⬜ Pending | Real-time layer sync |

## Technical Approach

### Layer Storage

Each room will store layers as an array of layer objects:

```javascript
{
  _id: ObjectId,
  name: String,
  visible: Boolean,
  locked: Boolean,
  opacity: Number (0-1),
  order: Number,
  strokes: [StrokeSchema],
  createdAt: Date
}
```

### Canvas Rendering

Use multiple stacked canvas elements (one per layer) for efficient rendering:

```
┌─────────────────────────┐
│  Layer 3 (top)          │
├─────────────────────────┤
│  Layer 2                │
├─────────────────────────┤
│  Layer 1 (bottom)       │
└─────────────────────────┘
```

### Layer Panel UI

Located in the sidebar, showing:
- List of layers with names
- Visibility toggle (eye icon)
- Lock toggle (lock icon)
- Active layer highlight
- Add/delete layer buttons
- Drag to reorder

## Dependencies

- Phase 1-5 (completed)
- Existing canvas and stroke system

## Files to Create/Modify

### New Files
- `server/models/Layer.js` - Layer schema
- `client/src/components/LayerPanel.jsx` - Layer panel UI
- `client/src/hooks/useLayers.js` - Layer state management

### Modified Files
- `server/models/Room.js` - Add layers array
- `server/server.js` - Layer socket events
- `client/src/App.jsx` - Layer integration
- `client/src/components/Canvas.jsx` - Multi-canvas support
- `client/src/components/Sidebar.jsx` - Add layer panel
- `client/src/index.css` - Layer panel styles

## Success Criteria

- [ ] Users can create multiple layers per room
- [ ] Users can toggle layer visibility
- [ ] Users can lock layers to prevent edits
- [ ] Users can reorder layers (drag & drop)
- [ ] Drawing only affects the active layer
- [ ] Layer changes broadcast to all users in room
- [ ] Layers persist in MongoDB
- [ ] Layer panel is intuitive and responsive
