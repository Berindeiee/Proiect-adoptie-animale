// SimpleDialog.tsx
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

interface SimpleDialogProps {
    open: boolean;
    text: string;
    onClose: () => void;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({ open, text="Sesiunea a expirat. Vă rugăm să vă logați din nou.", onClose }) => {
    const navigate = useNavigate();
    const handleOkClick = () => {
        onClose(); // Închide dialogul
        navigate('/'); // Navighează către pagina principală
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <DialogContentText>{text}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOkClick}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SimpleDialog;
