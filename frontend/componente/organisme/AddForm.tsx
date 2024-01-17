import {
  Container,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Autocomplete,
  AlertColor,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Dog from './dog';
import '../pagini/Css/add-form.css'
import { DropzoneArea } from 'material-ui-dropzone';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextTitlu from '../atomi/textTitlu';
import { useWebSocketContext } from '../WebSocketContext';
import { useEffect, useState } from 'react';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useDialog } from '../../src/DialogContext';

const tipuriAnimale = [
  { label: 'Câine' },
  { label: 'Pisică' },
  { label: 'Iepure' },
  { label: 'Hamster' },
  { label: 'Papagal' },
  { label: 'Pește' },
  { label: 'Șarpe' },
  { label: 'Broască Țestoasă' },
  { label: 'Broască' },
  { label: 'Porcușor de Guineea' },
  { label: 'Lemur' },
  { label: 'Cangur' },
  { label: 'Capră' },
  { label: 'Cal' },
  { label: 'Ponei' },
  { label: 'Veveriță' },
  { label: 'Leopard' },
  { label: 'Urs' },
  { label: 'Elefant' },
  { label: 'Girafă' },
  { label: 'Zebra' },
  { label: 'Rinocer' },
  { label: 'Leu' },
  { label: 'Tigru' },
  { label: 'Cocor' },
  { label: 'Flamingo' },
  { label: 'Vacă' },
  {label: 'Pinuin'},
];


