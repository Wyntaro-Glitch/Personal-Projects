import { useState } from 'react';
import { createRoom } from '../api/rooms';

export default function CreateRoom({ onCreated, onCancel }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Room name required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const room = await createRoom(name);
    if (room._id) {
      onCreated(room);
    } else {
      setError(room.error || 'Failed to create room');
    }
    setLoading(false);
  };

  return (
    <div className="auth-form">
      <h2>Create Room</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={50}
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}
