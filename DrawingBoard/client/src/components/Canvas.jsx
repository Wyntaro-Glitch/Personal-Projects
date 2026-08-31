import { useEffect } from 'react';
import useCanvas from '../hooks/useCanvas';

export default function Canvas({ brushSize, color, isEraser, strokes, onStrokesChange }) {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    redrawCanvas
  } = useCanvas(strokes, onStrokesChange);

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

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={(e) => startDrawing(e, brushSize, color, isEraser)}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{ border: '1px solid #000', cursor: 'crosshair' }}
    />
  );
}