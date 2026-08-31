import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export default function useSocket(userInfo = null) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const userInfoRef = useRef(userInfo);

  useEffect(() => {
    console.log('[Socket] Connecting to', SOCKET_URL);
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Socket] Connected:', newSocket.id);
      setConnected(true);
      
      if (userInfoRef.current) {
        console.log('[Socket] Sending user-info:', userInfoRef.current);
        newSocket.emit('user-info', {
          userId: userInfoRef.current.id,
          username: userInfoRef.current.username,
          isGuest: userInfoRef.current.isGuest || false
        });
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected, reason:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] connect_error:', err.message);
    });

    newSocket.on('reconnect', (attempt) => {
      console.log('[Socket] Reconnected after', attempt, 'attempts');
      if (userInfoRef.current) {
        newSocket.emit('user-info', {
          userId: userInfoRef.current.id,
          username: userInfoRef.current.username,
          isGuest: userInfoRef.current.isGuest || false
        });
      }
    });

    newSocket.on('reconnect_attempt', (attempt) => {
      console.log('[Socket] Reconnect attempt:', attempt);
    });

    newSocket.on('reconnect_error', (err) => {
      console.error('[Socket] reconnect_error:', err.message);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('[Socket] reconnect_failed: all attempts exhausted');
    });

    return () => {
      console.log('[Socket] Closing connection');
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    userInfoRef.current = userInfo;
    if (socket && connected && userInfo) {
      console.log('[Socket] Updating user-info:', userInfo);
      socket.emit('user-info', {
        userId: userInfo.id,
        username: userInfo.username,
        isGuest: userInfo.isGuest || false
      });
    }
  }, [userInfo, socket, connected]);

  const emitStroke = useCallback((stroke) => {
    if (socket) {
      socket.emit('new-stroke', stroke);
    }
  }, [socket]);

  const emitCursor = useCallback((data) => {
    if (socket) {
      socket.emit('cursor-move', data);
    }
  }, [socket]);

  const onReceiveStroke = useCallback((callback) => {
    if (socket) {
      socket.on('receive-stroke', callback);
      return () => socket.off('receive-stroke', callback);
    }
  }, [socket]);

  const onLoadStrokes = useCallback((callback) => {
    if (socket) {
      socket.on('load-strokes', callback);
      return () => socket.off('load-strokes', callback);
    }
  }, [socket]);

  const onCursorUpdate = useCallback((callback) => {
    if (socket) {
      socket.on('cursor-update', callback);
      return () => socket.off('cursor-update', callback);
    }
  }, [socket]);

  const onUserLeft = useCallback((callback) => {
    if (socket) {
      socket.on('user-left', callback);
      return () => socket.off('user-left', callback);
    }
  }, [socket]);

  const onUsersUpdate = useCallback((callback) => {
    if (socket) {
      socket.on('users-update', callback);
      return () => socket.off('users-update', callback);
    }
  }, [socket]);

  return {
    socket,
    connected,
    emitStroke,
    emitCursor,
    onReceiveStroke,
    onLoadStrokes,
    onCursorUpdate,
    onUserLeft,
    onUsersUpdate
  };
}
