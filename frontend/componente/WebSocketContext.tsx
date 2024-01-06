import React, { createContext, useContext, useEffect, useRef } from 'react';
import useWebSocket from '../src/useWebSocket'; 

// Definirea tipurilor pentru valorile contextului
interface WebSocketContextValue {
  socket: WebSocket | null;
  isConected: boolean;
  intentionalDisconnect: () => void;
  sendMessage: (message: any) => void;
  onMessageReceived: (data?: any, showDialog?: any) => void; // Update the function signature
}

// Creează un context de WebSocket cu tipul corespunzător
const WebSocketContext = createContext<WebSocketContextValue | null>(null);

// Provider component care înconjoară copiii în contextul WebSocket
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket,isConnected, intentionalDisconnect, connectWebSocket, sendMessage, onMessageReceived} = useWebSocket();
  const hasConnectedRef = useRef(false);
  
  useEffect(() => {
    // Definește o funcție asincronă în interiorul useEffect
    const initializeWebSocket = async () => {
      if (!hasConnectedRef.current) {
        try {
          await connectWebSocket(); // Așteaptă până când conexiunea WebSocket este stabilită
          // onMessageReceived(()=>{}); // Setează handlerul pentru mesaje
          sendMessage("Hello from WebSocketProvider!"); // Trimite un mesaj
          hasConnectedRef.current = true;
        } catch (error) {
          console.error("Conectarea la WebSocket a eșuat", error);
        }
      }
    };

    // Apelează funcția asincronă
    initializeWebSocket();

    return () => {
      // Închide WebSocket-ul la demontarea componentei
      if (socket.current) {
        intentionalDisconnect();
      }
      hasConnectedRef.current = false;
    };
  }, []);


  return (
    <WebSocketContext.Provider value={{ socket: socket.current, isConected: isConnected, intentionalDisconnect, sendMessage, onMessageReceived }}>
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
