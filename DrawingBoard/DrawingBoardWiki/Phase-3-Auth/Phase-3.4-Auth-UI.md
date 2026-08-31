# Phase 3.4: Auth UI

> **Status:** ✅ Completed  
> **Priority:** High  
> **Depends On:** [[Phase-3.3-Login]]

## Objective

Create login and register forms in React.

## Why This Matters

Users need a way to create accounts and log in.

## Deliverables

- [ ] Login form component
- [ ] Register form component
- [ ] Auth context for state management
- [ ] API calls for auth

## Tasks

### 1. Create `client/src/api/auth.js`

```javascript
const API_URL = 'http://localhost:3000/api/auth';

export async function register(username, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return await response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
}

export async function getMe(token) {
  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await response.json();
}
```

---

### 2. Create `client/src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getMe(token)
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

### 3. Create `client/src/components/Login.jsx`

```jsx
import { useState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.token) {
      loginUser(result.token, { 
        id: result.userId, 
        username: result.username 
      });
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button onClick={onSwitch}>Register</button>
      </p>
    </div>
  );
}
```

---

### 4. Create `client/src/components/Register.jsx`

```jsx
import { useState } from 'react';
import { register } from '../api/auth';

export default function Register({ onSwitch }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await register(username, email, password);
    if (result.userId) {
      setSuccess(true);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="auth-form">
        <h2>Registration Successful!</h2>
        <p>You can now login.</p>
        <button onClick={onSwitch}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={onSwitch}>Login</button>
      </p>
    </div>
  );
}
```

---

### 5. Add CSS

```css
.auth-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.auth-form h2 {
  margin-top: 0;
}

.auth-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.auth-form button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-form button:hover {
  background: #0056b3;
}

.error {
  color: red;
  margin-bottom: 10px;
}
```

## Completion Checklist

- [x] Auth API calls created
- [x] Auth context created
- [x] Login form works
- [x] Register form works
- [x] Forms styled

## Next Phase

→ [[Phase-3.5-Protected-Routes]]
