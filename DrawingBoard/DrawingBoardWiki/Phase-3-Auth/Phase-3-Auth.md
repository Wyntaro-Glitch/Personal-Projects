# Phase 3: User Authentication

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** [[Phase-2-Socket+Cursors/Phase-2.1-Socket-Server]]

## Objective

Add user registration, login, and guest access for multi-user collaboration.

## Why This Matters

Without auth, anyone can connect. Auth identifies users, tracks their drawings, and enables private rooms. Guest access allows quick entry without registration.

## Tech Stack Addition

- **MongoDB** - Database for users
- **Mongoose** - MongoDB ODM
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT tokens

## File Structure

```
server/
├── server.js           # Updated with auth + guest cleanup
├── models/
│   └── User.js         # User model with isGuest field
├── routes/
│   └── auth.js         # Auth routes (register, login, guest)
├── middleware/
│   └── auth.js         # JWT middleware
├── .env                # JWT_SECRET, MONGODB_URI
└── package.json

client/src/
├── components/
│   ├── Login.jsx       # Login with username
│   ├── Register.jsx    # Register form
│   ├── GuestLogin.jsx  # Guest login with display name
│   └── ProtectedRoute.jsx # Route guard
├── context/
│   └── AuthContext.jsx # Auth state
├── api/
│   └── auth.js         # Auth API calls
├── App.jsx             # Updated with routes + logout
└── main.jsx
```

## Deliverables

- [x] User model created
- [x] Register endpoint working
- [x] Login endpoint with JWT (username-based)
- [x] Guest login endpoint
- [x] Guest accounts auto-deleted on disconnect
- [x] Guest accounts cleaned on server restart
- [x] Auth context for React
- [x] Login/Register/Guest UI
- [x] Protected routes
- [x] Logout with confirmation prompt
- [x] Connected users show display names

## Sub-Phases

| Sub-Phase | Name | Status |
|-----------|------|--------|
| 3.1 | User Model | ✅ Completed |
| 3.2 | Register | ✅ Completed |
| 3.3 | Login | ✅ Completed |
| 3.4 | Auth UI | ✅ Completed |
| 3.5 | Protected Routes | ✅ Completed |

## Guest Access

Guest users can:
- Enter a display name
- Join instantly without registration
- Draw and collaborate in real-time
- Account auto-deleted when disconnecting
- All guests cleaned on server restart

## Troubleshooting Notes

- Changed login from email to username-based
- Guest users get unique database IDs but display their chosen name
- Connected users panel shows actual display names
- Added error logging for debugging auth issues

## Next Phase

→ [[Phase-4-Rooms]]
