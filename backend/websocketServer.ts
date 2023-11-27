import { User, IUser } from './schema/schema';
import { saveUser, checkUsernameAvailability } from './controller/userController';
import Bun from 'bun';

export function startWebSocketServer() {
  Bun.serve({
    port: 3000,
    fetch(req, server) {
      if (server.upgrade(req)) {
        return; // Nu returna un răspuns pentru upgrade-ul reușit la WebSocket
      }
      return new Response("Upgrade failed :(", { status: 500 });
    },
    websocket: {
      open(ws) {
        console.log('Conexiune WebSocket deschisă');
      },
      async message(ws, message) {
        try {
          const parsedMessage = JSON.parse(String(message));
      
          switch (parsedMessage.type) {
            case 'REGISTER_USER':
              const result = await saveUser(parsedMessage.data as IUser);
              ws.send(JSON.stringify({ type: result === 'Înregistrare reușită' ? 'REGISTRATION_SUCCESS' : 'REGISTRATION_ERROR', data: result }));
              break;
            case 'CHECK_USERNAME':
              const isAvailable = await checkUsernameAvailability(parsedMessage.data);
              console.log('Verificare disponibilitate nume de utilizator...'+isAvailable);
              ws.send(JSON.stringify({ type: 'USERNAME_AVAILABILITY', isAvailable }));
              break;
            default:
              ws.send(JSON.stringify({ type: 'UNKNOWN_MESSAGE_TYPE' }));
          }
        } catch (error) {
          console.error('Eroare la procesarea mesajului:', error);
          ws.send(JSON.stringify({ type: 'ERROR', data: 'Eroare la procesarea cererii' }));
        }
      },
      close(ws, code, message) {
        console.log('Conexiune WebSocket închisă');
      },
    },
  });
}