const AddForm = () => {

  //const { socket } = useWebSocketContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  const [data_animal, setdata_animal] = React.useState<Dayjs | null>(dayjs());
  const [gen, setGen] = useState('');
  const [greutate, setGreutate] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const { sendMessage, onMessageReceived } = useWebSocketContext();


  const handlePhotoChange = (files) => {
    setUploadedPhotos(files); // Actualizează starea cu fișierele încărcate
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nume_animal = document.getElementById('nume-animal') as HTMLInputElement;
    const rasa_animal = document.getElementById('rasa-animal') as HTMLInputElement;
    const tip_animal = document.getElementById('combo-box-animale') as HTMLInputElement;
    const descriere_animal = document.getElementById('descriere-animal') as HTMLInputElement;

    if (!nume_animal.value) {
      setSnackbarMessage("Te rog să introduci numele animalului!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!tip_animal.value) {
      setSnackbarMessage("Te rog să selectezi tipul animalului!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!rasa_animal.value) {
      setSnackbarMessage("Te rog să introduci rasa animalului!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }


    if (!data_animal) {
      setSnackbarMessage("Te rog să selectezi data nașterii!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }


    if (!gen) {
      setSnackbarMessage("Te rog să selectezi genul!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!greutate) {
      setSnackbarMessage("Te rog să selectezi greutatea!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!descriere_animal.value) {
      setSnackbarMessage("Te rog să introduci descrierea animalului!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (uploadedPhotos.length === 0) {
      setSnackbarMessage("Te rog să încarci cel puțin o fotografie a animalului!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    uploadedPhotos.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Răspunsul serverului:", response);
      // Extrage datele JSON din răspuns
      const result = await response.json();
      // Afisează URL-urile în consolă
      console.log("URL-urile fișierelor încărcate:", result.urls);

      try {
        // Trimiterea datelor prin WebSocket
        const messageData = {
          name: nume_animal.value,
          animalType: tip_animal.value,
          breed: rasa_animal.value,
          description: descriere_animal.value,
          weight: greutate,
          gender: gen,
          birthDate: data_animal,
          urls: result.urls
        };
        if (messageData.urls.length > 0) {
          const messageString = JSON.stringify({ type: "ADD_POST", data: messageData });
          // Trimiterea datelor serializate prin WebSocket
          sendMessage(messageString);
        }
      } catch (error) {
        console.error('Eroare:', error);
        setSnackbarMessage("Eroare la trimiterea datelor!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }

    } catch (error) {
      console.error('Eroare:', error);
      setSnackbarMessage("Eroare la încărcarea fotografiilor în cloud!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  const { showDialog } = useDialog();
  useEffect(() => {
    onMessageReceived((data,) => {
      console.log("Mesaj primit:", data);
      switch (data.type) {
        case 'POST_SUCCESS':
          console.log('Postarea a fost adăugată cu succes!');
          setSnackbarMessage('Postarea a fost adăugată cu succes!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          // Resetați formularul sau faceți alte acțiuni necesare
          break;

        case 'POST_ERROR':
          setSnackbarMessage('Eroare la adăugarea postării.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          break;

      }
    }, showDialog);
  }, [onMessageReceived, showDialog]); // Dependențe pentru useEffect


  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, background: '#ffffff', borderRadius: '10px' }}>
      <Grid container spacing={2} sx={{ maxWidth: 900 }}>
        <Grid item xs={12} md={4} sx={{ bgcolor: '#c2faff', color: 'white', textAlign: 'center', p: 4, borderRadius: '10px' }}>
          <TextTitlu />
          <Dog />
        </Grid>
        <Grid item xs={12} md={8} sx={{ p: 2 }}>
          <Card raised sx={{ bgcolor: '#6ec7ff' }}>
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField fullWidth id='nume-animal' label="Numele Animalului" margin="normal" variant="outlined" sx={{ mb: 2 }} />
                <Autocomplete
                  disablePortal
                  id="combo-box-animale"
                  options={tipuriAnimale}
                  isOptionEqualToValue={(option, value) => option.label === value.label}
                  renderInput={(params) => <TextField {...params} label="Tip de Animal" />}
                />
                <TextField fullWidth id='rasa-animal' label="Rasa Animalului" margin="normal" variant="outlined" sx={{ mb: 2 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DatePicker
                    value={data_animal}
                    onChange={(newValue) => {
                      setdata_animal(newValue);
                    }}
                    label="Data nașterii"
                    sx={{ width: '100%', marginBottom: '15px' }} />
                </LocalizationProvider>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Gen</FormLabel>
                  <RadioGroup row aria-label="gender" name="gender1"
                    value={gen}
                    onChange={(e) => setGen(e.target.value)}
                  >
                    <FormControlLabel value="female" control={<Radio />} label="Femelă" sx={{ mr: 2 }} />
                    <FormControlLabel value="male" control={<Radio />} label="Mascul" />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Greutate</FormLabel>
                  <RadioGroup row aria-label="weight" name="weight"
                    value={greutate}
                    onChange={(e) => setGreutate(e.target.value)}
                  >
                    <FormControlLabel value="0-5" control={<Radio />} label="0-5 kg" sx={{ mr: 2 }} />
                    <FormControlLabel value="5-10" control={<Radio />} label="5-10 kg" sx={{ mr: 2 }} />
                    <FormControlLabel value="10-20" control={<Radio />} label="10-20 kg" sx={{ mr: 2 }} />
                    <FormControlLabel value="20-30" control={<Radio />} label="20-30 kg" sx={{ mr: 2 }} />
                    <FormControlLabel value="30+" control={<Radio />} label="Peste 30 kg" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  id='descriere-animal'
                  label="Descriere"
                  multiline
                  rows={4} // Ajustăm numărul de rânduri după necesitate
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <DropzoneArea
                  dropzoneClass='dropzone'
                  acceptedFiles={['image/*']}
                  maxFileSize={5000000}//5MB
                  filesLimit={15}
                  showPreviews={true}
                  showPreviewsInDropzone={false}
                  showFileNamesInPreview={true}
                  dropzoneText="Trage pozele aici sau apasă pentru a le încărca"
                  onChange={handlePhotoChange}
                />
                <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
                  <Grid item>
                    <Button variant="contained" onClick={handleSubmit} size="medium" sx={{ borderRadius: 10 }}>
                      Salvează
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
    </Container>

  );
};
export default AddForm;