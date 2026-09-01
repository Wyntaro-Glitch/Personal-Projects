# Recommendations

> Best practices and improvements to apply before or during development
> 
> **Last Updated:** 2026-09-02

## Completed

### 1. ✅ Create .gitignore
- Created with React patterns
- Removed node_modules from tracking

### 2. ✅ Separate Server and Client Packages
- Server and client have separate package.json
- Clean separation of concerns

### 3. ✅ Use Environment Variables
- Created server/.env
- MongoDB URI and JWT secret configured

### 4. ✅ Add Start Scripts
- Server: `npm start`
- Client: `npm run dev`

### 5. ✅ Configure Vite Proxy
- Proxy configured for /api routes

## Applied During Development

### 6. ✅ Socket.io Room Isolation
- Strokes broadcast only to room members
- Per-room stroke storage in MongoDB

### 7. ✅ MongoDB Atlas Integration
- Cloud database for persistence
- User and Room models

### 8. ✅ JWT Authentication
- Username-based login
- Guest account support
- Protected routes

### 9. ✅ React StrictMode Fix
- Removed StrictMode to prevent socket disconnects
- Socket lifecycle stabilized

### 10. ✅ Collapsible Sidebar
- Modern UI with collapsible sections
- Tool grid with icons
- Users list with colors

## Medium Priority (Future Improvements)

### 11. Add Error Boundary
**Why:** Catch React errors gracefully.

```jsx
// client/src/components/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### 12. Add Loading States
**Why:** Better UX during async operations.

```jsx
const [loading, setLoading] = useState(false);

// Show spinner during loading
{loading && <div className="spinner">Loading...</div>}
```

### 13. Add Toast Notifications
**Why:** Non-intrusive feedback.

```bash
npm install react-hot-toast
```

### 14. Optimize Canvas Rendering
**Why:** Better performance with many strokes.

- Use requestAnimationFrame
- Implement canvas virtualization
- Batch stroke updates

### 15. Add Image Upload
**Why:** Allow users to upload reference images.

- Add image upload endpoint
- Render images on canvas
- Layer management

## Low Priority (Polish)

### 16. Add Morgan for Logging
**Why:** Better server logs.

```bash
cd server
npm install morgan
```

### 17. Add React DevTools
**Why:** Debug React components.

Install browser extension:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

### 18. Add Unit Tests
**Why:** Ensure code quality.

```bash
npm install --save-dev jest @testing-library/react
```

### 19. Add TypeScript
**Why:** Better type safety.

```bash
npm install --save-dev typescript @types/react
```

### 20. Add ESLint + Prettier
**Why:** Consistent code style.

```bash
npm install --save-dev eslint prettier
```

## Security Recommendations

### 21. Rate Limiting
**Why:** Prevent brute force on login/register.

```bash
cd server
npm install express-rate-limit
```

```js
// server.js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: 'Too many attempts, try again later' }
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### 22. Input Validation & Sanitization
**Why:** Prevent XSS and injection attacks via room names, usernames, etc.

```bash
cd server
npm install express-validator sanitize-html
```

```js
// Validate on all POST routes
const { body, validationResult } = require('express-validator');

router.post('/register',
  body('username').trim().isLength({ min: 3, max: 30 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // ...
  }
);
```

### 23. Socket.io Authentication
**Why:** Currently anyone with a room code can join via socket with no token verification.

```js
// server.js - Verify JWT on socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});
```

### 24. Helmet.js Security Headers
**Why:** Adds HTTP security headers (XSS protection, content type sniffing, etc.).

```bash
cd server
npm install helmet
```

```js
// server.js
const helmet = require('helmet');
app.use(helmet());
```

### 25. HTTPS Enforcement
**Why:** Prevent man-in-the-middle attacks on production.

```js
// server.js (production)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}
```

### 26. CSRF Protection
**Why:** Prevent cross-site request forgery on state-changing routes.

```bash
cd server
npm install csurf
```

### 27. Password Security Improvements
**Why:** Current bcrypt salt rounds (10) is fine but could be stronger. Also add password complexity requirements.

```js
// User model - enforce stronger passwords
password: {
  type: String,
  minlength: 8,
  validate: {
    validator: (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v),
    message: 'Password must contain uppercase, lowercase, and number'
  }
}
```

### 28. JWT Improvements
**Why:** Add token refresh, blacklisting, and shorter expiry for敏感 routes.

