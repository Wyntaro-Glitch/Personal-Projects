const mongoose = require('mongoose');

// Stroke sub-schema
const strokeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  tool: { type: String, default: 'pen' },
  color: { type: String, default: '#000000' },
  size: { type: Number, default: 5 },
  opacity: { type: Number, default: 1 },
  points: [{ 
    x: Number, 
    y: Number, 
    pressure: { type: Number, default: 0.5 }
  }],
  // Shape properties
  shape: { type: String }, // 'rectangle', 'circle', 'line'
  startX: { type: Number },
  startY: { type: Number },
  endX: { type: Number },
  endY: { type: Number }
}, { _id: false });

// Layer sub-schema
const layerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, default: 'Layer 1' },
  type: { type: String, default: 'stroke' }, // 'stroke' or 'raster'
  visible: { type: Boolean, default: true },
  opacity: { type: Number, default: 1 },
  blendMode: { type: String, default: 'source-over' },
  locked: { type: Boolean, default: false },
  clipping: { type: Boolean, default: false },
  alphaLock: { type: Boolean, default: false },
  strokes: [strokeSchema],
  transform: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    rotation: { type: Number, default: 0 }
  }
}, { _id: false });

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Document structure
  width: { type: Number, default: 1920 },
  height: { type: Number, default: 1080 },
  backgroundColor: { type: String, default: '#ffffff' },
  layers: [layerSchema],
  activeLayerId: { type: String },
  // Legacy strokes array for backward compatibility
  strokes: [{
    tool: { type: String, default: 'pencil' },
    points: [{ x: Number, y: Number }],
    color: String,
    width: Number,
    fill: { type: Boolean, default: false },
    text: String,
    fontSize: Number,
    startX: Number,
    startY: Number,
    endX: Number,
    endY: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique 6-character room code
roomSchema.statics.generateCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

module.exports = mongoose.model('Room', roomSchema);
