import { useEffect } from 'react';
import useCanvas from '../hooks/useCanvas';

export default function Canvas({   brushSize,
  color,
  isEraser,
  strokes,
  onStrokesChange,
  remoteCursors,
  onCursorMove,
  currentTool
}) {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    redrawCanvas,
    setTool
  } = useCanvas(strokes, onStrokesChange);

  useEffect(() => {
    setTool(currentTool);
  }, [currentTool, setTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 600;
    }
  }, [canvasRef]);

  useEffect(() => {
    redrawCanvas(strokes);
  }, [strokes, redrawCanvas]);

  const handleMouseMove = (e) => {
    draw(e);
    onCursorMove({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      color
    });
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => startDrawing(e, brushSize, color, isEraser)}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: '1px solid #000', cursor: 'crosshair' }}
      />
      {Object.entries(remoteCursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="remote-cursor"
          style={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: cursor.color,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
}
