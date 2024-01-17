// WebSocketRoutes.js
import { Routes, Route } from 'react-router-dom';
import IntroPage from '../componente/pagini/IntroPage';
import NewsPage from '../componente/pagini/NewsPage';
import Postarile_mele from '../componente/pagini/Postarile_mele_page';

const WebSocketRoutes = () => {
    return (
        <Routes>
            <Route path="/intro-page" element={<IntroPage />} />
            <Route path="/home" element={<IntroPage />} />
            <Route path="/Postarile_mele" element={<Postarile_mele />} />
            <Route path="/add" element={<NewsPage />} />
        </Routes>
    );
};

export default WebSocketRoutes;
