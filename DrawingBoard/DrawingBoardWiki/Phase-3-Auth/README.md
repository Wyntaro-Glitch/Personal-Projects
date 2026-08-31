# Phase 3: User Authentication

Registration, login, and guest access for multi-user collaboration.

## Files

- `Phase-3-Auth.md` - Overview
- `Phase-3.1-User-Model.md` - MongoDB User model
- `Phase-3.2-Register.md` - Register endpoint
- `Phase-3.3-Login.md` - Login with JWT
- `Phase-3.4-Auth-UI.md` - React login/register/guest forms
- `Phase-3.5-Protected-Routes.md` - Route guards

## Quick Start

1. MongoDB Atlas configured
2. Install dependencies:
   ```bash
   cd server && npm install mongoose bcrypt jsonwebtoken
   cd client && npm install react-router-dom
   ```
3. Follow phases in order

## Guest Access

Users can join instantly by entering a display name - no registration required.
