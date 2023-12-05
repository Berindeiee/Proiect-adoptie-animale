import React from 'react';
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
  Typography
} from '@mui/material';
import Dog from './dog';
import TextTitlu from '../atomi/textTitlu';


const AddForm = () => {
  // Adaugă aici logica de manipulare a formularului, dacă este necesar

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 , background: '#C7FFED', borderRadius: '10px'}}>
      <Grid container spacing={2} sx={{ maxWidth: 900 }}>
        <Grid item xs={12} md={4} sx={{ bgcolor: '#DBF227', color: 'white', textAlign: 'center', p: 4, borderRadius:'10px'}}>
          <TextTitlu />
          <Dog/>
        </Grid>
        <Grid item xs={12} md={8} sx={{ p: 2 }}>
          <Card raised sx={{ bgcolor: '#D6D58E' }}>
            <CardContent>
              <form noValidate autoComplete="off">
                <TextField fullWidth label="Pet's Name" margin="normal" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Pet's Breed" margin="normal" variant="outlined" sx={{ mb: 2 }} />
                <TextField fullWidth label="Birthday" margin="normal" variant="outlined" sx={{ mb: 2 }} />
                
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup row aria-label="gender" name="gender1">
                    <FormControlLabel value="female" control={<Radio />} label="Female" sx={{ mr: 2 }} />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                  </RadioGroup>
                </FormControl>
                
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Spayed or Neutered</FormLabel>
                  <RadioGroup row aria-label="spayed-neutered" name="spayedNeutered">
                    <FormControlLabel value="spayed" control={<Radio />} label="Spayed" sx={{ mr: 2 }} />
                    <FormControlLabel value="neutered" control={<Radio />} label="Neutered" />
                  </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Weight</FormLabel>
                  <RadioGroup row aria-label="weight" name="weight">
                    <FormControlLabel value="0-25" control={<Radio />} label="0-25 lbs" sx={{ mr: 2 }} />
                    <FormControlLabel value="25-50" control={<Radio />} label="25-50 lbs" sx={{ mr: 2 }} />
                    <FormControlLabel value="50-100" control={<Radio />} label="50-100 lbs" sx={{ mr: 2 }} />
                    <FormControlLabel value="100+" control={<Radio />} label="100+ lbs" />
                  </RadioGroup>
                </FormControl>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Button variant="outlined" sx={{ width: '100%' }}>
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="contained" color="primary" sx={{ width: '100%' }}>
                      Next
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
