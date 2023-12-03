import { connectToDb } from './dataBaze'; // Importă funcția de conectare la baza de date
import { startWebSocketServer_login } from './webSockets/websocketServer_login'; // Importă funcția de pornire a serverului WebSocket
import {swebsocketServer_sesion} from './webSockets/websocketServer_sesion';

async function startApplication() {
  try {
    await connectToDb(); // Conectează-te la baza de date
    startWebSocketServer_login(); // Porneste serverul WebSocket pentru login
    console.log('Serverul WebSocket pentru login a pornit cu succes');
    swebsocketServer_sesion(); // Porneste serverul WebSocket pentru sesiune
    console.log('Serverul WebSocket pentru sesiune a pornit cu succes');
  } catch (error) {
    console.error('Eroare la pornirea aplicației:', error);
    process.exit(1);
  }
}

startApplication();
