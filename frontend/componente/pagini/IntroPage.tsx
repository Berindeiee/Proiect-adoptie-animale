// HomePage.tsx
import React, { useEffect } from 'react';
import NavBar from '../organisme/NavBar'; // Presupunând că NavBar.tsx este în același director
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useWebSocketContext } from '../WebSocketContext';

const IntroPage: React.FC = () => {
  const { sendMessage, onMessageReceived } = useWebSocketContext();

  useEffect(() => {
    // Setează un handler pentru mesajele primite
    onMessageReceived((data) => {
      console.log("Mesaj primit:", data);
      // Aici puteți adăuga logica specifică în funcție de mesaj
    });
  }, [onMessageReceived]);

  // Funcția de trimitere a unui mesaj
  const handleSendMessage = () => {
    sendMessage("Mesajul meu către server");
  };
  
  return (
    <div>
      <NavBar />
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bine ai venit pe pagina de introducre!
          </Typography>
          <Typography variant="body1">
            Acesta este un exemplu simplu de pagină de introducere 
          </Typography>
          {/* Alte componente sau conținut pot fi adăugate aici. */}
        </Box>
      </Container>
    </div>
  );
};

export default IntroPage;
