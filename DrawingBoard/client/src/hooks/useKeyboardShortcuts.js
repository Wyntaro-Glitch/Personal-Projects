import { useEffect } from 'react';

export default function useKeyboardShortcuts(undo, redo, canUndo, canRedo) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Ctrl+Y for redo
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
}