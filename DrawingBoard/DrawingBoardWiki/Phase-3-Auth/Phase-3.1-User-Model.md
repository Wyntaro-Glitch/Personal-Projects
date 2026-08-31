# Phase 3.1: User Model

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** [[Phase-2-Socket+Cursors/Phase-2.1-Socket-Server]]

## Objective

Create MongoDB User model for storing user accounts.

## Why This Matters

Foundation for auth. User data must be stored before login/register can work.

## Deliverables

- [ ] MongoDB connected
- [ ] User model created
- [ ] Password hashing with bcrypt

## Tasks

### 1. Install Dependencies

```bash
cd server
npm install mongoose bcrypt jsonwebtoken
```

---

### 2. Update `server/.env`

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/drawingboard
JWT_SECRET=your-secret-key-change-this
```

---

### 3. Create `server/models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### 4. Test Model

```bash
cd server
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/drawingboard')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));
"
```

## Completion Checklist

- [x] MongoDB Atlas configured
- [x] mongoose, bcrypt installed
- [x] User model created
- [x] Password hashing works

## Next Phase

→ [[Phase-3.2-Register]]
