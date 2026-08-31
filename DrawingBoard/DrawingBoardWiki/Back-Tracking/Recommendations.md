# Recommendations

> Best practices and improvements to apply before or during development
> 
> **Last Updated:** 2026-08-31

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
**Why:** Prevent abuse.

```bash
cd server
npm install express-rate-limit
```

### 22. Input Validation
**Why:** Prevent injection attacks.

```bash
cd server
npm install express-validator
```

### 23. CORS Configuration
**Why:** Restrict cross-origin requests.

Already configured in server.js with specific origin.

### 24. Helmet.js
**Why:** Security headers.

```bash
cd server
npm install helmet
```

## Performance Recommendations

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
