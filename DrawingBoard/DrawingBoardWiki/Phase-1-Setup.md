# Phase 1: Project Setup

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** None

## Objective

Initialize a Node.js project with minimal dependencies.

## Why This Matters

Establishes foundation and dependency management so all code runs correctly. Without proper setup, later phases won't have the tools they need.

## Deliverables

- [x] `package.json` with project metadata
- [x] `express` dependency installed
- [x] `.gitignore` created
- [x] `.env` file created
- [x] `dotenv` installed

## Tasks

### 1. Create Project Directory

```bash
mkdir DrawingBoard
cd DrawingBoard
```

**What this does:** Creates the root folder for all project files.

---

### 2. Initialize npm

```bash
npm init -y
```

**What this does:** 
- Creates `package.json` file
- `-y` accepts all defaults automatically
- This file tracks your project name, version, and dependencies

**File created:** `package.json`

---

### 3. Install Express

```bash
npm install express
```

**What this does:**
- Downloads Express library to `node_modules/` folder
- Adds Express to `dependencies` in `package.json`
- Express is the web server framework for serving files and handling HTTP requests

**Files modified:** `package.json` (adds dependencies section)  
**Files created:** `node_modules/` folder

---

### 4. Create Folder Structure

```bash
mkdir public
```

**What this does:**
- Creates `public/` folder for frontend files (HTML, CSS, JS)
- Server code stays in root, frontend in `public/`
- Separation makes debugging easier

## Completion Checklist

- [x] `package.json` exists
- [x] `node_modules/` folder exists
- [x] `.gitignore` created
- [x] `.env` file created
- [x] `npm list express` shows express installed
- [x] `node_modules` removed from git tracking

## Verification Command

```bash
npm list express
```

Should output something like:
```
DrawingBoard@1.0.0
└── express@4.18.2
```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `npm: command not found` | Node.js not installed | Download from nodejs.org |
| `express` not found after install | Wrong directory | Run `pwd` to check location |

## Next Phase

→ [[Phase-2-Server]]
