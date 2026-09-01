# Phase 6.3: Layer UI

## Objective

Create a layer panel component for the sidebar that allows users to manage layers.

## Component Design

```jsx
// client/src/components/LayerPanel.jsx

function LayerPanel({ 
  layers, 
  activeLayerId, 
  onSelectLayer,
  onCreateLayer,
  onDeleteLayer,
  onToggleVisibility,
  onToggleLock,
  onReorderLayers,
  onRenameLayer
}) {
  return (
    <div className="layer-panel">
      <div className="layer-header">
        <h3>Layers</h3>
        <button onClick={onCreateLayer}>+ Add Layer</button>
      </div>
      
      <div className="layer-list">
        {layers.map((layer, index) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            isActive={layer.id === activeLayerId}
            onSelect={() => onSelectLayer(layer.id)}
            onDelete={() => onDeleteLayer(layer.id)}
            onToggleVisibility={() => onToggleVisibility(layer.id)}
            onToggleLock={() => onToggleLock(layer.id)}
            onRename={(name) => onRenameLayer(layer.id, name)}
            index={index}
            totalLayers={layers.length}
            onMoveUp={() => onReorderLayers(index, index - 1)}
            onMoveDown={() => onReorderLayers(index, index + 1)}
          />
        ))}
      </div>
    </div>
  );
}
```

## Layer Item Component

```jsx
function LayerItem({ 
  layer, 
  isActive, 
  onSelect, 
  onDelete, 
  onToggleVisibility, 
  onToggleLock,
  onRename,
  index,
  totalLayers,
  onMoveUp,
  onMoveDown
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(layer.name);

  return (
    <div className={`layer-item ${isActive ? 'active' : ''}`}>
      <button className="visibility-toggle" onClick={onToggleVisibility}>
        {layer.visible ? '👁️' : '👁️‍🗨️'}
      </button>
      
      <button className="lock-toggle" onClick={onToggleLock}>
        {layer.locked ? '🔒' : '🔓'}
      </button>
      
      {isEditing ? (
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => { onRename(name); setIsEditing(false); }}
          autoFocus
        />
      ) : (
        <span className="layer-name" onDoubleClick={() => setIsEditing(true)}>
          {layer.name}
        </span>
      )}
      
      <div className="layer-actions">
        <button onClick={onMoveUp} disabled={index === 0}>↑</button>
        <button onClick={onMoveDown} disabled={index === totalLayers - 1}>↓</button>
        <button onClick={onDelete} disabled={totalLayers === 1}>🗑️</button>
      </div>
    </div>
  );
}
```

## Tasks

- [ ] Create `client/src/components/LayerPanel.jsx`
- [ ] Add layer panel to Sidebar component
- [ ] Add layer panel styles to `index.css`
- [ ] Implement drag-to-reorder functionality
- [ ] Add layer opacity slider
- [ ] Test layer panel UI

## Styles

```css
.layer-panel {
  padding: 10px;
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.layer-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.layer-item.active {
  background: #e3f2fd;
  border: 1px solid #2196f3;
}

.layer-name {
  flex: 1;
}

.layer-actions {
  display: flex;
  gap: 4px;
}
```

## Notes

- Layer panel appears in sidebar under "Layers" section
- Active layer is highlighted
- Double-click to rename layer
- Layers can be reordered with up/down buttons or drag-and-drop
- Delete button disabled when only one layer exists
