# Phase 3.3: Login

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-3.2-Register]]

## Objective

Create login endpoint with JWT token generation.

## Why This Matters

Users authenticate to access protected features. JWT tokens maintain sessions.

## Deliverables

- [ ] POST /api/auth/login endpoint
- [ ] JWT token generation
- [ ] Token verification

## Tasks

### 1. Update `server/routes/auth.js`

Add login route:

```javascript
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      userId: user._id,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me (verify token)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

---

### 2. Create `server/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

### 3. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Should return: `{"token":"...","userId":"...","username":"..."}`

## Completion Checklist

- [ ] Login endpoint created
- [ ] JWT token generated
- [ ] Token verification works
- [ ] Auth middleware created

## Next Phase

→ [[Phase-3.4-Auth-UI]]
