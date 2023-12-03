// WebSocketContext.tsx

import React, { createContext, useContext } from 'react';
import useWebSocket from '../src/useWebSocket'; // Actualizați calea către hook-ul dvs. useWebSocket

// Definirea tipurilor pentru valorile contextului
interface WebSocketContextValue {
  socket: WebSocket | null;
  intentionalDisconnect: () => void;
}

// Creează un context de WebSocket cu tipul corespunzător
const WebSocketContext = createContext<WebSocketContextValue | null>(null);

// Provider component care înconjoară copiii în contextul WebSocket
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket, intentionalDisconnect } = useWebSocket();
    return (
        <WebSocketContext.Provider value={{ socket: socket.current, intentionalDisconnect }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Hook personalizat pentru a folosi contextul WebSocket
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
