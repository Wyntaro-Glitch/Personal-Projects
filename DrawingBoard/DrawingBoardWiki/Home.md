# DrawingBoard Wiki

> Local Canvas Drawing Server - Personal Project Tracker
> 
> **Last Updated:** 2026-08-31

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express (API)
- **Canvas:** HTML5 Canvas API

## Quick Links

- [[Progress]] - Overall project status
- [[Issue-Backtracking]] - Debugging guide
- [[Recommendations]] - Best practices and improvements
- [[Backtrack-Changes]] - Changes needed from original plan

## Phases

| Phase | Name | Status | Link |
|-------|------|--------|------|
| 1 | Project Setup (React) | ✅ Completed | [[Phase-1-Setup-React]] |
| 2 | Server (API Only) | ✅ Completed | [[Phase-2-Server-API]] |
| 3 | React App + Canvas | ✅ Completed | [[Phase-3-React-Canvas]] |
| 4 | Drawing Tools | ✅ Completed | [[Phase-4-Tools]] |
| 5 | State Management | ✅ Completed | [[Phase-5-State]] |
| 6 | Polish | 🔄 In Progress | [[Phase-6-Polish]] |
| 7 | Documentation | ⬜ Not Started | [[Phase-7-Documentation]] |

## Project Structure (Target)

```
DrawingBoard/
├── server/                 # Backend
│   ├── server.js           # Express API server
│   └── package.json
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── components/
│   │   │   ├── Canvas.jsx  # Drawing canvas
│   │   │   └── Toolbar.jsx # Drawing controls
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── DrawingBoardWiki/       # This wiki
```

## Success Criteria

- [x] `npm start` runs both server and client
- [x] React app loads at localhost:5173
- [x] Express API runs at localhost:3000
- [x] Drawing works in React canvas component
- [ ] Brush size and color can be changed
- [ ] Undo/redo works
- [ ] Strokes persist via API
