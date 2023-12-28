import React, { createContext, useContext, useEffect, useRef } from 'react';
import useWebSocket from '../src/useWebSocket'; // Actualizați calea către hook-ul dvs. useWebSocket

// Definirea tipurilor pentru valorile contextului
interface WebSocketContextValue {
  socket: WebSocket | null;
  intentionalDisconnect: () => void;
  sendMessage: (message: any) => void;
  onMessageReceived: (data: any, showDialog: any) => void; // Update the function signature
}

// Creează un context de WebSocket cu tipul corespunzător
const WebSocketContext = createContext<WebSocketContextValue | null>(null);

// Provider component care înconjoară copiii în contextul WebSocket
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, intentionalDisconnect, connectWebSocket, sendMessage, onMessageReceived} = useWebSocket();
  const hasConnectedRef = useRef(false);
  console.log('socket.current.readyState=' + socket.current?.readyState);
  useEffect(() => {
    // Funcția de curățare pentru useEffect
    if (!hasConnectedRef.current) {
      hasConnectedRef.current = true;
      connectWebSocket();
      onMessageReceived();
    }

    console.log('Componenta WebSocketProvider a fost montată');
    return () => {
      // Închideți WebSocket-ul atunci când componenta este dezmontată

      if (socket.current) {
        intentionalDisconnect();
      }
      hasConnectedRef.current = false;
    };

  }, [connectWebSocket]);


  return (
    <WebSocketContext.Provider value={{ socket: socket.current, intentionalDisconnect, sendMessage, onMessageReceived }}>
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
