// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../componente/pagini/LoginPage';
import { WebSocketProvider } from '../componente/WebSocketContext';
import { CssBaseline } from '@mui/material';
import WebSocketRoutes from './WebSocketRoutes';
import { DialogProvider } from './DialogContext';

function App() {
  return (
    <>
      <Router>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/*" element={<DialogProvider >
            <WebSocketProvider>
              <WebSocketRoutes />
            </WebSocketProvider>
          </DialogProvider >} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
