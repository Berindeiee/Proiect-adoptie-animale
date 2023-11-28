import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './Css/styles.css';
import { AlertColor } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

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
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [usernameAvailability, setUsernameAvailability] = useState<boolean | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const navigate = useNavigate();


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };


  // Verificarea disponibilității numelui
  const checkUsernameAvailability = (username: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'CHECK_USERNAME', data: username }));
    }
  };



  let socket: WebSocket | undefined;

  const connectWebSocket = (): void => {
    if (!socket || socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
      socket = new WebSocket('ws://localhost:3000');
      socket.onopen = (): void => {
        console.log('WebSocket Connected');
      };

      socket.onclose = (): void => {
        console.log('WebSocket Disconnected. Attempting to reconnect...');
        setTimeout(connectWebSocket, 10000); // Increased reconnecting delay to 10 seconds
      };

      socket.onerror = (event): void => {
        console.log('WebSocket Error', event);
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
          case 'LOGIN_SUCCESS':

            localStorage.setItem('userData', JSON.stringify(response.data));
            setSnackbarMessage('Autentificare realizată cu succes!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // Redirecționează utilizatorul către pagina principală după 2 secunde
            setTimeout(() => {
              navigate('/');
            }, 2000); // 2000 de milisecunde reprezintă 2 secunde
            break;
          case 'LOGIN_ERROR':
            setSnackbarMessage(response.data);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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
      setTimeout(() => {
        ws?.close();
      }, 100);
    };
  }, []);


  const handleLoginEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(e.target.value);
  };

  const handleLoginPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(e.target.value);
  };

  const validateLogin = () => {
    if (!loginEmail || !/\S+@\S+\.\S+/.test(loginEmail)) {
      setSnackbarMessage('Format email incorect!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return false;
    }
    if (!loginPassword) {
      setSnackbarMessage('Câmmpul parolă este obligatoriu!');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'fullName') {
      if (value.length >= 3) {
        {
          if (timer) {
            clearTimeout(timer);
          }
          // Setează un nou temporizator pentru a evita verificarea numelui de utilizator la fiecare tastare
          const newTimer = setTimeout(() => {
            checkUsernameAvailability(value);
          }, 700);
          setTimer(newTimer);
        }
      } else {
        setUsernameAvailability(false);
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setSnackbarMessage('Numele complet este necesar');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setSnackbarMessage('Numarul de telefon este necesar');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setSnackbarMessage('Adresa de email nu este validă');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return false;
    }

    if (formData.password.length < 6) {
      setSnackbarMessage('Parola trebuie să aibă cel puțin 6 caractere');
      setSnackbarSeverity('warning');
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
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return false;
      }
    }
  };

  const handleLoginSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateLogin()) {
      return; // Oprirea funcției dacă validarea eșuează
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'LOGIN_USER', data: { email: loginEmail, password: loginPassword } }));
    } else {
      console.log('WebSocket not connected. Message not sent.');
      setSnackbarMessage('Serverul nu reaspunde. Încearcă mai târziu.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return false;
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
                            <input type="email"
                              className="form-style"
                              placeholder="Email"
                              value={loginEmail}
                              onChange={handleLoginEmailChange}
                            />
                            <i className="input-icon uil uil-at"></i>
                          </div>
                          <div className="form-group mt-2">
                            <input
                              type={showLoginPassword ? "text" : "password"}
                              className="form-style password-input"
                              placeholder="Password"
                              value={loginPassword}
                              onChange={handleLoginPasswordChange}
                            />
                            <i className="input-icon uil uil-lock-alt"></i>
                            <i
                              onClick={toggleLoginPasswordVisibility}
                              className={`show-password-icon ${showLoginPassword ? "uil-eye-slash" : "uil-eye"}`}
                            ></i>
                          </div>
                          <button onClick={handleLoginSubmit} className="btn mt-4">Login</button>
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
                              className="form-style name"
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
