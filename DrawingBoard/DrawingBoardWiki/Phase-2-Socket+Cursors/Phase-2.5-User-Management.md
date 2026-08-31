# Phase 2.5: User Management

> **Status:** ⬜ Not Started  
> **Priority:** Low  
> **Depends On:** [[Phase-2.4-Remote-Cursors]]

## Objective

Track connected users and show who's in the room.

## Why This Matters

Users need to see who they're collaborating with. Nice-to-have feature.

## Deliverables

- [ ] Users panel shows connected users
- [ ] User join/leave notifications
- [ ] Unique color per user

## Tasks

### 1. Create `client/src/components/Users.jsx`

```jsx
export default function Users({ users, currentUserId }) {
  return (
    <div className="users-panel">
      <h3>Connected Users</h3>
      <ul>
        {users.map(user => (
          <li key={user.id} style={{ color: user.color }}>
            {user.id === currentUserId ? 'You' : `User ${user.id.slice(0, 5)}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### 2. Update `client/src/App.jsx`

Add Users component:

```jsx
import Users from './components/Users';

function App() {
  // ... existing code ...

  return (
    <div className="App">
      <h1>Drawing Board {connected ? '🟢' : '🔴'}</h1>
      <Toolbar ... />
      <div className="main-content">
        <Canvas ... />
        <Users users={[]} currentUserId={socket?.id} />
      </div>
    </div>
  );
}
```

---

### 3. Add CSS

```css
.main-content {
  display: flex;
  gap: 20px;
}

.users-panel {
  width: 200px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.users-panel h3 {
  margin: 0 0 10px 0;
}

.users-panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.users-panel li {
  padding: 5px 0;
}
```

---

### 4. Test User Panel

1. Open two browser tabs
2. Should see "You" in each tab
3. (Full user tracking requires server-side state)

## Completion Checklist

- [ ] Users component created
- [ ] Users panel styled
- [ ] Shows current user

## Notes

Full user list requires server to track connected users. This is a basic implementation showing only current user. Can be enhanced later.

## Phase Complete

All Socket phases done! 🎉
