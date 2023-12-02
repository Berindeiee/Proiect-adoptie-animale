import React, { useState } from 'react';
import NavBar from '../organisme/NavBar';
import AddForm from '../organisme/AddForm.tsx';

import './Css/news.css';

const NewsPage: React.FC = () => {
    const [showForm, setShowForm] = useState(false); // State pentru a controla afișarea formularului

    const handleAddButtonClick = () => {
        setShowForm(true); // Setează showForm la true pentru a afișa formularul
    };

    return (
        <>
            {/* <div className='background'> */}
            <NavBar></NavBar>

            <button className="add-button" onClick={handleAddButtonClick}>Adaugă anunț</button>

            {showForm && <AddForm />}

            <div className="box">
                <div className="title">Cățel</div>
                <div className='description'>Descriere</div>
                <div className="city">Timisoara</div>
                <img className="image" src="image" />
                <button className="button">Adoptă</button>
            </div>
            {/* </div> */}
        </>
    );
}

export default NewsPage;