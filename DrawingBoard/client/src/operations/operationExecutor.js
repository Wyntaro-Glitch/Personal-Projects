import { operationHandlers } from './operationHandlers';

// Apply an operation to the document
export function applyOperation(document, operation) {
  const handler = operationHandlers[operation.type];
  
  if (!handler) {
    console.error(`Unknown operation type: ${operation.type}`);
    return false;
  }
  
  try {
    handler.apply(document, operation);
    return true;
  } catch (error) {
    console.error(`Error applying operation ${operation.type}:`, error);
    return false;
  }
}

// Create inverse operation for undo
export function createInverseOperation(document, operation) {
  const handler = operationHandlers[operation.type];
  
  if (!handler || !handler.inverse) {
    console.error(`No inverse for operation type: ${operation.type}`);
    return null;
  }
  
  try {
    return handler.inverse(document, operation);
  } catch (error) {
    console.error(`Error creating inverse for ${operation.type}:`, error);
    return null;
  }
}
