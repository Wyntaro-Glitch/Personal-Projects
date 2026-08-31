import { useState } from 'react';

export default function Sidebar({
  brushSize,
  setBrushSize,
  color,
  setColor,
  isEraser,
  setIsEraser,
  currentTool,
  setCurrentTool
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({
    tools: true,
    brush: true,
    color: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const tools = [
    { id: 'pen', name: 'Pen', icon: '✏️' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'line', name: 'Line', icon: '📏' },
    { id: 'fill', name: 'Fill', icon: '🪣' },
    { id: 'text', name: 'Text', icon: '📝' }
  ];

  if (collapsed) {
    return (
      <div className="sidebar collapsed">
        <button className="sidebar-toggle" onClick={() => setCollapsed(false)}>
          ☰
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Tools</span>
        <button className="sidebar-toggle" onClick={() => setCollapsed(true)}>
          ✕
        </button>
      </div>

      <div className="sidebar-section">
        <div className="section-header" onClick={() => toggleSection('tools')}>
          <span>Drawing Tools</span>
          <span>{openSections.tools ? '▼' : '▶'}</span>
        </div>
        {openSections.tools && (
          <div className="section-content">
            <div className="tool-grid">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  className={`tool-btn ${currentTool === tool.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTool(tool.id);
                    setIsEraser(false);
                  }}
                  title={tool.name}
                >
                  {tool.icon}
                </button>
              ))}
              <button
                className={`tool-btn eraser-btn ${isEraser ? 'active' : ''}`}
                onClick={() => {
                  setIsEraser(!isEraser);
                  setCurrentTool('pen');
                }}
                title="Eraser"
              >
                🧹
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <div className="section-header" onClick={() => toggleSection('brush')}>
          <span>Brush</span>
          <span>{openSections.brush ? '▼' : '▶'}</span>
        </div>
        {openSections.brush && (
          <div className="section-content">
            <div className="brush-preview">
              <div
                className="brush-dot"
                style={{
                  width: Math.min(brushSize, 50),
                  height: Math.min(brushSize, 50),
                  backgroundColor: isEraser ? '#ccc' : color
                }}
              />
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="brush-slider"
            />
            <div className="brush-size-label">{brushSize}px</div>
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <div className="section-header" onClick={() => toggleSection('color')}>
          <span>Color</span>
          <span>{openSections.color ? '▼' : '▶'}</span>
        </div>
        {openSections.color && (
          <div className="section-content">
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setIsEraser(false);
                }}
                className="color-picker"
              />
              <span className="color-value">{color}</span>
            </div>
            <div className="color-presets">
              {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(c => (
                <button
                  key={c}
                  className="color-preset"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    setColor(c);
                    setIsEraser(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
