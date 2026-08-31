import { useState } from 'react';
import { loginAsGuest } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function GuestLogin({ onSwitch }) {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (displayName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    const result = await loginAsGuest(displayName);
    if (result.token) {
      loginUser(result.token, { 
        id: result.userId, 
        username: result.username,
        isGuest: true
      });
    } else {
      setError(result.error || 'Failed to join as guest');
    }
  };

  return (
    <div className="auth-form">
      <h2>Join as Guest</h2>
      <p className="guest-info">Enter a name to start drawing instantly</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          minLength={2}
          maxLength={20}
          autoFocus
        />
        <button type="submit">Join Now</button>
      </form>
      <div className="auth-switch">
        <p>Want to save your progress?</p>
        <button onClick={onSwitch}>Create Account</button>
      </div>
    </div>
  );
}
