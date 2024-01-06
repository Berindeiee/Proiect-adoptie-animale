import React, { useEffect, useState } from 'react';
import NavBar from '../organisme/NavBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Importează noua versiune de Grid
import Button from '@mui/material/Button'; // Import pentru buton
import { useWebSocketContext } from '../WebSocketContext';
import RecipeReviewCard from '../organisme/RecipeReviewCard';
import { AlertColor, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import mongoose from 'mongoose';

interface IPost {
  _id: mongoose.Schema.Types.ObjectId | string;
  name: string;
  animalType: string;
  breed: string;
  birthDate: Date;
  gender: string;
  weight: string;
  description: string;
  urls: string[];
  isDeleted: boolean;
  creatorId: mongoose.Schema.Types.ObjectId | string;
  createdAt: Date;
}

const IntroPage: React.FC = () => {

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  const { isConected, sendMessage, onMessageReceived } = useWebSocketContext();
  const [posts, setPosts] = useState<IPost[]>([]); // Starea pentru postări
  const [lastId, setLastId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string[]>([]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // Opțional: Reîncarcă postările filtrate
  };



  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Funcția pentru a încărca mai multe postări
  const loadMorePosts = () => {
    // Setează un timer pentru a executa logica după o întârziere
    setTimeout(() => {
      const messageData = { lastId: lastId, batchSize: 3 };
      console.log(messageData);
      sendMessage(JSON.stringify({ type: "GET_POST_BATCH", data: messageData }));
      setSnackbarMessage('Se încarcă postările...');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }, 1000); // 1000 de milisecunde = 1 secundă
  };

  const loadAllPosts = () => {
    // Setează un timer pentru a executa logica după o întârziere
    setTimeout(() => {
      const messageData = { lastId: lastId, batchSize: 100 };
      console.log(messageData);
      sendMessage(JSON.stringify({ type: "GET_POST_BATCH", data: messageData }));
      setSnackbarMessage('Se încarcă postările...');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }, 1000); // 1000 de milisecunde = 1 secundă
  }


  // Funcția pentru a procesa mesajele primite
  const handleMessageReceived = (message,) => {
    console.log('message: ', message);
    switch (message.type) {
      case 'GET_POST_BATCH_SUCCESS':
        if (message.posts.length > 0) {
          console.log(message);
          setPosts((prevPosts) => [...prevPosts, ...message.posts]);
          setSnackbarOpen(false);
          setSnackbarMessage('Postările au fost încărcate.');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage('Nu mai există postări de încărcat.');
          setSnackbarSeverity('info');
          setSnackbarOpen(true);
        }
        break;
      // Adaugă alte cazuri dacă este necesar
      case 'GET_POST_BATCH_ERROR':
        setSnackbarMessage('A apărut o eroare la încărcarea postărilor.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        break;
      default:
        setSnackbarMessage('Tip de mesaj necunoscut.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
    }
  };


  // Efect pentru a încărca inițial postările
  useEffect(() => {
    console.log('isConected: ', isConected);

    onMessageReceived(handleMessageReceived);
    //loadMorePosts();

    return () => {
      onMessageReceived((data,) => { }); // Resetarea handlerului
    }
  }, [onMessageReceived, isConected]);

  useEffect(() => {
    console.log('posts: ', posts);
    if (posts.length > 0) {
      const newLastId = posts[posts.length - 1]._id.toString(); // presupunând că fiecare post are un câmp `_id`

      setLastId(newLastId);

    }

  }, [posts]); // Dependența pentru useEffect este array-ul posts


  const filteredPosts = filter.length === 0
  ? posts
  : posts.filter(post => {
    console.log(filter)
    const postString = `${post.name} ${post.breed} ${post.animalType} ${post.birthDate} ${post.gender} ${post.weight} ${post.description}`;
    return filter.every(filterWord => postString.toLowerCase().includes(filterWord.toLowerCase()));
  });

  



  return (
    <div>
      <NavBar onFilterChange={handleFilterChange} />
      <Container maxWidth="md" style={{ overflowY: 'auto', maxHeight: '90vh' }}>
        <Box my={4}>
          <Grid container spacing={3}>
            {filteredPosts.map((post, index) => (
              <Grid key={index} xs={12} sm={6} md={4}>
                <RecipeReviewCard
                  animalName={post.name}
                  animalBreed={post.breed}
                  animalType={post.animalType}
                  birthDate={post.birthDate}
                  gender={post.gender}
                  weight={post.weight}
                  description={post.description}
                  images={post.urls}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            onClick={loadMorePosts}
            variant="contained"
            color="primary"
            sx={{ margin: '20px' }}>
            Încarcă mai multe
          </Button>
          <Button onClick={loadAllPosts} variant="contained" color="secondary" sx={{ margin: '20px' }}>
            Încarcă incă 100 de postări
          </Button>
        </Box>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        className='snackbar'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity} // Utilizează starea snackbarSeverity aici
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div >
  );
};

export default IntroPage;
