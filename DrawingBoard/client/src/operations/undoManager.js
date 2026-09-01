import { applyOperation, createInverseOperation } from './operationExecutor';

class UndoManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 100;
  }

  // Commit an operation to the document and history
  commit(document, operation) {
    const success = applyOperation(document, operation);
    
    if (success) {
      this.undoStack.push(operation);
      this.redoStack = []; // Clear redo stack on new operation
      
      // Limit history size
      if (this.undoStack.length > this.maxHistory) {
        this.undoStack.shift();
      }
    }
    
    return success;
  }

  // Undo the last operation
  undo(document) {
    if (this.undoStack.length === 0) return false;
    
    const operation = this.undoStack.pop();
    const inverse = createInverseOperation(document, operation);
    
    if (inverse) {
      const success = applyOperation(document, inverse);
      
      if (success) {
        this.redoStack.push(operation);
        return { success: true, inverse };
      }
    }
    
    // If inverse failed, push operation back
    this.undoStack.push(operation);
    return { success: false };
  }

  // Redo the last undone operation
  redo(document) {
    if (this.redoStack.length === 0) return false;
    
    const operation = this.redoStack.pop();
    const success = applyOperation(document, operation);
    
    if (success) {
      this.undoStack.push(operation);
      return { success: true, operation };
    }
    
    // If apply failed, push operation back
    this.redoStack.push(operation);
    return { success: false };
  }

  // Check if undo is available
  canUndo() {
    return this.undoStack.length > 0;
  }

  // Check if redo is available
  canRedo() {
    return this.redoStack.length > 0;
  }

  // Clear all history
  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  // Get history info
  getInfo() {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
      lastOperation: this.undoStack[this.undoStack.length - 1] || null
    };
  }
}

export default UndoManager;
