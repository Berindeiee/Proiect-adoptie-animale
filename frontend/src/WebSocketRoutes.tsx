// WebSocketRoutes.js
import { Routes, Route } from 'react-router-dom';
import IntroPage from '../componente/pagini/IntroPage';


const WebSocketRoutes = () => {
    return (
        <Routes>
            <Route path="/home-page" element={<IntroPage />} />
            <Route path="/home" element={<IntroPage />} />
            {/* Adaugă alte rute aici după necesitate */}
        </Routes>
    );
};

export default WebSocketRoutes;
