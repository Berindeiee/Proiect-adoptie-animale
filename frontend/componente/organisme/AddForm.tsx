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
  Autocomplete
} from '@mui/material';
import Dog from './dog';
import '../pagini/Css/add-form.css'
import { DropzoneArea } from 'material-ui-dropzone';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextTitlu from '../atomi/textTitlu';
import { useState } from 'react';

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
];


const AddForm = () => {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, background: '#C7FFED', borderRadius: '10px' }}>
      <Grid container spacing={2} sx={{ maxWidth: 900 }}>
        <Grid item xs={12} md={4} sx={{ bgcolor: '#DBF227', color: 'white', textAlign: 'center', p: 4, borderRadius: '10px' }}>
          <TextTitlu />
          <Dog />
        </Grid>
        <Grid item xs={12} md={8} sx={{ p: 2 }}>
          <Card raised sx={{ bgcolor: '#D6D58E' }}>
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField fullWidth label="Numele Animalului" margin="normal" variant="outlined" sx={{ mb: 2 }} />
                <Autocomplete
                  disablePortal
                  id="combo-box-animale"
                  options={tipuriAnimale}
                  renderInput={(params) => <TextField {...params} label="Tip de Animal" />}
                />
                <TextField fullWidth label="Rasa Animalului" margin="normal" variant="outlined" sx={{ mb: 2 }} />
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DatePicker label="Basic date picker" sx={{ width: '100%', marginBottom: '15px' }} />
                </LocalizationProvider>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Gen</FormLabel>
                  <RadioGroup row aria-label="gender" name="gender1">
                    <FormControlLabel value="female" control={<Radio />} label="Femelă" sx={{ mr: 2 }} />
                    <FormControlLabel value="male" control={<Radio />} label="Mascul" />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Greutate</FormLabel>
                  <RadioGroup row aria-label="weight" name="weight">
                    <FormControlLabel value="0-5" control={<Radio />} label="0-5 kg" sx={{ mr: 2 }} />
                    <FormControlLabel value="5-10" control={<Radio />} label="5-10 kg" sx={{ mr: 2 }} />
                    <FormControlLabel value="10-20" control={<Radio />} label="10-20 kg" sx={{ mr: 2 }} />
                    <FormControlLabel value="20-30" control={<Radio />} label="20-30 kg" sx={{ mr: 2 }} />
                    <FormControlLabel value="30+" control={<Radio />} label="Peste 30 kg" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  fullWidth
                  label="Descriere"
                  multiline
                  rows={4} // Ajustăm numărul de rânduri după necesitate
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <DropzoneArea
                  acceptedFiles={['image/*']}
                  maxFileSize={5000000}
                  filesLimit={15}
                  showPreviews={true}
                  showPreviewsInDropzone={false}
                  showFileNamesInPreview={true} 
                  dropzoneText="Trage pozele aici sau apasă pentru a le încărca"
                  onChange={(files) => console.log('Fotografii încărcate:', files)}
                />
                <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
                  <Grid item>
                    <Button variant="contained" color="primary">
                      Salvează
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>

  );
};
export default AddForm;
