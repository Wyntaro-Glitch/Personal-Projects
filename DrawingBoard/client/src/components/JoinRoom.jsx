import { useState } from 'react';
import { joinRoom } from '../api/rooms';

export default function JoinRoom({ onJoined, onCancel }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Code must be 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const room = await joinRoom(code);
    if (room._id) {
      onJoined(room);
    } else {
      setError(room.error || 'Room not found');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCode(value);
  };

  return (
    <div className="auth-form">
      <h2>Join Room</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={handleChange}
          required
          maxLength={6}
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Joining...' : 'Join'}
        </button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}
