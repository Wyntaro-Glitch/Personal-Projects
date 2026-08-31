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
  downloadPNG
}) {
  return (
    <div className="toolbar">
      <input
        type="range"
        min="1"
        max="50"
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          setIsEraser(false);
        }}
      />
      <button
        className={isEraser ? 'active' : ''}
        onClick={() => setIsEraser(!isEraser)}
      >
        Eraser
      </button>
      <button onClick={clearCanvas}>Clear</button>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
      <button onClick={downloadPNG}>Download PNG</button>
    </div>
  );
}