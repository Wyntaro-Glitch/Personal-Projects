# Phase 3: User Authentication

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-2-Socket+Cursors/Phase-2.1-Socket-Server]]

## Objective

Add user registration and login for multi-user collaboration.

## Why This Matters

Without auth, anyone can connect. Auth identifies users, tracks their drawings, and enables private rooms.

## Tech Stack Addition

- **MongoDB** - Database for users
- **Mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT tokens

## File Structure

```
server/
├── server.js           # Updated with auth
├── models/
│   └── User.js         # NEW - User model
├── routes/
│   └── auth.js         # NEW - Auth routes
├── middleware/
│   └── auth.js         # NEW - JWT middleware
├── .env                # Add JWT_SECRET
└── package.json

client/src/
├── components/
│   ├── Login.jsx       # NEW - Login form
│   ├── Register.jsx    # NEW - Register form
│   └── ProtectedRoute.jsx # NEW - Route guard
├── context/
│   └── AuthContext.jsx # NEW - Auth state
├── api/
│   └── auth.js         # NEW - Auth API calls
├── App.jsx             # Updated with routes
└── main.jsx
```

## Deliverables

- [ ] User model created
- [ ] Register endpoint working
- [ ] Login endpoint with JWT
- [ ] Auth context for React
- [ ] Login/Register UI
- [ ] Protected routes

## Sub-Phases

| Sub-Phase | Name | Status |
|-----------|------|--------|
| 3.1 | User Model | ⬜ Not Started |
| 3.2 | Register | ⬜ Not Started |
| 3.3 | Login | ⬜ Not Started |
| 3.4 | Auth UI | ⬜ Not Started |
| 3.5 | Protected Routes | ⬜ Not Started |

## Next Phase

→ [[Phase-4-Rooms]]
