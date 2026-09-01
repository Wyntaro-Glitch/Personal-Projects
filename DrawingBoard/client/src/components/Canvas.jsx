import { useEffect, useRef, useCallback, useState } from 'react';
import { renderAllLayers } from '../canvas/layerRenderer';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;

export default function Canvas({ 
  brushSize,
  color,
  isEraser,
  layers,
  activeLayerId,
  onCursorMove,
  currentTool,
  onDraw,
  onStrokesChange,
  onResetViewReady,
  onRemoteRenderReady,
  width = 1920,
  height = 1080
}) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const shapeStartRef = useRef(null);
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const spaceRef = useRef(false);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const lastEmitRef = useRef(0);
  const EMIT_THROTTLE_MS = 16;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  // Refs for stable access in event handlers
  const layersRef = useRef(layers);
  const activeLayerIdRef = useRef(activeLayerId);
  const currentToolRef = useRef(currentTool);
  const brushSizeRef = useRef(brushSize);
  const colorRef = useRef(color);
  const isEraserRef = useRef(isEraser);
  const onStrokesChangeRef = useRef(onStrokesChange);
  const onDrawRef = useRef(onDraw);
  const onCursorMoveRef = useRef(onCursorMove);

  useEffect(() => { layersRef.current = layers; }, [layers]);
  useEffect(() => { activeLayerIdRef.current = activeLayerId; }, [activeLayerId]);
  useEffect(() => { currentToolRef.current = currentTool; }, [currentTool]);
  useEffect(() => { brushSizeRef.current = brushSize; }, [brushSize]);
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { isEraserRef.current = isEraser; }, [isEraser]);
  useEffect(() => { onStrokesChangeRef.current = onStrokesChange; }, [onStrokesChange]);
  useEffect(() => { onDrawRef.current = onDraw; }, [onDraw]);
  useEffect(() => { onCursorMoveRef.current = onCursorMove; }, [onCursorMove]);

  // Re-render when layers change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderAllLayers(ctx, layers, width, height);
  }, [layers, width, height]);

  // Direct render function for remote strokes (bypasses React re-renders)
  const renderRemoteStrokes = useCallback((strokes) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const values = Object.values(strokes || {});
    for (const stroke of values) {
      if (stroke.type === 'shape') {
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        if (stroke.shape === 'rectangle') {
          ctx.strokeRect(stroke.startX, stroke.startY, stroke.endX - stroke.startX, stroke.endY - stroke.startY);
        } else if (stroke.shape === 'circle') {
          const cx = (stroke.startX + stroke.endX) / 2;
          const cy = (stroke.startY + stroke.endY) / 2;
          ctx.ellipse(cx, cy, Math.abs(stroke.endX - stroke.startX) / 2, Math.abs(stroke.endY - stroke.startY) / 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (stroke.shape === 'line') {
          ctx.moveTo(stroke.startX, stroke.startY);
          ctx.lineTo(stroke.endX, stroke.endY);
          ctx.stroke();
        }
      } else if (stroke.type === 'stroke' && stroke.points && stroke.points.length > 0) {
        ctx.beginPath();
        ctx.lineWidth = stroke.size;
        ctx.strokeStyle = stroke.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
    }
  }, [width, height]);

  // Expose renderRemoteStrokes to parent
  useEffect(() => {
    if (onRemoteRenderReady) {
      onRemoteRenderReady(renderRemoteStrokes);
    }
  }, [renderRemoteStrokes, onRemoteRenderReady]);

  // Set up canvas once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    renderAllLayers(ctx, layers, width, height);

    // Expose resetView to parent
    if (onResetViewReady) {
      onResetViewReady(() => {
        zoomRef.current = 1;
        panRef.current = { x: 0, y: 0 };
        setZoom(1);
        setPan({ x: 0, y: 0 });
      });
    }
  }, []); // Only once on mount

  // Space key for pan mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        spaceRef.current = true;
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        spaceRef.current = false;
        if (isPanningRef.current) {
          isPanningRef.current = false;
          setIsPanning(false);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Zoom with scroll wheel toward mouse position
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const oldZoom = zoomRef.current;
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldZoom + delta));

    // Canvas point under mouse before zoom
    const canvasX = (mouseX - panRef.current.x) / oldZoom;
    const canvasY = (mouseY - panRef.current.y) / oldZoom;

    // New pan so the same canvas point stays under mouse
    const newPanX = mouseX - canvasX * newZoom;
    const newPanY = mouseY - canvasY * newZoom;

    panRef.current = { x: newPanX, y: newPanY };
    setPan({ x: newPanX, y: newPanY });

    zoomRef.current = newZoom;
    setZoom(newZoom);
  }, []);

  // Attach wheel listener with passive: false for preventDefault
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const getCoords = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      displayX: e.clientX - rect.left,
      displayY: e.clientY - rect.top
    };
  }, []);

  const handlePointerDown = useCallback((e) => {
    // Pan mode with space
    if (spaceRef.current) {
      isPanningRef.current = true;
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    const coords = getCoords(e);
    if (!coords) return;
    const { x, y } = coords;

    const layer = layersRef.current.find(l => l.id === activeLayerIdRef.current);
    if (!layer || layer.locked || layer.type === 'paper') {
      if (layer?.locked) alert('Cannot draw on a locked layer');
      return;
    }

    isDrawingRef.current = true;
    const tool = currentToolRef.current;
    const bs = brushSizeRef.current;
    const clr = colorRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        renderAllLayers(ctx, layersRef.current, width, height);
        ctx.font = `${bs * 3}px Arial`;
        ctx.fillStyle = clr;
        ctx.fillText(text, x, y);
        onStrokesChangeRef.current({
          id: generateId(), tool: 'text', text, x, y, color: clr, size: bs * 3
        });
      }
      isDrawingRef.current = false;
      return;
    }

    if (tool === 'fill') {
      isDrawingRef.current = false;
      return;
    }

    if (['rectangle', 'circle', 'line'].includes(tool)) {
      shapeStartRef.current = { x, y };
      currentStrokeRef.current = {
        id: generateId(), type: 'shape', shape: tool,
        startX: x, startY: y, endX: x, endY: y,
        color: clr, size: bs
      };
    } else {
      currentStrokeRef.current = {
        id: generateId(), type: 'stroke', tool,
        points: [{ x, y }],
        color: isEraserRef.current ? '#FFFFFF' : clr,
        size: bs
      };
      renderAllLayers(ctx, layersRef.current, width, height);
      ctx.beginPath();
      ctx.lineWidth = bs;
      ctx.strokeStyle = isEraserRef.current ? '#FFFFFF' : clr;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(x, y);
    }
  }, [getCoords, width, height]);

  const handlePointerMove = useCallback((e) => {
    // Pan mode
    if (isPanningRef.current) {
      const newX = e.clientX - panStartRef.current.x;
      const newY = e.clientY - panStartRef.current.y;
      panRef.current = { x: newX, y: newY };
      setPan({ x: newX, y: newY });
      return;
    }

    const coords = getCoords(e);
    if (!coords) return;
    const { x, y } = coords;

    if (!isDrawingRef.current || !currentStrokeRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const tool = currentToolRef.current;
    const bs = brushSizeRef.current;
    const clr = colorRef.current;

    if (['rectangle', 'circle', 'line'].includes(tool)) {
      const start = shapeStartRef.current;
      if (!start) return;
      currentStrokeRef.current.endX = x;
      currentStrokeRef.current.endY = y;

      renderAllLayers(ctx, layersRef.current, width, height);
      ctx.strokeStyle = clr;
      ctx.lineWidth = bs;
      ctx.beginPath();
      
      if (tool === 'rectangle') {
        ctx.strokeRect(start.x, start.y, x - start.x, y - start.y);
      } else if (tool === 'circle') {
        const centerX = (start.x + x) / 2;
        const centerY = (start.y + y) / 2;
        ctx.ellipse(centerX, centerY, Math.abs(x - start.x) / 2, Math.abs(y - start.y) / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      const now = performance.now();
      if (now - lastEmitRef.current >= EMIT_THROTTLE_MS) {
        lastEmitRef.current = now;
        onDrawRef.current({ ...currentStrokeRef.current });
      }
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      currentStrokeRef.current.points.push({ x, y });
      const now = performance.now();
      if (now - lastEmitRef.current >= EMIT_THROTTLE_MS) {
        lastEmitRef.current = now;
        onDrawRef.current({ ...currentStrokeRef.current });
      }
    }
  }, [getCoords, width, height]);

  const handlePointerUp = useCallback(() => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      setIsPanning(false);
      return;
    }
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    isDrawingRef.current = false;
    // Send final realtime frame so remote sees the complete stroke before it becomes permanent
    onDrawRef.current({ ...currentStrokeRef.current });
    onStrokesChangeRef.current(currentStrokeRef.current);
    currentStrokeRef.current = null;
    shapeStartRef.current = null;
  }, []);

  const cursorStyle = isPanning ? 'grabbing' : (spaceRef.current ? 'grab' : 'crosshair');

  return (
    <div 
      ref={containerRef}
      className="canvas-container"
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          border: '1px solid #ccc',
          cursor: cursorStyle,
          maxWidth: '100%',
          maxHeight: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isPanning ? 'none' : undefined
        }}
      />
      <canvas
        ref={overlayRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          background: 'transparent',
          maxWidth: '100%',
          maxHeight: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isPanning ? 'none' : undefined
        }}
      />
      <div className="zoom-indicator">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
