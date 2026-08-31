import { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import Users from './components/Users';
import useStrokeHistory from './hooks/useStrokeHistory';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useSocket from './hooks/useSocket';
import { saveStrokes } from './api/strokes';

function App() {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState({});

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

  const {
    socket,
    connected,
    emitStroke,
    emitCursor,
    onReceiveStroke,
    onLoadStrokes,
    onCursorUpdate,
    onUserLeft
  } = useSocket();

  useKeyboardShortcuts(undo, redo, canUndo, canRedo);

  // Load strokes from socket on connect
  useEffect(() => {
    const cleanup = onLoadStrokes((loadedStrokes) => {
      setInitialStrokes(loadedStrokes);
    });
    return cleanup;
  }, [onLoadStrokes, setInitialStrokes]);

  // Listen for new strokes from other users
  useEffect(() => {
    const cleanup = onReceiveStroke((stroke) => {
      addToHistory(stroke);
    });
    return cleanup;
  }, [onReceiveStroke, addToHistory]);

  // Listen for cursor updates
  useEffect(() => {
    const cleanup = onCursorUpdate((data) => {
      setRemoteCursors(prev => ({
        ...prev,
        [data.userId]: { x: data.x, y: data.y, color: data.color }
      }));
    });
    return cleanup;
  }, [onCursorUpdate]);

  // Handle user disconnect
  useEffect(() => {
    const cleanup = onUserLeft((userId) => {
      setRemoteCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    });
    return cleanup;
  }, [onUserLeft]);

  // Save strokes to server
  useEffect(() => {
    if (strokes.length > 0) {
      saveStrokes(strokes);
    }
  }, [strokes]);

  const handleStrokesChange = (stroke) => {
    addToHistory(stroke);
    emitStroke(stroke);
  };

  const handleCursorMove = (data) => {
    emitCursor(data);
  };

  const clearCanvas = () => {
    clearHistory();
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="App">
      <h1>Drawing Board {connected ? '🟢' : '🔴'}</h1>
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
      <div className="main-content">
        <Canvas
          brushSize={brushSize}
          color={color}
          isEraser={isEraser}
          strokes={strokes}
          onStrokesChange={handleStrokesChange}
          remoteCursors={remoteCursors}
          onCursorMove={handleCursorMove}
        />
        <Users users={[]} currentUserId={socket?.id} />
      </div>
    </div>
  );
}

export default App;
