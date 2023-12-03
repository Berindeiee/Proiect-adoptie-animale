import { User, IUser } from '../schema/schema';
import { saveUser, checkUsernameAvailability, loginUser } from '../controller/userController';
import Bun from 'bun';

let connectionId = 0;
let contor = 0;

interface ExtendedWebSocket extends Bun.ServerWebSocket {
  id: number;
}


export function startWebSocketServer_login() {
  Bun.serve({
    port: 3000,
    fetch(req, server) {
      console.log("Cerere de la client: ");
      if (server.upgrade(req)) {
        return; // Nu returna un răspuns pentru upgrade-ul reușit la WebSocket
      }
      return new Response("Upgrade failed :(", { status: 500 });
    },
    websocket: {
      open(ws) {
        const extendedWs = ws as ExtendedWebSocket;
        connectionId++;
        contor++;
        extendedWs.id = connectionId; // Asignează un ID unic fiecărei conexiuni
        console.log(`Conexiune WebSocket deschisă. ID Conexiune: ${extendedWs.id}L, numar conexiuni: ${contor}`);
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
              console.log('Verificare disponibilitate nume de utilizator...' + isAvailable);
              ws.send(JSON.stringify({ type: 'USERNAME_AVAILABILITY', isAvailable }));
              break;
            case 'LOGIN_USER':
              const loginResult = await loginUser(parsedMessage.data.email, parsedMessage.data.password);
              if (loginResult.user) {
                console.log('Utilizatorul ' + loginResult.user.fullName + ' s-a logat');
                ws.send(JSON.stringify({ type: 'LOGIN_SUCCESS', data: loginResult }));
              } else {
                console.log('Logare eșuată: ' + loginResult.message);
                ws.send(JSON.stringify({ type: 'LOGIN_ERROR', data: loginResult.message }));
              }
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
        const extendedWs = ws as ExtendedWebSocket;
        contor--;
        console.log(`Conexiune WebSocket închisă. ID Conexiune: ${extendedWs.id}L, numar conexiuni ramase: ${contor}`);
      },
    },
  });
}
