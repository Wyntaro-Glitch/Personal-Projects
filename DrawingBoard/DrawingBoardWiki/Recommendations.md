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
```

2. Remove from git tracking:
```bash
git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
```

**Why:** Prevents repository bloat, merge conflicts, and slow clones.

---

### 2. Update package.json main field

**Issue:** `"main": "index.js"` but file will be `server.js`.

**Fix:** Change to `"main": "server.js"` in `package.json`.

**Why:** Correct entry point for Node.js.

---

## Medium Priority (During Development)

### 3. Use Environment Variables for Port

**Why:** Avoids hardcoding, makes deployment easier.

**Fix:** Create `DrawingBoard/.env`:
```
PORT=3000
```

In `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

Install dotenv:
```bash
npm install dotenv
```

Add to top of `server.js`:
```javascript
require('dotenv').config();
```

---

### 4. Add Start Script to package.json

**Why:** Run server with `npm start` instead of `node server.js`.

**Fix:** Add to `scripts` in `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

---

### 5. Separate Frontend Files

**Why:** Better organization as project grows.

**Structure:**
```
DrawingBoard/
├── server.js
├── package.json
├── .gitignore
├── .env
└── public/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

---

## Low Priority (Polish Phase)

### 6. Add Error Handling to Server

**Why:** Graceful handling of port conflicts and crashes.

**In server.js:**
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

### 7. Add CORS for Development

**Why:** If you ever add a frontend framework or API calls.

```bash
npm install cors
```

```javascript
const cors = require('cors');
app.use(cors());
```

---

### 8. Add Morgan for Logging

**Why:** See request logs in terminal for debugging.

```bash
npm install morgan
```

```javascript
const morgan = require('morgan');
app.use(morgan('dev'));
```

---

## Checklist

Apply these before moving to Phase 2:

- [ ] Create `.gitignore`
- [ ] Remove `node_modules` from git
- [ ] Update `package.json` main field
- [ ] Add start script to `package.json`

Optional (recommended):

- [ ] Add `.env` file
- [ ] Separate frontend files into `css/` and `js/`
- [ ] Add error handling to server
