import Bun from 'bun';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import { addPost, getPosts,getMYPosts } from '../controller/postController';
import { getUserDetailsById } from '../controller/userController';

let connectionId = 0;
let contor = 0;

type WebSocketData = {
    createdAt: number;
    token: string;
    userId: string;
};
const JWT_SECRET = 'adoptie'; // Înlocuiește cu secretul tău pentru JWT

function verifyToken(token: string): boolean {
    try {
        verify(token, JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

function getUserIdFromToken(token: string): string {
    const decodedToken = verify(token, JWT_SECRET) as { id: string };

    return decodedToken.id;
}

const tokenMap = new Map();

const intervalMap = new Map();
export function swebsocketServer_sesion() {
    Bun.serve<WebSocketData>({
        hostname: 'localhost',
        port: 3001,
        fetch(req, server) {
            //console.log(req.headers);
            if (req.headers.get('Upgrade') === 'websocket') {
                const cookies = parse(req.headers.get('Cookie') || '');
                const jwtToken = cookies.jwt;
                if (jwtToken && verifyToken(jwtToken)) {
                    const succes = server.upgrade(req, {
                        data:
                        {
                            createdAt: Date.now(),
                            token: jwtToken,
                            userId: getUserIdFromToken(jwtToken)
                        }
                    })
                    if (succes) {
                        return;
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
                        //ws.send(JSON.stringify({ type: 'TOKEN_INV' }));
                    }
                }, 5000);

                // Salvează intervalId în WebSocket pentru a putea fi oprit la închidere
                intervalMap.set(ws, intervalId);
            },
            async message(ws, message) {
                try {
                    const parsedMessage = JSON.parse(String(message));
                    if (!verifyToken(ws.data.token)) {
                        console.log('Token invalid');
                        ws.send(JSON.stringify({ type: 'TOKEN_INV' }));
                        setTimeout(() => {
                            ws.close();
                        }, 2000);
                    }
                    else
                        switch (parsedMessage.type) {
                            case 'ADD_POST':
                                const userId = ws.data.userId;
                                //console.log('parsedMessage.data', parsedMessage.data);
                                const response = await addPost(parsedMessage.data, userId);
                                console.log('response', response);
                                ws.send(JSON.stringify({ type: response.message === 'Postare adăugată cu succes' ? 'POST_SUCCESS' : 'POST_ERROR', message: response }));
                                break;
                            case 'GET_POST_BATCH':
                                // Presupunem că parsedMessage conține un câmp 'lastRetrievedId' și 'batchSize'
                                console.log('parsedMessage.data', parsedMessage.data);
                                const postsResponse = await getPosts(parsedMessage.data.batchSize, parsedMessage.data.lastId);

                                if (postsResponse.posts && postsResponse.posts.length > 0) {
                                    // Pregătește postările cu detalii despre creatorii lor
                                    const postsWithCreators = await Promise.all(postsResponse.posts.map(async (post) => {
                                        // Presupunând că getUserDetailsById este o funcție exportată și disponibilă în acest context
                                        const creatorDetails = await getUserDetailsById(post.creatorId.toString());
                                        return {
                                            ...post.toObject(), // Convertirea documentului Mongoose într-un obiect JavaScript
                                            creator: creatorDetails
                                        };
                                    }));
                                    ws.send(JSON.stringify({
                                        type: 'GET_POST_BATCH_SUCCESS',
                                        posts: postsWithCreators,
                                        hasMore: postsResponse.hasMore
                                    }));
                                }
                                else {
                                    if (postsResponse.posts && postsResponse.posts.length === 0) {
                                        ws.send(JSON.stringify({
                                            type: 'GET_POST_BATCH_SUCCESS',
                                            posts: postsResponse.posts,
                                            hasMore: false
                                        }));
                                    }else
                                    ws.send(JSON.stringify({
                                        type: 'GET_POST_BATCH_ERROR',
                                        message: postsResponse.message
                                    }));
                                }
                                break;
                                case 'GET_MYPOST_BATCH':
                                    // Presupunem că parsedMessage conține un câmp 'lastRetrievedId' și 'batchSize'
                                    console.log('parsedMessage.data', parsedMessage.data);
                                    const creatorId = ws.data.userId;
                                    const mypostsResponse = await getMYPosts(parsedMessage.data.batchSize,creatorId, parsedMessage.data.lastId);
    
                                    if (mypostsResponse.posts && mypostsResponse.posts.length > 0) {
                                        // Pregătește postările cu detalii despre creatorii lor
                                        const postsWithCreators = await Promise.all(mypostsResponse.posts.map(async (post) => {
                                            // Presupunând că getUserDetailsById este o funcție exportată și disponibilă în acest context
                                            const creatorDetails = await getUserDetailsById(post.creatorId.toString());
                                            return {
                                                ...post.toObject(), // Convertirea documentului Mongoose într-un obiect JavaScript
                                                creator: creatorDetails
                                            };
                                        }));
                                        ws.send(JSON.stringify({
                                            type: 'GET_POST_BATCH_SUCCESS',
                                            posts: postsWithCreators,
                                            hasMore: mypostsResponse.hasMore
                                        }));
                                    }
                                    else {
                                        if (mypostsResponse.posts && mypostsResponse.posts.length === 0) {
                                            ws.send(JSON.stringify({
                                                type: 'GET_POST_BATCH_SUCCESS',
                                                posts: mypostsResponse.posts,
                                                hasMore: false
                                            }));
                                        }else
                                        ws.send(JSON.stringify({
                                            type: 'GET_POST_BATCH_ERROR',
                                            message: mypostsResponse.message
                                        }));
                                    }
                                    break;
                            default:
                                ws.send(JSON.stringify({ type: 'UNKNOWN_MESSAGE_TYPE' }));
                        }
                } catch (error) {
                    console.error('Eroare la procesarea mesajului(session):', error);
                    console.log('Mesaj primit:', message);
                    ws.send(JSON.stringify({ type: 'ERROR', data: 'Eroare la procesarea cererii(session)' }));
                }
            },

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
