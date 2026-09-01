import { useRef, useCallback, useEffect } from 'react';

export default function useCanvas(strokes, addToHistory, onDraw) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const toolRef = useRef('pen');
  const shapeStartRef = useRef(null);
  const tempCanvasRef = useRef(null);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth - 40;
    canvas.height = window.innerHeight - 150;
    ctx.putImageData(imageData, 0, 0);
  }, [getCtx]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const setTool = useCallback((tool) => {
    toolRef.current = tool;
  }, []);

  const drawShape = useCallback((ctx, shape, startX, startY, endX, endY, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();

    switch (shape) {
      case 'rectangle':
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        break;
      case 'circle':
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'line':
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
    }
  }, []);

  const floodFill = useCallback((ctx, startX, startY, fillColor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    const startPos = (startY * width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    
    const fillR = parseInt(fillColor.slice(1, 3), 16);
    const fillG = parseInt(fillColor.slice(3, 5), 16);
    const fillB = parseInt(fillColor.slice(5, 7), 16);
    
    if (startR === fillR && startG === fillG && startB === fillB) return;
    
    const stack = [[startX, startY]];
    const visited = new Set();
    
    const matchesStart = (pos) => {
      return data[pos] === startR && data[pos + 1] === startG && data[pos + 2] === startB;
    };
    
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      
      const pos = (y * width + x) * 4;
      if (!matchesStart(pos)) continue;
      
      visited.add(key);
      data[pos] = fillR;
      data[pos + 1] = fillG;
      data[pos + 2] = fillB;
      data[pos + 3] = 255;
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const drawText = useCallback((ctx, text, x, y, color, fontSize) => {
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }, []);

  const startDrawing = useCallback((e, brushSize, color, isEraser) => {
    const ctx = getCtx();
    if (!ctx) return;

    isDrawingRef.current = true;
    const tool = toolRef.current;

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        drawText(ctx, text, e.nativeEvent.offsetX, e.nativeEvent.offsetY, color, brushSize * 3);
      }
      isDrawingRef.current = false;
      return;
    }

    if (tool === 'fill') {
      floodFill(ctx, e.nativeEvent.offsetX, e.nativeEvent.offsetY, color);
      isDrawingRef.current = false;
      return;
    }

    if (['rectangle', 'circle', 'line'].includes(tool)) {
      shapeStartRef.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      currentStrokeRef.current = {
        type: 'shape',
        shape: tool,
        startX: e.nativeEvent.offsetX,
        startY: e.nativeEvent.offsetY,
        endX: e.nativeEvent.offsetX,
        endY: e.nativeEvent.offsetY,
        color,
        width: brushSize
      };
    } else {
      currentStrokeRef.current = {
        type: 'stroke',
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
    }
  }, [getCtx]);

  const draw = useCallback((e) => {
    if (!isDrawingRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;

    const tool = toolRef.current;

    if (['rectangle', 'circle', 'line'].includes(tool)) {
      const start = shapeStartRef.current;
      if (!start) return;

      currentStrokeRef.current.endX = e.nativeEvent.offsetX;
      currentStrokeRef.current.endY = e.nativeEvent.offsetY;

      redrawCanvas(strokes);
      drawShape(ctx, tool, start.x, start.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, currentStrokeRef.current.color, currentStrokeRef.current.width);
      
      if (onDraw) {
        onDraw({ ...currentStrokeRef.current });
      }
    } else {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
      currentStrokeRef.current.points.push({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      });
      
      if (onDraw) {
        onDraw({ ...currentStrokeRef.current });
      }
    }
  }, [getCtx, strokes, drawShape, onDraw]);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentStrokeRef.current) {
      addToHistory(currentStrokeRef.current);
      currentStrokeRef.current = null;
      shapeStartRef.current = null;
    }
  }, [addToHistory]);

  const redrawCanvas = useCallback((strokesToRedraw) => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesToRedraw.forEach(stroke => {
      if (stroke.type === 'shape') {
        drawShape(ctx, stroke.shape, stroke.startX, stroke.startY, stroke.endX, stroke.endY, stroke.color, stroke.width);
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });
  }, [getCtx, drawShape]);

  const clearCanvas = useCallback(() => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [getCtx]);

  const downloadPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    redrawCanvas,
    clearCanvas,
    downloadPNG,
    setTool
  };
}
