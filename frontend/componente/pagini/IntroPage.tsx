// HomePage.tsx
import React from 'react';
import NavBar from '../organisme/NavBar'; // Presupunând că NavBar.tsx este în același director
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const IntroPage: React.FC = () => {
  return (
    <div>
      <NavBar/>
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bine ai venit pe pagina de introducere!
          </Typography>
          <Typography variant="body1">
            Acesta este un exemplu simplu de pagină de introducere care folosește Material-UI și React.
          </Typography>
          {/* Alte componente sau conținut pot fi adăugate aici. */}
        </Box>
      </Container>
    </div>
  );
};

export default  IntroPage;
