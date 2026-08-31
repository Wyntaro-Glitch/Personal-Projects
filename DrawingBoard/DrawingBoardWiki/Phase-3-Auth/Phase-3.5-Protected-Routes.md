# Phase 3.5: Protected Routes

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** [[Phase-3.4-Auth-UI]]

## Objective

Protect routes so only logged-in users can access the drawing board.

## Why This Matters

Without route protection, unauthenticated users could access the app.

## Deliverables

- [ ] ProtectedRoute component
- [ ] App routes updated
- [ ] Logout functionality

## Tasks

### 1. Create `client/src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

---

### 2. Install React Router

```bash
cd client
npm install react-router-dom
```

---

### 3. Update `client/src/main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

### 4. Update `client/src/App.jsx`

Add routing:

```jsx
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import Users from './components/Users';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import useStrokeHistory from './hooks/useStrokeHistory';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useSocket from './hooks/useSocket';
import { useAuth } from './context/AuthContext';
import { saveStrokes } from './api/strokes';

function DrawingApp() {
  // ... existing drawing code ...
}

function App() {
  const { user, loginUser, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" />
          ) : showLogin ? (
            <Login onSwitch={() => setShowLogin(false)} />
          ) : (
            <Register onSwitch={() => setShowLogin(true)} />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DrawingApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
```

---

### 5. Test Routes

1. Start server and client
2. Open `http://localhost:5173`
3. Should redirect to `/login`
4. Register → Login → Access drawing board

## Completion Checklist

- [x] React Router installed
- [x] ProtectedRoute component created
- [x] Routes configured
- [x] Redirects work correctly
- [x] Logout works

## Phase Complete

All Auth phases done! 🎉
