import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from '../componente/pagini/IntroPage'; // Ensure this path is correct
import { CssBaseline } from '@mui/material';

function App() {
  console.log("Hello, world!");

  return (
    <>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<IntroPage />} />
      
        </Routes>
      </Router>
    </>
  );
}

export default App;
