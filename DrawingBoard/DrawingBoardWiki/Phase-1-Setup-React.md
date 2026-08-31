# Phase 1: Project Setup (React)

> **Status:** 🔄 In Progress  
> **Priority:** High  
> **Depends On:** None

## Objective

Initialize project with React + Vite frontend and Node.js + Express backend.

## Why This Matters

Sets up the foundation for a full-stack JavaScript application. React for UI, Express for API.

## Deliverables

- [ ] New folder structure created
- [ ] React app initialized with Vite
- [ ] Express server in separate folder
- [ ] Both packages have `package.json`
- [ ] `.gitignore` updated for React

## Tasks

### 1. Create New Folder Structure

```bash
mkdir server
mkdir client
```

**What this does:** Separates backend (server) from frontend (client).

---

### 2. Initialize React App with Vite

```bash
npm create vite@latest client -- --template react
cd client
npm install
```

**What this does:**
- Creates React app in `client/` folder
- Uses Vite as build tool
- Installs React dependencies

**Files created:**
```
client/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

---

### 3. Move Server to server/ Folder

Move existing `server.js` and `package.json` to `server/` folder.

```bash
mv server.js server/
mv package.json server/
mv package-lock.json server/
```

**What this does:** Isolates backend code.

---

### 4. Initialize Server Package

```bash
cd server
npm init -y
npm install express cors dotenv
```

**What this does:**
- Creates new `package.json` for server
- Installs Express, CORS, and dotenv

---

### 5. Update .gitignore

```gitignore
node_modules/
.env
*.log
dist/
.vite/
```

**What this does:** Ignores React build files and dependencies.

---

### 6. Delete Old public/ Folder

```bash
rm -rf public/
```

**What this does:** Removes vanilla JS files, replaced by React.

## File Structure After This Phase

```
DrawingBoard/
├── server/
│   ├── server.js
│   ├── package.json
│   └── node_modules/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/
├── .gitignore
└── DrawingBoardWiki/
```

## Completion Checklist

- [ ] `server/` folder exists with Express
- [ ] `client/` folder exists with React + Vite
- [ ] `npm install` works in both folders
- [ ] Old `public/` folder deleted
- [ ] `.gitignore` updated

## Verification Commands

**Test server:**
```bash
cd server
node server.js
# Should show "Server running at http://localhost:3000"
```

**Test client:**
```bash
cd client
npm run dev
# Should show "Local: http://localhost:5173"
```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `vite: command not found` | Not in client folder | `cd client` first |
| Port conflict | Another process using port | Change port in vite.config.js |
| Module not found | Forgot npm install | Run `npm install` in both folders |

## Next Phase

→ [[Phase-2-Server-API]]
