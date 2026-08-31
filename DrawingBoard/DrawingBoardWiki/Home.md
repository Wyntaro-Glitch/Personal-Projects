# DrawingBoard Wiki

> Local Canvas Drawing Server - Personal Project Tracker

## Quick Links

- [[Progress]] - Overall project status
- [[Issue-Backtracking]] - Debugging guide

## Phases

| Phase | Name | Status | Link |
|-------|------|--------|------|
| 1 | Project Setup | ⬜ Not Started | [[Phase-1-Setup]] |
| 2 | Server Layer | ⬜ Not Started | [[Phase-2-Server]] |
| 3 | Canvas Frontend | ⬜ Not Started | [[Phase-3-Canvas]] |
| 4 | Drawing Tools | ⬜ Not Started | [[Phase-4-Tools]] |
| 5 | State Management | ⬜ Not Started | [[Phase-5-State]] |
| 6 | Polish | ⬜ Not Started | [[Phase-6-Polish]] |
| 7 | Documentation | ⬜ Not Started | [[Phase-9-Documentation]] |

## Project Structure

```
DrawingBoard/
├── server.js          # Express server
├── package.json       # Dependencies
├── public/
│   ├── index.html     # Main page
│   ├── style.css      # Styles
│   └── app.js         # Canvas logic
└── DrawingBoardWiki/  # This wiki
```

## Success Criteria

- [ ] `node server.js` starts without errors
- [ ] Drawing works at localhost:3000
- [ ] Brush size and color can be changed
- [ ] Undo/redo works
- [ ] Strokes persist after page reload
