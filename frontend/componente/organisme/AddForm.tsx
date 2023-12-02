import React from 'react';
import { TextField, Button, Input, TextareaAutosize } from '@mui/material';

import '../pagini/Css/add-form.css'

const AddForm: React.FC = () => {

    const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    return (
        <div className='ceva'>
            <h1>Adaugă un anunț</h1>
            <form noValidate>
                <TextField className='field'
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Categorie"
                    name="categorie"
                    autoComplete="categorie"
                    autoFocus
                />
                <TextareaAutosize className='desc'
                    aria-label="sescriere" 
                    placeholder="Descriere" 
                    required
                />

                <TextField className='field'
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Oraș"
                    name="oraș"
                    autoComplete="oraș"
                    autoFocus
                />
                <label className='label-class'> Imagine: </label>
                <Input
                    id="file-upload"
                    type="file"
                    inputProps={{ accept: 'image/*' }}
                    onChange={handleImageChange}
                    className="hidden"
                />
                {selectedImage && (
                    <div className="image-preview-container">
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="image-preview"
                        />
                    </div>
                )}

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                    Adaugă
                </Button>
            </form>
        </div>
    );
}

export default AddForm;