/* // SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  someData: any; // Adjust the type according to your data structure
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export function  SocketProvider({ children })  {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [someData, setSomeData] = useState<any>(null); // Adjust the type according to your data structure

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // Replace with your socket server URL
    setSocket(newSocket);

    newSocket.on('someEvent', (data: any) => {
      // Update context data based on the received event
      setSomeData(data);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketProvider value={{ socket, someData }}>
      {props.children}
    </SocketProvider>
  );
};
 */