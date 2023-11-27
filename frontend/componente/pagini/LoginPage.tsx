import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './Css/styles.css';
import { AlertColor } from '@mui/material/Alert';

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ fullName: '', phoneNumber: '', email: '', password: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [usernameAvailability, setUsernameAvailability] = useState<boolean | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Verificarea disponibilității numelui
  const checkUsernameAvailability = (username: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'CHECK_USERNAME', data: username }));
    }
  };
  


  const connectWebSocket = () => {
    // Verifică dacă există deja o conexiune deschisă sau în curs de deschidere
    if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
      const socket = new WebSocket('ws://localhost:3000');

      socket.onopen = () => {
        console.log('WebSocket Connected');
        // Alte acțiuni necesare când conexiunea este deschisă
      };

      socket.onclose = () => {
        console.log('WebSocket Disconnected. Attempting to reconnect...');
        setTimeout(connectWebSocket, 5000); // Încercare de reconectare după 3 secunde
      };

      socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Mesaj primit de la server:', response);
        switch (response.type) {
          case 'REGISTRATION_SUCCESS':
            // Tratează succesul înregistrării
            setFormData({ fullName: '', phoneNumber: '', email: '', password: '' }); // Resetare formular
            console.log('reset');
            setSnackbarMessage('Înregistrare realizată cu succes!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            break;
          case 'REGISTRATION_ERROR':
            // Tratează eroarea de înregistrare
            setSnackbarMessage(response.data); // Afișează mesajul de eroare primit
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            break;
          case 'USERNAME_AVAILABILITY':
            setUsernameAvailability(response.isAvailable);
            break;
          case 'UNKNOWN_MESSAGE_TYPE':
            setSnackbarMessage('Tip de mesaj necunoscut primit de la server');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            break;

        }
      };

      setWs(socket);
    } else {
      console.log('O conexiune WebSocket este deja deschisă sau în curs de deschidere');
    }
  };


  useEffect(() => {
    connectWebSocket();
    return () => {
      ws?.close();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'fullName') {
      if (value.length >= 3) {{
        if (timer) {
          clearTimeout(timer);
        }
        // Setează un nou temporizator pentru a evita verificarea numelui de utilizator la fiecare tastare
        const newTimer = setTimeout(() => {
          checkUsernameAvailability(value);
        }, 700);
        setTimer(newTimer);
      }} else {
        setUsernameAvailability(false);
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setSnackbarMessage('Numele complet este necesar');
      setSnackbarOpen(true);
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setSnackbarMessage('Numarul de telefon este necesar');
      setSnackbarOpen(true);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setSnackbarMessage('Adresa de email nu este validă');
      setSnackbarOpen(true);
      return false;
    }

    if (formData.password.length < 6) {
      setSnackbarMessage('Parola trebuie să aibă cel puțin 6 caractere');
      setSnackbarOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'REGISTER_USER', data: formData }));
        console.log('Formul trimis', formData);
      } else {
        console.log('WebSocket not connected. Message not sent.');
        setSnackbarMessage('Serverul nu reaspunde. Încearcă mai târziu.');
        setSnackbarOpen(true);
        return false;
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3"><span>Log In </span><span>Sign Up</span></h6>
                <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" defaultChecked />
                <label htmlFor="reg-log"></label>
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    {/* Log In Form */}
                    <div className="card-front">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Log In</h4>
                          <div className="form-group">
                            <input type="email" className="form-style" placeholder="Email" />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input type="password" className="form-style" placeholder="Password" />
                            <i className="input-icon uil uil-lock-alt"></i>
                          </div>
                          <a href="https://www.web-leb.com/code" className="btn mt-4">Login</a>
                          <p className="mb-0 mt-4 text-center">
                            <a href="https://www.web-leb.com/code" className="link">Forgot your password?</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sign Up Form */}
                    <div className="card-back">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-3 pb-3">Sign Up</h4>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-style"
                              placeholder="Full Name"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                            />
                            <i className="input-icon uil uil-user"></i>
                            {usernameAvailability !== null && (
                              <i className={`input-icon-name ${usernameAvailability ? "uil-check" : "uil-times"}`}></i>
                            )}
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="tel"
                              className="form-style"
                              placeholder="Phone Number"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                            />
                            <i className="input-icon uil uil-phone"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type="email"
                              className="form-style"
                              placeholder="Email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-style password-input" // Adaugă clasa nouă aici
                              placeholder="Password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                            <i
                              onClick={toggleShowPassword}
                              className={`show-password-icon ${showPassword ? "uil-eye-slash" : "uil-eye"}`}
                            ></i>

                          </div>
                          <button onClick={handleSubmit} className="btn mt-4">Register</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default LoginPage;
