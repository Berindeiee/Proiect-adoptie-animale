import React from 'react';
import NavBar from '../organisme/NavBar';
import AddForm from '../organisme/AddForm.tsx';
import { Box } from '@mui/material';
import './Css/news.css';

const NewsPage: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <NavBar onFilterChange={undefined} />
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <AddForm />
            </Box>
        </Box>
    );
}

export default NewsPage;