```js
// Use shorter expiry for access tokens
const token = jwt.sign(
  { userId: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '1h' } // Shorter expiry
);

// Add refresh token for long sessions
const refreshToken = jwt.sign(
  { userId: user._id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

### 29. Environment Variable Security
**Why:** Ensure secrets aren't committed to git.

```gitignore
# .gitignore - already exists but verify
server/.env
*.env
.env.local
```

### 30. MongoDB Injection Protection
**Why:** Mongoose helps but sanitization is still needed.

```js
// Sanitize MongoDB queries
const sanitize = require('mongo-sanitize');
const cleanInput = sanitize(req.body.username);
```

### 31. Error Message Leaking
**Why:** Current error handlers expose `err.message` to clients, leaking internal details.

```js
// production error handler
app.use((err, req, res, next) => {
  console.error(err); // Log internally
  res.status(500).json({ error: 'Internal server error' }); // Generic message
});
```

### 32. Room Code Brute Force
**Why:** 6-char alphanumeric codes can be guessed. Add rate limiting on join attempts.

```js
// Rate limit room joins
const joinLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { error: 'Too many join attempts' }
});
app.use('/api/rooms/join', joinLimiter);
```

## Lobby UI Assets (Future)

### 33. Lobby Visual Assets
**Why:** Make the lobby feel alive and polished without competing with the room list.

#### Animated Mascot / Character
- Small floating pencil, paintbrush, or palette character
- Idle animations: blinking, bouncing, painting
- Best placement: empty-state area or How to Play card
- Could become the app's identity (similar to login page illustrated character)

#### Player Avatars
- Circular avatars in the Online Now section
- Options: generated illustrated avatars, palette-themed icons, or initials
- Adds immediate social presence

#### Room Status Icons
Small, consistent icons for room states:
- 🟢 Live — room is actively being drawn in
- ⏳ Waiting — room created, waiting for players
- 🔒 Private — invite-only room
- 👥 Player count — number of users in room
- 🎨 Currently drawing — active drawing session

#### Floating Art Doodles (Background)
Subtle background assets to fill empty space:
- Paint splashes
- Pencil sketches
- Stars and brush strokes
- Tiny geometric doodles
- **Keep opacity very low** so the UI stays clean

#### Featured Artwork Carousel
Small card showing community activity:
- "Community Sketches — See what players are drawing right now"
- Show 3–4 miniature drawing thumbnails
- Pull from recent public room strokes

#### Lobby Activity Feed
UI component showing live activity:
- "🎨 Sherwin started drawing in Test123"
- "🏆 Player123 guessed the word!"
- "👥 New player joined NewTest"
- Makes the lobby feel active and social

#### Game Mode Illustrations
For future game modes, each with a small custom icon/illustration:
- ✏️ Classic Draw — freeform drawing
- ⚡ Quick Draw — timed drawing rounds
- 👥 Team Battle — team-based drawing
- 🏆 Tournament — competitive play

#### Recommended Layout
```
Left:   How to Play + Lobby Stats
Center: Room List
Right:  Room Rules + Online Players
Background: Very subtle floating drawing doodles
Bonus: Small animated DrawingBoard mascot near bottom or empty spaces
```

### 25. Redis for Socket.io
**Why:** Scale to multiple server instances.

```bash
cd server
npm install @socket.io/redis-adapter
```

### 26. MongoDB Indexing
**Why:** Faster queries.

```javascript
// Add indexes to models
userSchema.index({ username: 1 }, { unique: true });
roomSchema.index({ code: 1 }, { unique: true });
```

### 27. Client-side Caching
**Why:** Reduce API calls.

```bash
npm install swr
```

## Checklist

Current status:

- [x] .gitignore created
- [x] Server/client separated
- [x] Environment variables
- [x] Start scripts
- [x] Vite proxy
- [x] Socket.io rooms
- [x] MongoDB Atlas
- [x] JWT auth
- [x] StrictMode fix
- [x] Collapsible sidebar

Future improvements:

- [ ] Error boundary
- [ ] Loading states
- [ ] Toast notifications
- [ ] Canvas optimization
- [ ] Image upload
- [ ] Morgan logging
- [ ] React DevTools
- [ ] Unit tests
- [ ] TypeScript
- [ ] ESLint + Prettier
- [ ] Rate limiting (login/register)
- [ ] Input validation & sanitization
- [ ] Socket.io auth (verify JWT on connect)
- [ ] Helmet.js security headers
- [ ] HTTPS enforcement
- [ ] CSRF protection
- [ ] Password complexity requirements
- [ ] JWT refresh tokens
- [ ] Error message sanitization
- [ ] Room code brute force protection
- [ ] Lobby UI assets (mascot, avatars, status icons, activity feed)
