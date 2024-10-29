// SocketContext.tsx
import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { connectSocket, disconnectSocket } from './socketUtils'; 
import { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps): JSX.Element => {
  const socket = useMemo(() => {
    const token = localStorage.getItem('expertToken') || '';
    const refreshToken = localStorage.getItem('expertRefreshToken') || '';
    return connectSocket(token, refreshToken);
  }, []);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context.socket;
};
