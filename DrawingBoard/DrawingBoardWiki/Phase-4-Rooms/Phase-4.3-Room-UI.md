# Phase 4.3: Room UI

> **Status:** ⬜ Not Started  
> **Priority:** High  
> **Depends On:** [[Phase-4.2-Room-API]]

## Objective

Create React components for room management.

## Deliverables

- [ ] RoomList component
- [ ] CreateRoom component
- [ ] JoinRoom component
- [ ] RoomLobby component

## Tasks

### 1. Create `client/src/components/RoomList.jsx`

```jsx
import { useState, useEffect } from 'react';
import { getRooms } from '../api/rooms';

export default function RoomList({ onSelectRoom, onCreateRoom }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const data = await getRooms();
    setRooms(data);
    setLoading(false);
  };

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div className="room-list">
      <h2>Your Rooms</h2>
      <button className="create-btn" onClick={onCreateRoom}>
        Create New Room
      </button>
      {rooms.length === 0 ? (
        <p>No rooms yet. Create one or join with a code.</p>
      ) : (
        <ul>
          {rooms.map(room => (
            <li key={room._id} onClick={() => onSelectRoom(room)}>
              <span className="room-name">{room.name}</span>
              <span className="room-code">{room.code}</span>
              <span className="room-members">{room.members.length} members</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 2. Create `client/src/components/CreateRoom.jsx`

```jsx
import { useState } from 'react';
import { createRoom } from '../api/rooms';

export default function CreateRoom({ onCreated, onCancel }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Room name required');
      return;
    }
    const room = await createRoom(name);
    if (room._id) {
      onCreated(room);
    } else {
      setError('Failed to create room');
    }
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
        />
        <button type="submit">Create</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}
```

### 3. Create `client/src/components/JoinRoom.jsx`

```jsx
import { useState } from 'react';
import { joinRoom } from '../api/rooms';

export default function JoinRoom({ onJoined, onCancel }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Code must be 6 characters');
      return;
    }
    const room = await joinRoom(code);
    if (room._id) {
      onJoined(room);
    } else {
      setError('Room not found');
    }
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
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
          maxLength={6}
        />
        <button type="submit">Join</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}
```

## Completion Checklist

- [ ] RoomList component works
- [ ] CreateRoom component works
- [ ] JoinRoom component works
- [ ] Styled properly

## Next Phase

→ [[Phase-4.4-Socket-Rooms]]
