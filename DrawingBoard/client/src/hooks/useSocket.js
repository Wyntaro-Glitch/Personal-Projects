import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    return () => newSocket.close();
  }, []);

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

  return {
    socket,
    connected,
    emitStroke,
    emitCursor,
    onReceiveStroke,
    onLoadStrokes,
    onCursorUpdate,
    onUserLeft
  };
}