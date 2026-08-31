# Phase 7: Documentation

> **Status:** ⬜ Not Started  
> **Priority:** Low  
> **Depends On:** [[Phase-6-Polish]]

## Objective

Write project README with setup instructions.

## Why This Matters

Essential for project maintainability and sharing with others.

## Deliverables

- [ ] README.md file
- [ ] Setup instructions
- [ ] Feature list
- [ ] How to run

## Tasks

### 1. Create README.md

```markdown
# DrawingBoard

A local canvas drawing server built with Node.js and HTML5 Canvas.

## Features

- Freehand drawing with smooth strokes
- Adjustable brush size
- Color picker for any color
- Eraser mode
- Undo/Redo functionality
- Save/Load strokes (persist on reload)
- Download canvas as PNG
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- Responsive canvas (fills window)

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd DrawingBoard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open browser to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
DrawingBoard/
├── server.js          # Express server with API endpoints
├── package.json       # Project dependencies
├── public/
│   ├── index.html     # Main HTML page
│   ├── style.css      # Styling
│   └── app.js         # Canvas drawing logic
└── README.md          # This file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /strokes | Retrieve all saved strokes |
| POST | /strokes | Save strokes array |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo last stroke |
| Ctrl+Y | Redo undone stroke |

## License

MIT
```

**What this does:**
- Documents the project for others (and future you)
- Explains how to set up and run
- Lists features and architecture

## Completion Checklist

- [ ] README.md exists
- [ ] Setup instructions are clear
- [ ] All features listed
- [ ] How to run is explained
- [ ] Project structure documented

## Verification

1. Read README.md
2. Follow setup instructions from scratch
3. Verify everything works as documented

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Instructions don't work | Missing step | Test each command |
| Features not listed | Forgot to update | Review what was built |
| Structure wrong | File paths changed | Update diagram |
