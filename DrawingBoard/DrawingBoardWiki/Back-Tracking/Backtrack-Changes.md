# Backtrack Changes

> What changed from the original vanilla JS plan to React + Vite
> 
> **Date:** 2026-08-31

## Summary

Original plan used vanilla HTML5 Canvas. Now using React + Vite for frontend.

## Phase Structure Change

**Original:** 7 phases (1-7)  
**New:** 2 main phases with sub-phases

| Original | New |
|----------|-----|
| Phase 1 | Phase 1.1 (Setup React) |
| Phase 2 | Phase 1.2 (Server API) |
| Phase 3 | Phase 1.3 (React Canvas) |
| Phase 4 | Phase 1.4 (Tools) |
| Phase 5 | Phase 1.5 (State) |
| Phase 6 | Phase 1.6 (Polish) |
| Phase 7 | Phase 2 (Socket + Cursors) |

## What Stays the Same

| Item | Status |
|------|--------|
| Node.js backend | ✅ Same |
| Express server | ✅ Same |
| API endpoints | ✅ Same |
| Phase 1-2 concepts | ✅ Same |

## What Changes

### Folder Structure

| Original | New |
|----------|-----|
| `public/index.html` | `client/src/App.jsx` |
| `public/app.js` | `client/src/components/Canvas.jsx` |
| `public/style.css` | `client/src/index.css` |
| `server.js` (root) | `server/server.js` |

### Package.json

| Original | New |
|----------|-----|
| Single `package.json` | Two: `server/package.json` + `client/package.json` |
| `express` only | `express` + React dependencies |

### Development Server

| Original | New |
|----------|-----|
| `node server.js` (port 3000) | `npm run dev` in client (port 5173) |
| Server serves HTML | Vite serves React app |
| Static files | Hot module reload |

### Code Structure

| Original | New |
|----------|-----|
| Global variables | React state hooks |
| `addEventListener` | React event handlers |
| Direct DOM manipulation | JSX rendering |
| Single file | Component-based |

## Files to Delete (Original Plan)

These files from the original plan are no longer needed:

- `public/index.html` (replaced by React)
- `public/app.js` (replaced by React components)
- `public/style.css` (replaced by React CSS)

## Files to Keep

- `server.js` → Move to `server/server.js`
- `package.json` → Split into two
- `.gitignore` → Update for React
- `DrawingBoardWiki/` → Keep as-is

## Migration Steps

1. Create new folder structure
2. Move server code to `server/`
3. Initialize React app with Vite in `client/`
4. Update `.gitignore` for React
5. Delete old `public/` folder
6. Test both servers run together

## Updated .gitignore

```
node_modules/
.env
*.log
dist/
.vite/
```

## New Dependencies

### Server (`server/package.json`)
- express
- cors (for cross-origin requests)
- dotenv
- socket.io (Phase 2.1)

### Client (`client/package.json`)
- react
- react-dom
- vite
- @vitejs/plugin-react
- socket.io-client (Phase 2.2)
