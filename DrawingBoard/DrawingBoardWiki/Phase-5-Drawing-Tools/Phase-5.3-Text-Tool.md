# Phase 5.3: Text Tool

> **Status:** ⬜ Not Started  
> **Priority:** Medium  
> **Depends On:** [[Phase-5.2-Fill-Bucket]]

## Objective

Add text annotation tool.

## Why This Matters

Text enables labeling, notes, and annotations essential for collaborative work.

## Deliverables

- [ ] Click to place text
- [ ] Font size option
- [ ] Font color
- [ ] Text preview

## Tasks

### 1. Add to `client/src/utils/drawingTools.js`

```javascript
export function drawText(ctx, x, y, text, color, fontSize = 16) {
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
```

### 2. Create `client/src/components/TextTool.jsx`

```jsx
import { useState } from 'react';

export default function TextTool({ onAddText, onCancel }) {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddText({ text, fontSize });
      setText('');
    }
  };

  return (
    <div className="text-tool-popup">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
          <option value={12}>12px</option>
          <option value={16}>16px</option>
          <option value={24}>24px</option>
          <option value={32}>32px</option>
          <option value={48}>48px</option>
        </select>
        <button type="submit">Add</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}
```

## Completion Checklist

- [ ] Text tool works
- [ ] Font size adjustable
- [ ] Text appears at click position

## Next Phase

→ [[Phase-5.4-Tool-UI]]
