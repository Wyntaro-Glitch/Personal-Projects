import { useState, useRef, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Canvas from './components/Canvas';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Ribbon from './components/Ribbon';
import LayerPanel from './components/LayerPanel';
import Login from './components/Login';
import Register from './components/Register';
import GuestLogin from './components/GuestLogin';
import ProtectedRoute from './components/ProtectedRoute';
import RoomList from './components/RoomList';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import useLayers from './hooks/useLayers';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useSocket from './hooks/useSocket';
import { useAuth } from './context/AuthContext';

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
  const resetViewRef = useRef(null);
  
  const { user, logout } = useAuth();
  
  const {
    socket,
    connected,
    emitStroke,
    emitRealtimeStroke,
    emitCursor,
    emitClearCanvas,
    emitLayersUpdate,
    emitOperation,
    onReceiveStroke,
    onLoadStrokes,
    onCursorUpdate,
    onUserLeft,
    onUsersUpdate,
    onCanvasCleared,
    onLayersUpdate,
    onRealtimeStroke,
    onOperation
  } = useSocket(user);

  // Use the layer system with snapshot-based undo
  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    createLayer,
    deleteLayer,
    moveLayer,
    selectLayer,
    toggleVisibility,
    toggleLock,
    toggleClipping,
    toggleAlphaLock,
    renameLayer,
    setOpacity,
    setBlendMode,
    addStroke,
    addStrokeToLayer,
    clearLayer,
    duplicateLayer,
    setPaperColor,
    setPaperTransparent,
    undo,
    redo,
    canUndo,
    canRedo,
    loadLayers
  } = useLayers(currentRoom?._id, user?.id, emitLayersUpdate);

  // Keyboard shortcuts
  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  useKeyboardShortcuts(handleUndo, handleRedo, canUndo(), canRedo());

  const prevRoomIdRef = useRef(null);

  // Handle drawing - add stroke to active layer
  const handleStrokesChange = useCallback((stroke) => {
    const strokeWithLayer = { ...stroke, layerId: activeLayerId };
    addStroke(strokeWithLayer);
    emitStroke(strokeWithLayer);
  }, [activeLayerId, addStroke, emitStroke]);

  // Handle real-time drawing
  const handleDraw = useCallback((stroke) => {
    emitRealtimeStroke(stroke);
  }, [emitRealtimeStroke]);

  // Handle cursor movement
  const handleCursorMove = useCallback((data) => {
    emitCursor(data);
  }, [emitCursor]);

  const handleResetView = useCallback(() => {
    if (resetViewRef.current) resetViewRef.current();
  }, []);

  const handleResetViewReady = useCallback((resetFn) => {
    resetViewRef.current = resetFn;
  }, []);

  // Clear canvas
  const handleClearCanvas = useCallback(() => {
    if (users.length > 1) {
      if (!window.confirm(`There are ${users.length} people in this room. Are you sure you want to clear the canvas?`)) {
        return;
      }
    }
    clearLayer(activeLayerId);
    emitClearCanvas();
  }, [users.length, clearLayer, activeLayerId, emitClearCanvas]);

  // Download canvas as PNG
  const handleDownloadPNG = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw all visible layers
    layers.forEach(layer => {
      if (layer.visible) {
        const layerCanvas = document.querySelector(`[data-layer-id="${layer.id}"]`);
        if (layerCanvas) {
          ctx.globalAlpha = layer.opacity;
          ctx.globalCompositeOperation = layer.blendMode === 'source-over' ? 'source-over' : layer.blendMode;
          ctx.drawImage(layerCanvas, 0, 0);
        }
      }
    });
    
    // Download
    const link = document.createElement('a');
    link.download = `${currentRoom?.name || 'drawing'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [layers, currentRoom]);

  // Handle logout
  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  }, [logout]);

  // Handle back to rooms
  const handleBackToRooms = useCallback(() => {
    setCurrentRoom(null);
    setView('rooms');
  }, []);

  // Join socket room when entering a room
  useEffect(() => {
    const newRoomId = currentRoom?._id;
    const prevRoomId = prevRoomIdRef.current;

    if (newRoomId === prevRoomId) return;

    // Leave previous room
    if (prevRoomId && socket) {
      socket.emit('leave-room', prevRoomId);
    }

    // Join new room
    if (newRoomId && socket) {
      socket.emit('join-room', newRoomId);
    }

    prevRoomIdRef.current = newRoomId;
  }, [currentRoom?._id, socket]);

  // Load layers when room changes
  useEffect(() => {
    if (currentRoom) {
      if (currentRoom.layers && currentRoom.layers.length > 0) {
        loadLayers(currentRoom.layers, currentRoom.activeLayerId);
      }
      // If no layers, useLayers will create a default one
    }
  }, [currentRoom, loadLayers]);

  // Load strokes from socket on connect
  useEffect(() => {
    const cleanup = onLoadStrokes((loadedStrokes) => {
      // Load layers from room data
      if (currentRoom?.layers) {
        loadLayers(currentRoom.layers, currentRoom.activeLayerId);
      }
    });
    return cleanup;
  }, [onLoadStrokes, currentRoom, loadLayers]);

  // Listen for new strokes from other users + clear remote buffer
  const remoteStrokesRef = useRef({});
  const [, forceRender] = useState(0);

  useEffect(() => {
    const cleanup = onReceiveStroke((stroke) => {
      // Clear from remote real-time buffer
      if (stroke && stroke.id && remoteStrokesRef.current[stroke.id]) {
        delete remoteStrokesRef.current[stroke.id];
        forceRender(n => n + 1);
      }
      // Add to the correct layer
      if (stroke.layerId) {
        addStrokeToLayer(stroke.layerId, stroke);
      } else {
        addStroke(stroke);
      }
    });
    return cleanup;
  }, [onReceiveStroke, addStroke, addStrokeToLayer]);

  // Listen for layer updates from other users

  // Listen for layer updates from other users
  useEffect(() => {
    const cleanup = onLayersUpdate((remoteLayers) => {
      if (remoteLayers && remoteLayers.length > 0) {
        loadLayers(remoteLayers);
      }
    });
    return cleanup;
  }, [onLayersUpdate, loadLayers]);

  // Listen for real-time strokes from other users
  useEffect(() => {
    const cleanup = onRealtimeStroke((stroke) => {
      if (stroke && stroke.id) {
        remoteStrokesRef.current[stroke.id] = stroke;
        forceRender(n => n + 1);
      }
    });
    return cleanup;
  }, [onRealtimeStroke]);

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

  // Listen for canvas cleared by other users
  useEffect(() => {
    const cleanup = onCanvasCleared(() => {
      clearLayer(activeLayerId);
    });
    return cleanup;
  }, [onCanvasCleared, clearLayer, activeLayerId]);

  // Listen for operations from other users
  useEffect(() => {
    if (!onOperation) return;
    const cleanup = onOperation((operation) => {
      // Apply remote operation to local state
      // This will be handled by the operation system
    });
    return cleanup;
  }, [onOperation]);

  // Room selection handlers
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

  // Render room views
  if (view === 'rooms') {
    return (
      <div className="app">
        <Topbar 
          currentUserId={user?.id}
          onLogout={handleLogout}
        />
        <div className="main-content">
          <RoomList 
            onSelectRoom={handleSelectRoom}
            onCreateRoom={() => setView('create')}
            onJoinRoom={() => setView('join')}
          />
        </div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="app">
        <Topbar 
          currentUserId={user?.id}
          onLogout={handleLogout}
        />
        <div className="main-content">
          <CreateRoom 
            onCreated={handleCreateRoom}
            onCancel={() => setView('rooms')}
          />
        </div>
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="app">
        <Topbar 
          currentUserId={user?.id}
          onLogout={handleLogout}
        />
        <div className="main-content">
          <JoinRoom 
            onJoined={handleJoinRoom}
            onCancel={() => setView('rooms')}
          />
        </div>
      </div>
    );
  }

  // Drawing view
  return (
    <div className="app">
      <Topbar 
        undo={handleUndo}
        redo={handleRedo}
        canUndo={canUndo()}
        canRedo={canRedo()}
        clearCanvas={handleClearCanvas}
        downloadPNG={handleDownloadPNG}
        users={users}
        currentUserId={user?.id}
        roomName={currentRoom?.name}
        roomCode={currentRoom?.code}
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
            layers={layers}
            activeLayerId={activeLayerId}
            remoteCursors={remoteCursors}
            remoteStrokes={remoteStrokesRef.current}
            onCursorMove={handleCursorMove}
            currentTool={currentTool}
            onDraw={handleDraw}
            onStrokesChange={handleStrokesChange}
            onResetViewReady={handleResetViewReady}
          />
        </div>
        <LayerPanel
          layers={layers}
          activeLayerId={activeLayerId}
          onSelectLayer={selectLayer}
          onCreateLayer={createLayer}
          onDeleteLayer={deleteLayer}
          onDuplicateLayer={duplicateLayer}
          onMoveLayer={moveLayer}
          onToggleVisibility={toggleVisibility}
          onToggleLock={toggleLock}
          onToggleClipping={toggleClipping}
          onToggleAlphaLock={toggleAlphaLock}
          onRenameLayer={renameLayer}
          onSetBlendMode={setBlendMode}
          onSetOpacity={setOpacity}
          onClearLayer={clearLayer}
          onSetPaperColor={setPaperColor}
          onSetPaperTransparent={setPaperTransparent}
          onResetView={handleResetView}
        />
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
        return <GuestLogin onSwitch={() => setAuthView('login')} />;
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
      <Route path="/login" element={renderAuthForm()} />
      <Route path="/" element={
        <ProtectedRoute>
          <DrawingApp />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
