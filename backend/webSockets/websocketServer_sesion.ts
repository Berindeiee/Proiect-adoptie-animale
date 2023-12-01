import Bun from 'bun';

Bun.serve({
    async fetch(req, server) {
        const token = extractToken(req) // Extrageți tokenul cum doriți, depinde de implementare // Adăugați logica de validare a tokenului aici.
        if (!isValidToken(token)) {
            // Dacă tokenul nu este valid, răspundeți cu un mesaj corespunzător
            return new Response("Invalid token", { status: 401 });
        }

        const userData = getUserDataFromToken(token) // Extrageți datele dvs. de autentificare în funcție de token const success = server.upgrade(req, { data: userData }) // Îmbunătățiți conexiunea cu datele de autentificare if (success) {
            return undefined; // Bun va returna automatic un răspuns 101 Switching Protocols dacă îmbunătățirea reușește ^4^]
        }
        
        // Gestionarea cererii HTTP în mod normal în caz contrar
    },
    websocket : {
        // Definiți handlerele websocket necesare aici <sup><a href="#">1</a></sup>
    }
});