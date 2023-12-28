import Bun from 'bun';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import { User, IUser } from '../schema/schema';
import { saveUser, checkUsernameAvailability, loginUser } from '../controller/userController';

let connectionId = 0;
let contor = 0;

const JWT_SECRET = 'adoptie'; // Înlocuiește cu secretul tău pentru JWT

function verifyToken(token: string): boolean {
    try {
        verify(token, JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}
const intervalMap = new Map();
export function swebsocketServer_sesion() {
    Bun.serve({
        hostname: 'localhost',
        port: 3001,
        fetch(req, server) {
            //console.log(req.headers);
            if (req.headers.get('Upgrade') === 'websocket') {
                const cookies = parse(req.headers.get('Cookie') || '');
                const jwtToken = cookies.jwt;
                if (jwtToken && verifyToken(jwtToken)) {
                    if (server.upgrade(req)) {
                        return; // Successful upgrade
                    }
                } else {
                    return new Response("Upgrade failed, token lipsă sau invalid", { status: 401 });
                }
            }

            return new Response("Upgrade failed", { status: 401 });
        },
        websocket: {
            open(ws) {
                connectionId++;
                contor++;
                console.log(`Conexiune sesion WebSocket deschisă. ID Conexiune: ${connectionId}S, numar conexiuni: ${contor}`);
                // Setează un timer pentru a trimite un mesaj la fiecare 5 secunde
                const intervalId = setInterval(() => {
                    if (ws.readyState === 1) {
                        ws.send(JSON.stringify({ type: 'PERIODIC_MESSAGE', message: "Mesaj periodic de la server" }));
                    }
                }, 5000);

                // Salvează intervalId în WebSocket pentru a putea fi oprit la închidere
                intervalMap.set(ws, intervalId);
            },
            async message(ws, message) {
                try {
                    const parsedMessage = JSON.parse(String(message));

                    switch (parsedMessage.type) {
                        case 'SAVE_POST':
                            console.log(`Mesaj primit de la client: ${message}`);

                        default:
                            ws.send(JSON.stringify({ type: 'UNKNOWN_MESSAGE_TYPE' }));
                    }
                } catch (error) {
                    console.error('Eroare la procesarea mesajului(session):', error);
                    ws.send(JSON.stringify({ type: 'ERROR', data: 'Eroare la procesarea cererii(session)' }));
                }
            },
            // Add other handlers as needed (close, etc.)
            close(ws) {
                // Oprește timer-ul asociat cu acest ws
                const intervalId = intervalMap.get(ws);
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalMap.delete(ws);
                }

                contor--;
                console.log(`Conexiune sesion WebSocket închisă. ID Conexiune: ${connectionId}S, numar conexiuni: ${contor}`);
            }
        }
    });
    console.log("Serverul sesion WebSocket a pornit.");
}
