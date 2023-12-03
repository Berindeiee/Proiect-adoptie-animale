import { useEffect, useRef, useCallback } from 'react';

const useWebSocket = () => {
  // Ref pentru obiectul WebSocket
  const socket = useRef<WebSocket | null>(null);

  // Ref pentru a ține evidența dacă deconectarea a fost intenționată
  const isDisconnectIntentionalRef = useRef(false);

  // Ref pentru a ține evidența timeout-ului de reconectare
  const reconnectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Conectează WebSocket-ul
  const connectWebSocket = useCallback((): void => {
    if (!socket.current || socket.current.readyState === WebSocket.CLOSED || socket.current.readyState === WebSocket.CLOSING) {
      console.log('Conectare la sesion WebSocket...');
      socket.current = new WebSocket("ws://127.0.0.1:3001");

      socket.current.onopen = (): void => {
        console.log('Sesion WebSocket Connected');
      };

      socket.current.onclose = (): void => {
        if (!isDisconnectIntentionalRef.current) {
          console.log('Sesion WebSocket Disconnected. Attempting to reconnect...');
          reconnectionTimeoutRef.current = setTimeout(connectWebSocket, 10000);
        } else {
          console.log('Sesion WebSocket Disconnected Intentionally');
        }
      };

      socket.current.onerror = (event): void => {
        console.error('Sesion WebSocket Error', event);
      };

      socket.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Mesaj primit de la server:', response);
      };
    } else {
      console.log('O conexiune WebSocket este deja deschisă sau în curs de deschidere');
    }
  }, []);

  // Deconectează WebSocket-ul intenționat
  const intentionalDisconnect = useCallback(() => {
    isDisconnectIntentionalRef.current = true;
    if (socket.current) {
      socket.current.close();
    }
  }, []);

  useEffect(() => {
    connectWebSocket();

    // Funcția care închide socket-ul atunci când pagina este în curs de închidere sau reîncărcare
    const closeWebSocketOnUnload = () => {
      socket.current?.close();
    };

    // Adaugă listener pentru evenimentul 'beforeunload'
    window.addEventListener('beforeunload', closeWebSocketOnUnload);

    // Funcția de curățare pentru useEffect
    return () => {
      // Curăță timeout-ul de reconectare dacă există
      if (reconnectionTimeoutRef.current) {
        clearTimeout(reconnectionTimeoutRef.current);
      }
      // Închide WebSocket-ul
      if (socket.current && socket.current.readyState === 1) {
        socket.current.close();
      }
      // Înlătură listener-ul pentru 'beforeunload'
      window.removeEventListener('beforeunload', closeWebSocketOnUnload);
    };
  }, [connectWebSocket]);

  // Returnează referința socket-ului și funcția de deconectare intenționată
  return { socket, intentionalDisconnect };
};

export default useWebSocket;
