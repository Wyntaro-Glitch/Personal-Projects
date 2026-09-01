import { useState } from 'react';

export default function Topbar({
  undo,
  redo,
  canUndo,
  canRedo,
  clearCanvas,
  downloadPNG,
  users = [],
  currentUserId,
  roomName,
  roomCode,
  activeMenu,
  setActiveMenu,
  onLogout,
  onBackToRooms
}) {
  const [showUsers, setShowUsers] = useState(false);
  const [showRoomCode, setShowRoomCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const menus = [
    { id: 'file', label: 'File' },
    { id: 'edit', label: 'Edit' },
    { id: 'layers', label: 'Layers' },
    { id: 'select', label: 'Select' }
  ];

  const maskedCode = roomCode ? '*'.repeat(roomCode.length) : '';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="topbar-container">
      <div className="topbar-top">
        <div className="topbar-left">
          <div className="topbar-logo">
            <span className="logo-icon">🎨</span>
            <span className="logo-text">DrawingBoard</span>
          </div>

          <div className="topbar-menus">
            {menus.map(menu => (
              <button
                key={menu.id}
                className={`menu-item ${activeMenu === menu.id ? 'active' : ''}`}
                onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
              >
                {menu.label}
              </button>
            ))}
          </div>
        </div>

        <div className="topbar-right">
          <div className="room-info">
            <span className="room-name">{roomName}</span>
            <div className="room-code-wrapper">
              <span className="room-code">
                {showRoomCode ? roomCode : maskedCode}
              </span>
              <button 
                className="eye-toggle"
                onClick={() => setShowRoomCode(!showRoomCode)}
                title={showRoomCode ? 'Hide code' : 'Show code'}
              >
                {showRoomCode ? '👁️' : '👁️‍🗨️'}
              </button>
              <button 
                className="copy-btn"
                onClick={handleCopyCode}
                title="Copy room code"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="topbar-divider" />

          <div 
            className="users-container"
            onMouseEnter={() => setShowUsers(true)}
            onMouseLeave={() => setShowUsers(false)}
          >
            <div className="users-trigger">
              <span className="users-count">👤 {users.length}</span>
            </div>
            
            {showUsers && (
              <div className="users-dropdown">
                <div className="users-dropdown-header">
                  Connected Users ({users.length})
                </div>
                <ul className="users-dropdown-list">
                  {users.map(u => (
                    <li key={u.id} className={u.id === currentUserId ? 'current-user' : ''}>
                      <span className="user-dot" style={{ backgroundColor: u.color }} />
                      <span className="user-name">{u.username}</span>
                      {u.id === currentUserId && <span className="you-badge">You</span>}
                    </li>
                  ))}
                </ul>
                <div className="users-dropdown-actions">
                  <button className="dropdown-action-btn" onClick={onBackToRooms}>
                    ← Back to Rooms
                  </button>
                  <button className="dropdown-action-btn logout" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="topbar-bottom">
        <div className="topbar-actions">
          <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            ↩️ Undo
          </button>
          <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            ↪️ Redo
          </button>
          <div className="topbar-divider-vertical" />
          <button onClick={clearCanvas} title="Clear Canvas">
            🗑️ Clear
          </button>
          <button onClick={downloadPNG} title="Download PNG">
            💾 Download
          </button>
        </div>
      </div>
    </div>
  );
}
