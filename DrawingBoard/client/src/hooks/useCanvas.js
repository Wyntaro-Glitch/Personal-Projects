import { useRef, useCallback } from 'react';
import { saveStrokes } from '../api/strokes';

export default function useCanvas(strokes, addToHistory) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  }, []);

  const startDrawing = useCallback((e, brushSize, color, isEraser) => {
    const ctx = getCtx();
    if (!ctx) return;

    isDrawingRef.current = true;
    currentStrokeRef.current = {
      points: [],
      color: isEraser ? '#FFFFFF' : color,
      width: brushSize
    };

    ctx.beginPath();
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    currentStrokeRef.current.points.push({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
  }, [getCtx]);

  const draw = useCallback((e) => {
    if (!isDrawingRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    currentStrokeRef.current.points.push({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
  }, [getCtx]);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 0) {
      addToHistory(currentStrokeRef.current);
      currentStrokeRef.current = null;
    }
  }, [addToHistory]);

  const redrawCanvas = useCallback((strokesToRedraw) => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesToRedraw.forEach(stroke => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }, [getCtx]);

  const clearCanvas = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [getCtx]);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    redrawCanvas,
    clearCanvas
  };
}