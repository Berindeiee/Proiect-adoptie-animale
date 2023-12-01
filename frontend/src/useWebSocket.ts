// useWebSocket.ts
import { useEffect, useRef } from 'react';

const useWebSocket = () => {
  const socket = useRef<WebSocket | null>(null);
  const isDisconnectIntentionalRef = useRef(false);

  useEffect(() => {
    const connectWebSocket = (): void => {
      if (!socket.current || socket.current.readyState === WebSocket.CLOSED || socket.current.readyState === WebSocket.CLOSING) {
        socket.current = new WebSocket('ws://localhost:3000');
        socket.current.onopen = (): void => {
          console.log('WebSocket Connected');
          // Trimite întregul șir de cookie-uri
          if (socket.current) {
            socket.current.send(document.cookie);
          }
        };

        socket.current.onclose = (): void => {
          if (!isDisconnectIntentionalRef.current) {
            console.log('WebSocket Disconnected. Attempting to reconnect...');
            setTimeout(connectWebSocket, 10000);
          } else {
            console.log('WebSocket Disconnected Intentionally');
          }
        };

        socket.current.onerror = (event): void => {
          console.log('WebSocket Error', event);
        };

        socket.current.onmessage = (event) => {
          const response = JSON.parse(event.data);
          console.log('Mesaj primit de la server:', response);
          // Implementează logica specifică pentru fiecare tip de mesaj
          switch (response.type) {
            case 'REGISTRATION_SUCCESS':
              // Logica pentru succesul înregistrării
              break;
            case 'REGISTRATION_ERROR':
              // Logica pentru eroare de înregistrare
              break;
            // ...alte cazuri
          }
        };
      } else {
        console.log('O conexiune WebSocket este deja deschisă sau în curs de deschidere');
      }
    };

    connectWebSocket();

    return () => {
      isDisconnectIntentionalRef.current = true;
      socket.current?.close();
    };
  }, []);

  return socket;
};

export default useWebSocket;
