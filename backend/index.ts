import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import Bun from "bun";
import { connectToDb } from "./dataBaze"; // Importă funcția de conectare la baza de date
import { startWebSocketServer_login } from "./webSockets/websocketServer_login";
import { swebsocketServer_sesion } from "./webSockets/websocketServer_sesion";

// Tip pentru structura unui fișier
interface File {
  name: string;
  data: Buffer;
}

// Funcția pentru generarea unui nume de fișier unic
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = new Date().getTime();
  const parts = originalFilename.split('.');
  const extension = parts.pop();
  return `${parts.join('.')}_${timestamp}.${extension}`;
}


// Funcția pentru încărcarea fișierelor
async function uploadFilesToAzure(files: File[], containerClient: ContainerClient) {
  const uploadPromises = files.map(async (file) => {
    const uniqueFilename = generateUniqueFilename(file.name);
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFilename);
    await blockBlobClient.uploadData(file.data);
    return blockBlobClient.url;
  });

  return Promise.all(uploadPromises);
}


try {
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient("adoptie");

  await connectToDb();
  startWebSocketServer_login();
  swebsocketServer_sesion();

  const server = Bun.serve({
    hostname: "localhost",
    port: 8080,
    fetch: async (req: Request): Promise<Response> => {
      const headers = {
        "Access-Control-Allow-Origin": "*", // Permite accesul de la acest origin

      };
      
      // Gestionarea cererilor OPTIONS pentru CORS preflight
    if (req.method === "OPTIONS") {
      console.log("req.method === OPTIONS")
      return new Response(null, {
        status: 204, // No Content
        headers: headers
      });
    }
      //console.log("req.url", req.url, "req.method", req.method, "req.headers", req.headers, "req.body", req.body);
      if (req.method === "POST" && req.url === "http://localhost:8080/upload") {
        const formData = await req.formData(); // trebuie pus formData ca key in postman pentru a testa
        const files: File[] = []; // Extragerea fișierelor din cerere
        console.log("formData", formData);
        for (const [fieldName, value] of formData.entries()) {
          // Check if the entry is a file (instance of Blob)
          if (value instanceof Blob) {
            console.log("fieldName", fieldName, "value", value);
            const buffer = await value.arrayBuffer();
            const file = {
              name: value instanceof File ? value.name : fieldName,
              data: Buffer.from(buffer),
            };
            files.push(file);
          }
        }

        return uploadFilesToAzure(files, containerClient)
          .then((urls) => {
            console.log("urls", urls);
            const respondse = new Response(JSON.stringify({ urls }), {
              status: 200,
              headers: headers,
            });
            return respondse;
          })
          .catch((error: Error) => {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 501,
              headers: headers,
            });
          });
      }
      // ... alte handler-uri ...
      return new Response(undefined, {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    },
    // ... restul configurației ...
  });


} catch (error: any) {
  console.error("Eroare la pornirea aplicației:", error.message);
  process.exit(1);
}
