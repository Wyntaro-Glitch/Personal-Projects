# Phase 5.4: Tool UI

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-5.3-Text-Tool]]

## Objective

Create tool selection interface.

## Deliverables

- [ ] Tool panel with icons
- [ ] Active tool highlighting
- [ ] Tool-specific options
- [ ] Keyboard shortcuts

## Tasks

### 1. Update `client/src/components/Toolbar.jsx`

```jsx
export default function Toolbar({
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  color,
  setColor,
  // ... other props
}) {
  const tools = [
    { id: 'pencil', icon: '✏️', name: 'Pencil' },
    { id: 'eraser', icon: '🧹', name: 'Eraser' },
    { id: 'rectangle', icon: '⬜', name: 'Rectangle' },
    { id: 'circle', icon: '⭕', name: 'Circle' },
    { id: 'line', icon: '📏', name: 'Line' },
    { id: 'arrow', icon: '➡️', name: 'Arrow' },
    { id: 'fill', icon: '🪣', name: 'Fill' },
    { id: 'text', icon: '📝', name: 'Text' },
  ];

  return (
    <div className="toolbar">
      <div className="tool-buttons">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={activeTool === tool.id ? 'active' : ''}
            onClick={() => setActiveTool(tool.id)}
            title={tool.name}
          >
            {tool.icon}
          </button>
        ))}
      </div>
      <div className="tool-options">
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
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
    </div>
  );
}
```

## Completion Checklist

- [ ] Tool panel displays
- [ ] Active tool highlights
- [ ] Tool options work

## Next Phase

→ [[Phase-5.5-Broadcast-Tools]]
