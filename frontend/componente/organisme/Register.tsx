import React from 'react';
import { TextField, Button, Container } from '@mui/material';

const Register: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <h1>Înregistrare</h1>
      <form noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Parolă"
          type="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Înregistrează-te
        </Button>
      </form>
    </Container>
  );
};

export default Register;
