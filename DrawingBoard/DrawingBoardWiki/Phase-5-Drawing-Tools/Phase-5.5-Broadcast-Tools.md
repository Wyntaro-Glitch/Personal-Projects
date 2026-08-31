# Phase 5.5: Broadcast Tools

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-5.4-Tool-UI]]

## Objective

Broadcast tool usage to all connected users.

## Why This Matters

Collaboration requires everyone to see shapes, text, and fills in real-time.

## Deliverables

- [ ] Broadcast shape data
- [ ] Broadcast fill operations
- [ ] Broadcast text additions
- [ ] Sync tool state

## Tasks

### 1. Update Stroke Data Structure

```javascript
// Old stroke format
{ points: [...], color: '#000', width: 5 }

// New stroke format
{
  tool: 'pencil' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'fill' | 'text',
  points: [...],
  color: '#000',
  width: 5,
  fill: false,
  text: 'Hello',
  fontSize: 16,
  startX: 100,
  startY: 100,
  endX: 200,
  endY: 200
}
```

### 2. Update `server/server.js`

Handle different stroke types when broadcasting.

### 3. Update `client/src/hooks/useCanvas.js`

Replay strokes based on tool type.

## Completion Checklist

- [ ] Shapes broadcast correctly
- [ ] Fill operations sync
- [ ] Text syncs
- [ ] All users see same canvas

## Phase Complete

All Drawing Tools phases done! 🎉
