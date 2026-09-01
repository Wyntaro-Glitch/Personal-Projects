import { useState, useRef } from 'react';

const BLEND_MODES = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' }
];

export default function LayerPanel({ 
  layers, 
  activeLayerId, 
  onSelectLayer,
  onCreateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveLayer,
  onToggleVisibility,
  onToggleLock,
  onToggleClipping,
  onToggleAlphaLock,
  onRenameLayer,
  onSetBlendMode,
  onSetOpacity,
  onClearLayer,
  onSetPaperColor,
  onSetPaperTransparent,
  onResetView
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [dragOverId, setDragOverId] = useState(null);
  const dragIdRef = useRef(null);

  const activeLayer = layers.find(l => l.id === activeLayerId);
  const isPaperActive = activeLayer?.type === 'paper';
  const currentBlendMode = activeLayer?.blendMode || 'source-over';
  const currentOpacity = activeLayer ? Math.round(activeLayer.opacity * 100) : 100;

  const handleStartEdit = (layer) => {
    if (layer.type === 'paper') return;
    setEditingId(layer.id);
    setEditName(layer.name);
  };

  const handleFinishEdit = () => {
    if (editName.trim()) {
      onRenameLayer(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (e, layerId) => {
    e.stopPropagation();
    const layer = layers.find(l => l.id === layerId);
    if (layer?.type === 'paper') return;
    if (layers.length <= 2) return;
    if (window.confirm('Delete this layer and all its strokes?')) {
      onDeleteLayer(layerId);
    }
  };

  const handleClear = (e, layerId) => {
    e.stopPropagation();
    const layer = layers.find(l => l.id === layerId);
    if (layer?.type === 'paper') return;
    if (layer && layer.strokes.length > 0) {
      if (window.confirm('Clear all strokes from this layer?')) {
        onClearLayer(layerId);
      }
    }
  };

  const handleDragStart = (e, layerId) => {
    dragIdRef.current = layerId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', layerId);
    requestAnimationFrame(() => {
      e.target.classList.add('dragging');
    });
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    dragIdRef.current = null;
    setDragOverId(null);
  };

  const handleDragOver = (e, layerId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (layerId !== dragIdRef.current) {
      setDragOverId(layerId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, toId) => {
    e.preventDefault();
    const fromId = dragIdRef.current;
    if (fromId && fromId !== toId) {
      onMoveLayer(fromId, toId);
    }
    setDragOverId(null);
    dragIdRef.current = null;
  };

  const paperLayer = layers.find(l => l.type === 'paper');
  const strokeLayers = layers.filter(l => l.type !== 'paper');
  const displayLayers = [...strokeLayers].reverse();

  return (
    <div className="layer-panel">
      {/* Layer Properties - Top Section */}
      <div className="layer-properties">
        <div className="property-row">
          <select
            className="blend-mode-dropdown"
            value={currentBlendMode}
            onChange={(e) => onSetBlendMode(activeLayerId, e.target.value)}
            disabled={isPaperActive}
          >
            {BLEND_MODES.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
          
          <div className="opacity-control">
            <input
              type="range"
              className="opacity-slider"
              min="0"
              max="100"
              value={currentOpacity}
              onChange={(e) => onSetOpacity(activeLayerId, parseInt(e.target.value) / 100)}
            />
            <span className="opacity-value">{currentOpacity}%</span>
          </div>
        </div>
        
        <div className="layer-actions-bar">
          <button className="action-btn" title="New Layer" onClick={() => onCreateLayer()}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
          <button 
            className="action-btn" 
            title="Duplicate Layer"
            onClick={() => onDuplicateLayer(activeLayerId)}
            disabled={!activeLayer || isPaperActive}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M4 6V3h9v9h-3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>
          <button 
            className="action-btn" 
            title="Clear Layer"
            onClick={(e) => handleClear(e, activeLayerId)}
            disabled={!activeLayer || isPaperActive || activeLayer.strokes.length === 0}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 4h10M6 4V3h4v1M5 4v9h6V4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </button>
          <button 
            className="action-btn delete-action" 
            title="Delete Layer"
            onClick={(e) => handleDelete(e, activeLayerId)}
            disabled={!activeLayer || isPaperActive || layers.length <= 2}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
          <button 
            className="action-btn" 
            title="Center to Canvas"
            onClick={onResetView}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="10" height="10" rx="1"/>
              <circle cx="8" cy="8" r="2"/>
              <line x1="8" y1="1" x2="8" y2="3"/>
              <line x1="8" y1="13" x2="8" y2="15"/>
              <line x1="1" y1="8" x2="3" y2="8"/>
              <line x1="13" y1="8" x2="15" y2="8"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Layer List */}
      <div className="layer-list">
        {displayLayers.map((layer) => (
          <div 
            key={layer.id}
            className={`layer-item ${layer.id === activeLayerId ? 'active' : ''} ${dragOverId === layer.id ? 'drag-over' : ''}`}
            onClick={() => onSelectLayer(layer.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, layer.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, layer.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, layer.id)}
          >
            <button 
              className={`visibility-btn ${!layer.visible ? 'hidden' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
              title={layer.visible ? 'Hide Layer' : 'Show Layer'}
            >
              {layer.visible ? '👁️' : ''}
            </button>
            
            <span className="layer-edit-icon">✏️</span>
            
            <div className="layer-thumbnail">
              <div className="thumbnail-checkerboard"></div>
            </div>
            
            <div className="layer-info">
              {editingId === layer.id ? (
                <input
                  className="layer-name-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleFinishEdit}
                  onKeyDown={(e) => e.key === 'Enter' && handleFinishEdit()}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span className="layer-opacity-text">{Math.round(layer.opacity * 100)} % {BLEND_MODES.find(m => m.value === layer.blendMode)?.label || 'Normal'}</span>
                  <span 
                    className="layer-name"
                    onDoubleClick={() => handleStartEdit(layer)}
                  >
                    {layer.name}
                  </span>
                </>
              )}
            </div>
            
            <div className="layer-badges">
              {layer.clipping && <span className="badge" title="Clipping Group">📎</span>}
              {layer.alphaLock && <span className="badge" title="Alpha Lock">🔒</span>}
              {layer.locked && <span className="badge" title="Locked">🔐</span>}
            </div>
          </div>
        ))}

        {/* Paper Layer - Always at bottom, not draggable */}
        {paperLayer && (
          <div 
            className={`layer-item paper-layer ${paperLayer.id === activeLayerId ? 'active' : ''}`}
            onClick={() => onSelectLayer(paperLayer.id)}
          >
            <button 
              className={`visibility-btn ${!paperLayer.visible ? 'hidden' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(paperLayer.id); }}
              title={paperLayer.visible ? 'Hide Layer' : 'Show Layer'}
            >
              {paperLayer.visible ? '👁️' : ''}
            </button>
            
            <span className="paper-layer-icon" title="Paper Layer">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <rect x="2" y="2" width="12" height="12" rx="1" 
                  fill={paperLayer.paperTransparent ? 'none' : paperLayer.paperColor} 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                />
                {paperLayer.paperTransparent && (
                  <>
                    <rect x="2" y="2" width="6" height="6" fill="#ccc"/>
                    <rect x="8" y="8" width="6" height="6" fill="#ccc"/>
                  </>
                )}
              </svg>
            </span>
            
            <div className="layer-thumbnail paper-thumbnail">
              {paperLayer.paperTransparent ? (
                <div className="thumbnail-checkerboard"></div>
              ) : (
                <div className="thumbnail-solid" style={{ backgroundColor: paperLayer.paperColor }}></div>
              )}
            </div>
            
            <div className="layer-info">
              <span className="layer-opacity-text">Paper</span>
              <span className="layer-name">Paper</span>
            </div>

            <div className="paper-layer-actions">
              <label className="paper-color-btn" title="Paper Color">
                <input
                  type="color"
                  value={paperLayer.paperColor || '#ffffff'}
                  onChange={(e) => onSetPaperColor(e.target.value)}
                  className="paper-color-input"
                />
                <span className="paper-color-swatch" style={{ backgroundColor: paperLayer.paperColor }}></span>
              </label>
              <button 
                className={`paper-transparent-btn ${paperLayer.paperTransparent ? 'active' : ''}`}
                title={paperLayer.paperTransparent ? 'Switch to Color' : 'Switch to Transparent'}
                onClick={(e) => { e.stopPropagation(); onSetPaperTransparent(!paperLayer.paperTransparent); }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16">
                  <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  {paperLayer.paperTransparent && (
                    <>
                      <rect x="2" y="2" width="6" height="6" fill="currentColor" opacity="0.3"/>
                      <rect x="8" y="8" width="6" height="6" fill="currentColor" opacity="0.3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
