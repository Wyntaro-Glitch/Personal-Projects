# Special Layer Functions

Based on Clip Studio Paint's layer logic, these are advanced layer operations that can be implemented for a professional drawing experience.

## Core Functions

| Function | Description | Priority |
|----------|-------------|----------|
| [[Clipping-Group]] | Clip layer to below layer | High |
| [[Layer-Mask]] | Hide parts of layer non-destructively | High |
| [[Alpha-Lock]] | Lock transparent pixels | Medium |
| [[Lock-Pixels]] | Prevent any edits to layer | Medium |
| [[Merge-Down]] | Merge layer with layer below | Medium |
| [[Flatten]] | Merge all layers into one | Low |
| [[Duplicate-Layer]] | Create exact copy of layer | High |
| [[Clear-Layer]] | Remove all strokes from layer | High |

## Advanced Functions

| Function | Description | Priority |
|----------|-------------|----------|
| [[Layer-Groups]] | Organize layers into folders | Medium |
| [[Reference-Layer]] | Use as reference for fill/selection | Low |
| [[Layer-Color]] | Toggle layer color overlay | Low |
| [[Outline-Stroke]] | Add outline to layer content | Low |
| [[Layer-Effect]] | Drop shadow, glow, etc. | Low |

## Blend Modes (Standard Set)

| Mode | Canvas Value | Description |
|------|--------------|-------------|
| Normal | `source-over` | Default blending |
| Multiply | `multiply` | Darkens by multiplying colors |
| Screen | `screen` | Lightens by inverting and multiplying |
| Overlay | `overlay` | Combines multiply and screen |
| Darken | `darken` | Keeps darker of source/destination |
| Lighten | `lighten` | Keeps lighter of source/destination |

## Implementation Notes

- Each function should be implemented as an **operation** in the operation system
- Each operation must have an **inverse** for undo/redo
- Each operation must be **serializable** for Socket.io and MongoDB
- Each operation must include **before/after state** when necessary
