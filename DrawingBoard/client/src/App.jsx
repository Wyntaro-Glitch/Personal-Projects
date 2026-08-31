import { useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Ribbon from './components/Ribbon';
import Login from './components/Login';
import Register from './components/Register';
import GuestLogin from './components/GuestLogin';
import ProtectedRoute from './components/ProtectedRoute';
import RoomList from './components/RoomList';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import useStrokeHistory from './hooks/useStrokeHistory';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useSocket from './hooks/useSocket';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

function DrawingApp() {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [currentTool, setCurrentTool] = useState('pen');
  const [remoteCursors, setRemoteCursors] = useState({});
  const [users, setUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [view, setView] = useState('rooms');
  const [activeMenu, setActiveMenu] = useState(null);
  
  const { user, logout } = useAuth();

  const {
    strokes,
    undo,
    redo,
    addToHistory,
    clearHistory,
    setInitialStrokes,
    canUndo,
    canRedo
  } = useStrokeHistory();

  const {
    socket,
    connected,
    emitStroke,
    emitCursor,
    onReceiveStroke,
    onLoadStrokes,
    onCursorUpdate,
    onUserLeft,
    onUsersUpdate
  } = useSocket(user);

  useKeyboardShortcuts(undo, redo, canUndo, canRedo);

  const prevRoomIdRef = useRef(null);

  // Join socket room when entering a room
  useEffect(() => {
    const newRoomId = currentRoom?._id;
    const prevRoomId = prevRoomIdRef.current;

    console.log('[App] Room effect:', { newRoomId, prevRoomId, connected });

    if (newRoomId === prevRoomId) return;

    // Leave previous room
    if (prevRoomId && socket) {
      console.log('[App] Emitting leave-room:', prevRoomId);
      socket.emit('leave-room', prevRoomId);
      clearHistory();
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Join new room
    if (newRoomId && socket) {
      console.log('[App] Emitting join-room:', newRoomId);
      socket.emit('join-room', newRoomId);
    }

    prevRoomIdRef.current = newRoomId;
  }, [currentRoom?._id, socket]);

  // Load strokes from socket on connect
  useEffect(() => {
    const cleanup = onLoadStrokes((loadedStrokes) => {
      setInitialStrokes(loadedStrokes);
    });
    return cleanup;
  }, [onLoadStrokes, setInitialStrokes]);

  // Listen for new strokes from other users
  useEffect(() => {
    const cleanup = onReceiveStroke((stroke) => {
      addToHistory(stroke);
    });
    return cleanup;
  }, [onReceiveStroke, addToHistory]);

  // Listen for cursor updates
  useEffect(() => {
    const cleanup = onCursorUpdate((data) => {
      setRemoteCursors(prev => ({
        ...prev,
        [data.userId]: { x: data.x, y: data.y, color: data.color }
      }));
    });
    return cleanup;
  }, [onCursorUpdate]);

  // Handle user disconnect
  useEffect(() => {
    const cleanup = onUserLeft((userId) => {
      setRemoteCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    });
    return cleanup;
  }, [onUserLeft]);

  // Listen for users update
  useEffect(() => {
    const cleanup = onUsersUpdate((usersList) => {
      setUsers(usersList);
    });
    return cleanup;
  }, [onUsersUpdate]);

  const handleStrokesChange = (stroke) => {
    addToHistory(stroke);
    emitStroke(stroke);
  };

  const handleCursorMove = (data) => {
    emitCursor(data);
  };

  const clearCanvas = () => {
    clearHistory();
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleSelectRoom = (room) => {
    setCurrentRoom(room);
    setView('drawing');
  };

  const handleCreateRoom = (room) => {
    setCurrentRoom(room);
    setView('drawing');
  };

  const handleJoinRoom = (room) => {
    setCurrentRoom(room);
    setView('drawing');
  };

  const handleBackToRooms = () => {
    setCurrentRoom(null);
    setView('rooms');
  };

  // Render based on current view
  if (view === 'create') {
    return (
      <div className="App">
        <div className="header">
          <h1>Drawing Board</h1>
        </div>
        <CreateRoom 
          onCreated={handleCreateRoom}
          onCancel={() => setView('rooms')}
        />
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="App">
        <div className="header">
          <h1>Drawing Board</h1>
        </div>
        <JoinRoom 
          onJoined={handleJoinRoom}
          onCancel={() => setView('rooms')}
        />
      </div>
    );
  }

  if (view === 'rooms' || !currentRoom) {
    return (
      <div className="App">
        <div className="header">
          <h1>Drawing Board {connected ? '🟢' : '🔴'}</h1>
          <div className="user-info">
            <span>{user?.username || 'Guest'}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <RoomList 
          onSelectRoom={handleSelectRoom}
          onCreateRoom={() => setView('create')}
          onJoinRoom={() => setView('join')}
        />
      </div>
    );
  }

  // Drawing view
  return (
    <div className="App">
      <Topbar
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        clearCanvas={clearCanvas}
        downloadPNG={() => {}}
        users={users}
        currentUserId={socket?.id}
        roomName={currentRoom.name}
        roomCode={currentRoom.code}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={handleLogout}
        onBackToRooms={handleBackToRooms}
      />
      <Ribbon activeMenu={activeMenu} />
      <div className="drawing-layout">
        <Sidebar
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          color={color}
          setColor={setColor}
          isEraser={isEraser}
          setIsEraser={setIsEraser}
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
        />
        <div className="canvas-area">
          <Canvas
            brushSize={brushSize}
            color={color}
            isEraser={isEraser}
            strokes={strokes}
            onStrokesChange={handleStrokesChange}
            remoteCursors={remoteCursors}
            onCursorMove={handleCursorMove}
            currentTool={currentTool}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState('login');

  const renderAuthForm = () => {
    if (user) return <Navigate to="/" />;
    
    switch (authView) {
      case 'register':
        return <Register onSwitch={() => setAuthView('login')} />;
      case 'guest':
        return <GuestLogin onSwitch={() => setAuthView('register')} />;
      default:
        return (
          <Login 
            onSwitch={() => setAuthView('register')} 
            onGuest={() => setAuthView('guest')}
          />
        );
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={renderAuthForm()}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DrawingApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
