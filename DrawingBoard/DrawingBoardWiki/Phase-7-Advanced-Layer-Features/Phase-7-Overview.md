# Phase 7: Advanced Layer Features

## Overview

This phase covers advanced layer features that will be implemented in the future.

## Planned Features

### 7.1 Layer Groups

Organize layers into collapsible groups.

**Features:**
- Create layer groups
- Collapse/expand groups
- Move layers into groups
- Group visibility toggle
- Group opacity

**UI:**
```
▼ Group 1
    Layer 1
    Layer 2
▶ Group 2
    Layer 3
```

### 7.2 Duplicate Layer

Create an exact copy of a layer.

**Features:**
- Duplicate with all strokes
- Duplicate with properties (blend mode, opacity)
- Option to duplicate to new position
- Rename duplicated layer

### 7.3 Layer Masks

Apply masks to layers for non-destructive editing.

**Features:**
- Layer masks
- Clipping masks
- Mask editing
- Mask enable/disable

### 7.4 Adjustment Layers

Non-destructive color and tonal adjustments.

**Features:**
- Brightness/Contrast
- Hue/Saturation
- Levels
- Curves
- Color Balance

### 7.5 Fill Layers

Solid color, gradient, or pattern fill layers.

**Features:**
- Solid color fill
- Gradient fill
- Pattern fill
- Edit fill properties

### 7.6 Layer Effects

Apply effects to layers.

**Features:**
- Drop shadow
- Inner shadow
- Outer glow
- Inner glow
- Bevel and emboss
- Stroke

## Priority

| Feature | Priority | Complexity |
|---------|----------|------------|
| Layer Groups | High | Medium |
| Duplicate Layer | High | Low |
| Layer Masks | Medium | High |
| Adjustment Layers | Medium | High |
| Fill Layers | Low | Medium |
| Layer Effects | Low | High |

## Dependencies

- Phase 6: Layers (completed)
- Phase 6.6: Broadcast Layers (for real-time sync)

## Technical Notes

### Layer Groups

Groups will be stored as a special layer type with a `type: 'group'` property and a `children` array containing layer IDs.

### Duplicate Layer

Duplicating a layer creates a deep copy of the layer object including all strokes. The new layer is placed above the original.

### Layer Masks

Masks will be stored as a separate canvas/image data within the layer object. The mask affects the layer's alpha channel.

### Adjustment Layers

Adjustment layers will use CSS filters or canvas pixel manipulation to apply effects non-destructively.

### Fill Layers

Fill layers will render a solid color, gradient, or pattern as the layer content instead of strokes.
