import { createOperation, OperationTypes } from './operationTypes';

// Helper to generate unique IDs
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Operation handlers with apply and inverse functions
export const operationHandlers = {
  // ========== LAYER OPERATIONS ==========
  
  [OperationTypes.ADD_LAYER]: {
    apply(document, operation) {
      const { layer, index } = operation.payload;
      document.layers.splice(index, 0, structuredClone(layer));
    },
    inverse(document, operation) {
      const { layer, index } = operation.payload;
      return createOperation(
        OperationTypes.DELETE_LAYER,
        { layer: structuredClone(document.layers[index]), index },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.DELETE_LAYER]: {
    apply(document, operation) {
      const { layerId } = operation.payload;
      document.layers = document.layers.filter(l => l.id !== layerId);
    },
    inverse(document, operation) {
      const { layer, index } = operation.payload;
      return createOperation(
        OperationTypes.ADD_LAYER,
        { layer: structuredClone(layer), index },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.MOVE_LAYER]: {
    apply(document, operation) {
      const { fromIndex, toIndex } = operation.payload;
      const [layer] = document.layers.splice(fromIndex, 1);
      document.layers.splice(toIndex, 0, layer);
    },
    inverse(document, operation) {
      const { layerId, fromIndex, toIndex } = operation.payload;
      return createOperation(
        OperationTypes.MOVE_LAYER,
        { layerId, fromIndex: toIndex, toIndex: fromIndex },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.RENAME_LAYER]: {
    apply(document, operation) {
      const { layerId, newName } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.name = newName;
    },
    inverse(document, operation) {
      const { layerId, oldName } = operation.payload;
      return createOperation(
        OperationTypes.RENAME_LAYER,
        { layerId, oldName: operation.payload.newName, newName: oldName },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.SET_LAYER_VISIBILITY]: {
    apply(document, operation) {
      const { layerId, newVisible } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.visible = newVisible;
    },
    inverse(document, operation) {
      const { layerId, previousVisible } = operation.payload;
      return createOperation(
        OperationTypes.SET_LAYER_VISIBILITY,
        { layerId, previousVisible: operation.payload.newVisible, newVisible: previousVisible },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.SET_LAYER_OPACITY]: {
    apply(document, operation) {
      const { layerId, newOpacity } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.opacity = newOpacity;
    },
    inverse(document, operation) {
      const { layerId, previousOpacity } = operation.payload;
      return createOperation(
        OperationTypes.SET_LAYER_OPACITY,
        { layerId, previousOpacity: operation.payload.newOpacity, newOpacity: previousOpacity },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.SET_LAYER_BLEND_MODE]: {
    apply(document, operation) {
      const { layerId, newBlendMode } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.blendMode = newBlendMode;
    },
    inverse(document, operation) {
      const { layerId, previousBlendMode } = operation.payload;
      return createOperation(
        OperationTypes.SET_LAYER_BLEND_MODE,
        { layerId, previousBlendMode: operation.payload.newBlendMode, newBlendMode: previousBlendMode },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.SET_LAYER_LOCKED]: {
    apply(document, operation) {
      const { layerId, newLocked } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.locked = newLocked;
    },
    inverse(document, operation) {
      const { layerId, previousLocked } = operation.payload;
      return createOperation(
        OperationTypes.SET_LAYER_LOCKED,
        { layerId, previousLocked: operation.payload.newLocked, newLocked: previousLocked },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.SET_LAYER_CLIPPING]: {
    apply(document, operation) {
      const { layerId, newClipping } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.clipping = newClipping;
    },
    inverse(document, operation) {
      const { layerId, previousClipping } = operation.payload;
      return createOperation(
        OperationTypes.SET_LAYER_CLIPPING,
        { layerId, previousClipping: operation.payload.newClipping, newClipping: previousClipping },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.SET_LAYER_ALPHA_LOCK]: {
    apply(document, operation) {
      const { layerId, newAlphaLock } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.alphaLock = newAlphaLock;
    },
    inverse(document, operation) {
      const { layerId, previousAlphaLock } = operation.payload;
      return createOperation(
        OperationTypes.SET_LAYER_ALPHA_LOCK,
        { layerId, previousAlphaLock: operation.payload.newAlphaLock, newAlphaLock: previousAlphaLock },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.CLEAR_LAYER]: {
    apply(document, operation) {
      const { layerId } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.strokes = [];
    },
    inverse(document, operation) {
      const { layerId, strokes } = operation.payload;
      return createOperation(
        OperationTypes.RESTORE_LAYER_STROKES,
        { layerId, strokes: structuredClone(strokes) },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.DUPLICATE_LAYER]: {
    apply(document, operation) {
      const { newLayer, index } = operation.payload;
      document.layers.splice(index, 0, structuredClone(newLayer));
    },
    inverse(document, operation) {
      const { newLayer } = operation.payload;
      return createOperation(
        OperationTypes.DELETE_LAYER,
        { layerId: newLayer.id, layer: structuredClone(newLayer), index: document.layers.findIndex(l => l.id === newLayer.id) },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.MERGE_DOWN]: {
    apply(document, operation) {
      const { layerId } = operation.payload;
      const layerIndex = document.layers.findIndex(l => l.id === layerId);
      if (layerIndex > 0) {
        const upperLayer = document.layers[layerIndex];
        const lowerLayer = document.layers[layerIndex - 1];
        lowerLayer.strokes = [...lowerLayer.strokes, ...upperLayer.strokes];
        document.layers.splice(layerIndex, 1);
      }
    },
    inverse(document, operation) {
      const { layer, layerBelow, layerIndex } = operation.payload;
      return createOperation(
        OperationTypes.RESTORE_MERGED_LAYERS,
        { layer: structuredClone(layer), layerBelow: structuredClone(layerBelow), layerIndex },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.FLATTEN_LAYERS]: {
    apply(document, operation) {
      const allStrokes = document.layers.flatMap(l => l.strokes || []);
      document.layers = [{
        id: generateId(),
        name: 'Flattened',
        type: 'stroke',
        visible: true,
        opacity: 1,
        blendMode: 'source-over',
        locked: false,
        clipping: false,
        alphaLock: false,
        strokes: allStrokes,
        transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 }
      }];
    },
    inverse(document, operation) {
      const { originalLayers } = operation.payload;
      return createOperation(
        OperationTypes.RESTORE_LAYERS,
        { layers: structuredClone(originalLayers) },
        operation.projectId,
        operation.userId
      );
    }
  },

  // ========== STROKE OPERATIONS ==========

  [OperationTypes.ADD_STROKE]: {
    apply(document, operation) {
      const { layerId, stroke } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.strokes.push(structuredClone(stroke));
    },
    inverse(document, operation) {
      const { layerId, stroke } = operation.payload;
      return createOperation(
        OperationTypes.DELETE_STROKE,
        { layerId, strokeId: stroke.id, stroke: structuredClone(stroke) },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.DELETE_STROKE]: {
    apply(document, operation) {
      const { layerId, strokeId } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) layer.strokes = layer.strokes.filter(s => s.id !== strokeId);
    },
    inverse(document, operation) {
      const { layerId, stroke } = operation.payload;
      return createOperation(
        OperationTypes.ADD_STROKE,
        { layerId, stroke: structuredClone(stroke) },
        operation.projectId,
        operation.userId
      );
    }
  },

  [OperationTypes.UPDATE_STROKE]: {
    apply(document, operation) {
      const { layerId, strokeId, after } = operation.payload;
      const layer = document.layers.find(l => l.id === layerId);
      if (layer) {
        const strokeIndex = layer.strokes.findIndex(s => s.id === strokeId);
        if (strokeIndex !== -1) {
          layer.strokes[strokeIndex] = { ...layer.strokes[strokeIndex], ...after };
        }
      }
    },
    inverse(document, operation) {
      const { layerId, strokeId, before } = operation.payload;
      return createOperation(
        OperationTypes.UPDATE_STROKE,
        { layerId, strokeId, before: operation.payload.after, after: before },
        operation.projectId,
        operation.userId
      );
    }
  }
};
