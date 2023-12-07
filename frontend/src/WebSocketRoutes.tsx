// WebSocketRoutes.js
import { Routes, Route } from 'react-router-dom';
import IntroPage from '../componente/pagini/IntroPage';
import NewsPage from '../componente/pagini/NewsPage';

const WebSocketRoutes = () => {
    return (
        <Routes>
            <Route path="/home-page" element={<IntroPage />} />
            <Route path="/home" element={<IntroPage />} />
            <Route path="/add" element={<NewsPage />} />
        </Routes>
    );
};

export default WebSocketRoutes;
