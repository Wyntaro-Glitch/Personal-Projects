# Phase 5: Drawing Tools

> **Status:** 🔄 In Progress  
> **Priority:** High  
> **Depends On:** [[Phase-4-Rooms/Phase-4-Rooms]]

## Objective

Add professional drawing tools for collaborative work.

## Why This Matters

Basic pencil drawing is limited. Professional tools enable better collaboration and creativity.

## Tools to Implement

| Tool | Description | Priority |
|------|-------------|----------|
| **Shape Tools** | Rectangle, Circle, Line, Arrow | High |
| **Fill Bucket** | Flood fill areas with color | Medium |
| **Text Tool** | Add text annotations | Medium |
| **Eyedropper** | Pick color from canvas | Low |
| **Selection Tool** | Move/resize drawn elements | Low |
| **Brush Styles** | Solid, dashed, dotted | Low |

## File Structure

```
client/src/
├── components/
│   ├── Toolbar.jsx      # Updated with new tools
│   ├── ShapeTool.jsx    # NEW - Shape options
│   └── TextTool.jsx     # NEW - Text input
├── hooks/
│   └── useCanvas.js     # Updated with shape drawing
└── utils/
    └── drawingTools.js  # NEW - Tool implementations

server/
└── server.js            # Updated to broadcast tool data
```

## Deliverables

- [ ] Shape tools (rectangle, circle, line)
- [ ] Fill bucket tool
- [ ] Text tool
- [ ] Tool selection UI
- [ ] Tool-specific options (stroke width, fill)
- [ ] Broadcast tools to all users

## Sub-Phases

| Sub-Phase | Name | Status |
|-----------|------|--------|
| 5.1 | Shape Tools | ⬜ Not Started |
| 5.2 | Fill Bucket | ⬜ Not Started |
| 5.3 | Text Tool | ⬜ Not Started |
| 5.4 | Tool UI | ⬜ Not Started |
| 5.5 | Broadcast Tools | ⬜ Not Started |

## Next Phase

→ [[Phase-6-Collaboration-Features]]
