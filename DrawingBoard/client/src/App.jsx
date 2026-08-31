import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import Users from './components/Users';
import Login from './components/Login';
import Register from './components/Register';
import GuestLogin from './components/GuestLogin';
import ProtectedRoute from './components/ProtectedRoute';
import useStrokeHistory from './hooks/useStrokeHistory';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useSocket from './hooks/useSocket';
import { useAuth } from './context/AuthContext';
import { saveStrokes } from './api/strokes';
import { useEffect } from 'react';

function DrawingApp() {
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [isEraser, setIsEraser] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState({});
  const [users, setUsers] = useState([]);
  
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

  // Save strokes to server
  useEffect(() => {
    if (strokes.length > 0) {
      saveStrokes(strokes);
    }
  }, [strokes]);

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

  return (
    <div className="App">
      <div className="header">
        <h1>Drawing Board {connected ? '🟢' : '🔴'}</h1>
        <div className="user-info">
          <span>{user?.username || 'Guest'}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <Toolbar
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        color={color}
        setColor={setColor}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        clearCanvas={clearCanvas}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        downloadPNG={() => {}}
      />
      <div className="main-content">
        <Canvas
          brushSize={brushSize}
          color={color}
          isEraser={isEraser}
          strokes={strokes}
          onStrokesChange={handleStrokesChange}
          remoteCursors={remoteCursors}
          onCursorMove={handleCursorMove}
        />
        <Users users={users} currentUserId={socket?.id} />
      </div>
    </div>
  );
}

function App() {
  const { user, loginUser, logout } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'guest'

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
