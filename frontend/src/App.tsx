import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from '../componente/pagini/IntroPage'; // Ensure this path is correct
import { CssBaseline } from '@mui/material';
import LoginPage from '../componente/pagini/LoginPage';
import { WebSocketProvider } from '../componente/WebSocketContext';

function App() {
  return (
    <>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/home-page" element={<WebSocketProvider><IntroPage /></WebSocketProvider>} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
