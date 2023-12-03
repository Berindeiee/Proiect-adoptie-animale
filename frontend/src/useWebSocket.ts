import { useEffect, useRef } from 'react';

const useWebSocket = () => {
  const socket = useRef<WebSocket | null>(null);
  const isDisconnectIntentionalRef = useRef(false);

  const connectWebSocket = (): void => {
    if (!socket.current || socket.current.readyState === WebSocket.CLOSED || socket.current.readyState === WebSocket.CLOSING) {
      console.log('Conectare la sesion WebSocket...');
      socket.current = new WebSocket("ws://127.0.0.1:3001");

      socket.current.onopen = (): void => {
        console.log('Sesion WebSocket Connected');
      };

      socket.current.onclose = (): void => {
        if (!isDisconnectIntentionalRef.current) {
          console.log('Sesion WebSocket Disconnected. Attempting to reconnect...');
          setTimeout(connectWebSocket, 10000);
        } else {
          console.log('Sesion WebSocket Disconnected Intentionally');
        }
      };

      socket.current.onerror = (event): void => {
        console.log('Sesion WebSocket Error', event);
      };

      socket.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Mesaj primit de la server:', response);
      };
    } else {
      console.log('O conexiune WebSocket este deja deschisă sau în curs de deschidere');
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      setTimeout(() => {
        socket.current?.close();
      }, 10);
      
    };
  }, []);

  return socket;
};

export default useWebSocket;
