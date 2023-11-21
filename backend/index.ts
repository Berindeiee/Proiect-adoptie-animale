import { connectToDb } from './dataBaze'; // Importă funcția de conectare la baza de date
import { startWebSocketServer } from './websocketServer'; // Importă funcția de pornire a serverului WebSocket

async function startApplication() {
  try {
    await connectToDb(); // Conectează-te la baza de date
    startWebSocketServer(); // Porneste serverul WebSocket
  } catch (error) {
    console.error('Eroare la pornirea aplicației:', error);
    process.exit(1);
  }
}

startApplication();
