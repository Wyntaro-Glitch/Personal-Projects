import { useState, useCallback } from 'react';

export default function useStrokeHistory() {
  const [strokes, setStrokes] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  const addToHistory = useCallback((stroke) => {
    setStrokes(prev => [...prev, stroke]);
    setUndoStack([]); // Clear redo stack on new action
  }, []);

  const undo = useCallback(() => {
    if (strokes.length === 0) return null;
    const lastStroke = strokes[strokes.length - 1];
    setStrokes(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, lastStroke]);
    return lastStroke;
  }, [strokes]);

  const redo = useCallback(() => {
    if (undoStack.length === 0) return null;
    const stroke = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setStrokes(prev => [...prev, stroke]);
    return stroke;
  }, [undoStack]);

  const clearHistory = useCallback(() => {
    setStrokes([]);
    setUndoStack([]);
  }, []);

  const setInitialStrokes = useCallback((initialStrokes) => {
    setStrokes(initialStrokes);
    setUndoStack([]);
  }, []);

  return {
    strokes,
    undo,
    redo,
    addToHistory,
    clearHistory,
    setInitialStrokes,
    canUndo: strokes.length > 0,
    canRedo: undoStack.length > 0
  };
}