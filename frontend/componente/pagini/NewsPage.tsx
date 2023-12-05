import React, { useState } from 'react';
import NavBar from '../organisme/NavBar';
import AddForm from '../organisme/AddForm.tsx';
import { Box } from '@mui/material';
import './Css/news.css';

const NewsPage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <NavBar />
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <AddForm />
            </Box>
        </Box>
    );
}

export default NewsPage;