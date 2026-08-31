# Recommendations

> Best practices and improvements to apply before or during development

## High Priority (Do Before Phase 2)

### 1. Create .gitignore

**Issue:** `node_modules/` is committed to git.

**Fix:**

1. Create `DrawingBoard/.gitignore`:
```
node_modules/
.env
*.log
dist/
.vite/
```

2. Remove from git tracking:
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
```

**Why:** Prevents repository bloat, merge conflicts, and slow clones.

---

### 2. Separate Server and Client Packages

**Why:** Clean separation of concerns, independent dependencies.

**Structure:**
```
DrawingBoard/
├── server/
│   ├── server.js
│   ├── package.json
│   └── node_modules/
├── client/
│   ├── src/
│   ├── package.json
│   └── node_modules/
└── .gitignore
```

---

## Medium Priority (During Development)

### 3. Use Environment Variables for Port

**Why:** Avoids hardcoding, makes deployment easier.

**Fix:** Create `DrawingBoard/server/.env`:
```
PORT=3000
```

In `server/server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

Install dotenv:
```bash
cd server
npm install dotenv
```

Add to top of `server/server.js`:
```javascript
require('dotenv').config();
```

---

### 4. Add Start Scripts

**Why:** Run server and client with single commands.

**Server `package.json`:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

**Client `package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

### 5. Configure Vite Proxy

**Why:** Avoid CORS issues during development.

**In `client/vite.config.js`:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
```

---

## Low Priority (Polish Phase)

### 6. Add Error Handling to Server

**Why:** Graceful handling of port conflicts and crashes.

**In server/server.js:**
```javascript
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});
```

---

### 7. Add Morgan for Logging

**Why:** See request logs in terminal for debugging.

```bash
cd server
npm install morgan
```

```javascript
const morgan = require('morgan');
app.use(morgan('dev'));
```

---

### 8. Add React DevTools

**Why:** Debug React component state and props.

Install browser extension:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

---

## Checklist

Apply these before moving to Phase 2:

- [ ] Create `.gitignore` with React patterns
- [ ] Remove `node_modules` from git
- [ ] Separate `server/` and `client/` folders
- [ ] Add start scripts to both packages

Optional (recommended):

- [ ] Add `.env` file for server
- [ ] Configure Vite proxy
- [ ] Add error handling to server
- [ ] Install React DevTools
