import { useState } from 'react';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSwitch, onGuest }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(username, password);
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
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      <button
        type="button"
        className="dev-login-btn"
        onClick={() => { setUsername('wyntaro'); setPassword('kappa123'); }}
        style={{ marginTop: '8px', background: '#555', fontSize: '12px', padding: '6px 12px' }}
      >
        Dev Login
      </button>
      <div className="auth-switch">
        <p>
          Don't have an account?{' '}
          <button onClick={onSwitch}>Register</button>
        </p>
        <p className="guest-divider">or</p>
        <button className="guest-btn" onClick={onGuest}>Join as Guest</button>
      </div>
    </div>
  );
}
