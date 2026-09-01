// Operation Types
export const OperationTypes = {
  // Layer operations
  ADD_LAYER: 'ADD_LAYER',
  DELETE_LAYER: 'DELETE_LAYER',
  MOVE_LAYER: 'MOVE_LAYER',
  RENAME_LAYER: 'RENAME_LAYER',
  SET_LAYER_VISIBILITY: 'SET_LAYER_VISIBILITY',
  SET_LAYER_OPACITY: 'SET_LAYER_OPACITY',
  SET_LAYER_BLEND_MODE: 'SET_LAYER_BLEND_MODE',
  SET_LAYER_LOCKED: 'SET_LAYER_LOCKED',
  SET_LAYER_CLIPPING: 'SET_LAYER_CLIPPING',
  SET_LAYER_ALPHA_LOCK: 'SET_LAYER_ALPHA_LOCK',
  CLEAR_LAYER: 'CLEAR_LAYER',
  DUPLICATE_LAYER: 'DUPLICATE_LAYER',
  MERGE_DOWN: 'MERGE_DOWN',
  FLATTEN_LAYERS: 'FLATTEN_LAYERS',
  
  // Stroke operations
  ADD_STROKE: 'ADD_STROKE',
  DELETE_STROKE: 'DELETE_STROKE',
  UPDATE_STROKE: 'UPDATE_STROKE',
  
  // Transform operations
  TRANSFORM_LAYER: 'TRANSFORM_LAYER'
};

// Create a unique operation
export function createOperation(type, payload, projectId, userId) {
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  return {
    operationId: generateId(),
    type,
    projectId,
    userId,
    timestamp: Date.now(),
    payload
  };
}
