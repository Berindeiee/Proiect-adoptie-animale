import { useEffect, useRef, useCallback } from 'react';
import { useDialog } from './DialogContext';

const useWebSocket = () => {
  // Ref pentru obiectul WebSocket
  const socket = useRef<WebSocket | null>(null);

  // Ref pentru a ține evidența dacă deconectarea a fost intenționată
  const isDisconnectIntentionalRef = useRef(false);


  // Conectează WebSocket-ul
  const connectWebSocket = useCallback((): void => {
    if (!socket.current || socket.current.readyState === WebSocket.CLOSED || socket.current.readyState === WebSocket.CLOSING) {
      isDisconnectIntentionalRef.current = false;
      console.log('Conectare la sesion WebSocket...');
      socket.current = new WebSocket("ws://127.0.0.1:3001");

      socket.current.onopen = (): void => {
        console.log('Sesion WebSocket Connected');
      };

      socket.current.onclose = (): void => {

        if (!isDisconnectIntentionalRef.current) {
          console.log('Sesion WebSocket Disconnected. Attempting to reconnect...');
          setTimeout(connectWebSocket, 3000);
        } else {
          console.log('Sesion WebSocket Disconnected Intentionally');
          isDisconnectIntentionalRef.current = false;
        }
      };

      socket.current.onerror = (event): void => {
        console.error('Sesion WebSocket Error', event);
      };


    } else {
      console.log('O conexiune sesion WebSocket este deja deschisă sau în curs de deschidere');
    }
  }, []);

  // Deconectează WebSocket-ul intenționat
  const intentionalDisconnect = useCallback(() => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      //console.log("isDisconnectIntentionalRef.current = true")
      isDisconnectIntentionalRef.current = true;
      socket.current.close();
    }
  }, []);

  // Funcția de trimitere a mesajelor către server
  const sendMessage = useCallback((message) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(message);
    }
  }, []);

  const { showDialog } = useDialog();
  const onMessageReceived = useCallback((callback = (data) => {}) => {
    if (socket.current) {
      socket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Verifică dacă mesajul primit este de tipul 'SPECIAL_MESSAGE'
        if (data.type === 'PERIODIC_MESSAGE') {
          console.log('Mesaj periodic primit:', data.message);
          return; // Opțional: returnează dacă nu doriți să trimiteți mai departe mesajul
        }

        if (data.type === 'TOKEN_INV') {
          showDialog('Sesiunea a expirat. Vă rugăm să vă logați din nou.');
        }

        // Trimite mesajul către handlerul definit în componentă
        callback(data);
      };
    }
  }, []);



  useEffect(() => {

    // Funcția care închide socket-ul atunci când pagina este în curs de închidere sau reîncărcare
    const closeWebSocketOnUnload = () => {
      intentionalDisconnect();
    };

    // Adaugă listener pentru evenimentul 'beforeunload'
    window.addEventListener('beforeunload', closeWebSocketOnUnload);
    isDisconnectIntentionalRef.current = false;
    // Funcția de curățare pentru useEffect
    return () => {
      // Închide WebSocket-ul
      isDisconnectIntentionalRef.current = true;
      window.removeEventListener('beforeunload', closeWebSocketOnUnload);
    };
  }, [connectWebSocket]);

  // Returnează referința socket-ului și funcția de deconectare intenționată
  return { socket, intentionalDisconnect, connectWebSocket, sendMessage, onMessageReceived };
};

export default useWebSocket;
