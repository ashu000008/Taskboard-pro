import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { currentUser, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    if (!currentUser || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }
    
    const socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || 'http://localhost:3379', 
      {
        auth: { token },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5
      }
    );
    
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [currentUser, token]);
  
  const joinProject = (projectId) => {
    if (socket && connected) {
      socket.emit('join-project', projectId);
    }
  };
  
  const leaveProject = (projectId) => {
    if (socket && connected) {
      socket.emit('leave-project', projectId);
    }
  };
  
  const value = {
    socket,
    connected,
    joinProject,
    leaveProject
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
