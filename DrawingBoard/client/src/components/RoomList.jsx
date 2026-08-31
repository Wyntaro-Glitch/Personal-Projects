import { useState, useEffect } from 'react';
import { getRooms, leaveRoom, deleteRoom } from '../api/rooms';

export default function RoomList({ onSelectRoom, onCreateRoom, onJoinRoom }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load rooms');
    }
    setLoading(false);
  };

  const handleLeave = async (e, roomId) => {
    e.stopPropagation();
    if (window.confirm('Leave this room?')) {
      await leaveRoom(roomId);
      setRooms(rooms.filter(r => r._id !== roomId));
    }
  };

  const handleDelete = async (e, roomId) => {
    e.stopPropagation();
    if (window.confirm('Delete this room? This cannot be undone.')) {
      await deleteRoom(roomId);
      setRooms(rooms.filter(r => r._id !== roomId));
    }
  };

  if (loading) return <div className="loading">Loading rooms...</div>;

  return (
    <div className="room-list">
      <h2>Your Rooms</h2>
      {error && <p className="error">{error}</p>}
      
      <div className="room-actions">
        <button className="create-btn" onClick={onCreateRoom}>
          Create Room
        </button>
        <button className="join-btn" onClick={onJoinRoom}>
          Join by Code
        </button>
      </div>

      {rooms.length === 0 ? (
        <p className="no-rooms">No rooms yet. Create one or join with a code.</p>
      ) : (
        <ul>
          {rooms.map(room => (
            <li key={room._id} onClick={() => onSelectRoom(room)}>
              <div className="room-info">
                <span className="room-name">{room.name}</span>
              </div>
              <div className="room-meta">
                <span>{room.members?.length || 0} members</span>
                <button className="leave-btn" onClick={(e) => handleLeave(e, room._id)}>
                  Leave
                </button>
                {room.owner?._id === localStorage.getItem('userId') && (
                  <button className="delete-btn" onClick={(e) => handleDelete(e, room._id)}>
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
