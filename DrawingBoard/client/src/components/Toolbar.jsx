export default function Toolbar({
  brushSize,
  setBrushSize,
  color,
  setColor,
  isEraser,
  setIsEraser,
  clearCanvas,
  undo,
  redo,
  canUndo,
  canRedo,
  downloadPNG,
  currentTool,
  setCurrentTool
}) {
  return (
    <div className="toolbar">
      <div className="tool-group">
        <label>Brush:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
      </div>
      <div className="tool-group">
        <label>Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            setIsEraser(false);
          }}
        />
      </div>
      <div className="tool-group">
        <label>Tools:</label>
        <button
          className={currentTool === 'pen' ? 'active' : ''}
          onClick={() => { setCurrentTool('pen'); setIsEraser(false); }}
        >
          Pen
        </button>
        <button
          className={currentTool === 'rectangle' ? 'active' : ''}
          onClick={() => { setCurrentTool('rectangle'); setIsEraser(false); }}
        >
          Rectangle
        </button>
        <button
          className={currentTool === 'circle' ? 'active' : ''}
          onClick={() => { setCurrentTool('circle'); setIsEraser(false); }}
        >
          Circle
        </button>
        <button
          className={currentTool === 'line' ? 'active' : ''}
          onClick={() => { setCurrentTool('line'); setIsEraser(false); }}
        >
          Line
        </button>
        <button
          className={currentTool === 'fill' ? 'active' : ''}
          onClick={() => { setCurrentTool('fill'); setIsEraser(false); }}
        >
          Fill
        </button>
        <button
          className={currentTool === 'text' ? 'active' : ''}
          onClick={() => { setCurrentTool('text'); setIsEraser(false); }}
        >
          Text
        </button>
        <button
          className={isEraser ? 'active' : ''}
          onClick={() => { setIsEraser(!isEraser); setCurrentTool('pen'); }}
        >
          Eraser
        </button>
      </div>
      <div className="tool-group">
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
        <button onClick={downloadPNG}>Download</button>
      </div>
    </div>
  );
}
