import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from '../componente/pagini/IntroPage'; // Ensure this path is correct
import { CssBaseline } from '@mui/material';
import LoginPage from '../componente/pagini/LoginPage';

function App() {
  return (
    <>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/login-register" element={<LoginPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
