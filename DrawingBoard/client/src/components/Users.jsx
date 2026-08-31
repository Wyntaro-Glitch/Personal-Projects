export default function Users({ users, currentUserId }) {
  return (
    <div className="users-panel">
      <h3>Connected Users</h3>
      <ul>
        {users.map(user => (
          <li key={user.id} style={{ color: user.color }}>
            {user.id === currentUserId 
              ? `You (${user.username || 'Guest'})` 
              : (user.username || `User ${user.id.slice(0, 5)}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}