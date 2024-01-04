// HomePage.tsx
import React, { useEffect } from 'react';
import NavBar from '../organisme/NavBar'; // Presupunând că NavBar.tsx este în același director
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useWebSocketContext } from '../WebSocketContext';
import RecipeReviewCard from '../organisme/RecipeReviewCard';

const IntroPage: React.FC = () => {

  
  return (
    <div>
      <NavBar />
      <Container maxWidth="md">
        <Box my={4}>
          <RecipeReviewCard 
          animalName="Titlul"
          animalBreed="Breed"
          animalType="Autor"
          birthDate="Data"
          gender="Gen"
          weight="Greutate"
          description="Descriere"
          images={['https://adrianberindeie.blob.core.windows.net/adoptie/Eren_1703779322807_1703790163967_1704390222027.jpg',
          'https://adrianberindeie.blob.core.windows.net/adoptie/database_1704390222035.png',
          'https://adrianberindeie.blob.core.windows.net/adoptie/logo-standard_1704390222036.png',
          'https://adrianberindeie.blob.core.windows.net/adoptie/application_1704390222037.png'
        ]}
          content="Descrierea rețetei..."
          />
        </Box>
      </Container>
    </div>
  );
};

export default IntroPage;
