import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import useStrokeHistory from './hooks/useStrokeHistory';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import { saveStrokes, loadStrokes } from './api/strokes';

function App() {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);

  const {
    strokes,
    undo,
    redo,
    addToHistory,
    clearHistory,
    setInitialStrokes,
    canUndo,
    canRedo
  } = useStrokeHistory();

  // Keyboard shortcuts
  useKeyboardShortcuts(undo, redo, canUndo, canRedo);

  // Load strokes on mount
  useEffect(() => {
    async function init() {
      const savedStrokes = await loadStrokes();
      if (savedStrokes.length > 0) {
        setInitialStrokes(savedStrokes);
      }
    }
    init();
  }, [setInitialStrokes]);

  // Save strokes when they change
  useEffect(() => {
    if (strokes.length > 0) {
      saveStrokes(strokes);
    }
  }, [strokes]);

  const handleStrokesChange = (stroke) => {
    addToHistory(stroke);
  };

  const clearCanvas = () => {
    clearHistory();
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="App">
      <h1>Drawing Board</h1>
      <Toolbar
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        color={color}
        setColor={setColor}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        clearCanvas={clearCanvas}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        downloadPNG={() => {}}
      />
      <Canvas
        brushSize={brushSize}
        color={color}
        isEraser={isEraser}
        strokes={strokes}
        onStrokesChange={handleStrokesChange}
      />
    </div>
  );
}

export default App;