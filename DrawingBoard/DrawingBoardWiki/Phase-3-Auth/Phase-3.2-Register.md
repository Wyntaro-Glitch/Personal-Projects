# Phase 3.2: Register

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** [[Phase-3.1-User-Model]]

## Objective

Create user registration endpoint and API.

## Why This Matters

Users need to create accounts before they can log in.

## Deliverables

- [ ] POST /api/auth/register endpoint
- [ ] Input validation
- [ ] Error handling

## Tasks

### 1. Create `server/routes/auth.js`

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username or email already exists' 
      });
    }

    // Create user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ 
      message: 'User created successfully',
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
```

---

### 2. Update `server/server.js`

Add auth routes:

```javascript
const authRoutes = require('./routes/auth');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
```

---

### 3. Test Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

Should return: `{"message":"User created successfully","userId":"..."}`

## Completion Checklist

- [x] Register endpoint created
- [x] Validation works
- [x] Duplicate user check works
- [x] Password hashed

## Next Phase

→ [[Phase-3.3-Login]]
