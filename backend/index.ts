import Bun from 'bun';
import * as mongoose from 'mongoose';
import {User} from './schema';

const db=process.env.MONGODB_URI;
const { MongoClient } = require('mongodb');

async function connectToDb() {
  const client = new MongoClient(db);
  await client.connect();
  console.log('Conectat la baza de date');
  // Restul codului tău urmează aici
}
async function saveUser(user: User) {
    const newUser = new User(user);
    await newUser.save();
    
}

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
    message(ws, message) {
        console.log('Mesaj primit:', message);

        try {
            const registrationData = JSON.parse(String(message));
            // De exemplu, salvează datele într-o bază de date
            console.log('Datele de înregistrare:', registrationData);
            const user = new User(registrationData);
            connectToDb();
            saveUser(user)

            ws.send('Înregistrare reușită');
        } catch (error) {
            console.error('Eroare la procesarea mesajului:', error);
            ws.send('Eroare la procesarea înregistrării');
        }
    },
    close(ws, code, message) {
      console.log('Conexiune WebSocket închisă');
    },
    // Alte event handlers dacă sunt necesare
  },
});
