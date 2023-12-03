import Bun  from 'bun';
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

export function swebsocketServer_sesion() {
    Bun.serve({
        hostname:'localhost',
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
                }else{
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
            },
            message(ws, message) {
                // Implementează logica specifică aici
            },
            // Add other handlers as needed (close, etc.)
            close(ws) {
                contor--;
                console.log(`Conexiune sesion WebSocket închisă. ID Conexiune: ${connectionId}S, numar conexiuni: ${contor}`);
            }
        }
    });
}
