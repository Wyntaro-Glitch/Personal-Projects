# Phase 6.1: Layer Model

## Objective

Create a MongoDB schema for layers that will be stored within rooms.

## Schema Design

```javascript
const LayerSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Layer 1'
  },
  visible: {
    type: Boolean,
    default: true
  },
  locked: {
    type: Boolean,
    default: false
  },
  opacity: {
    type: Number,
    default: 1,
    min: 0,
    max: 1
  },
  order: {
    type: Number,
    default: 0
  },
  strokes: [{
    type: mongoose.Schema.Types.Mixed
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

## Tasks

- [ ] Create `server/models/Layer.js`
- [ ] Update `server/models/Room.js` to include layers array
- [ ] Add default layer creation when room is created
- [ ] Test schema with MongoDB Atlas

## Room Schema Update

```javascript
const RoomSchema = new mongoose.Schema({
  name: String,
  code: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  layers: [LayerSchema],  // New: Array of layers
  strokes: [{             // Keep for backward compatibility
    type: mongoose.Schema.Types.Mixed
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

## Notes

- Each layer has its own strokes array
- Layers are ordered by the `order` field
- Default layer created automatically when room is created
- Backward compatible with existing rooms (empty layers array)
