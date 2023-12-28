// DialogContext.tsx
import React, { createContext, useState, useContext } from 'react';
import SimpleDialog from '../componente/atomi/simpleDialog';

interface IDialogContext {
    showDialog: (text: string) => void;
}

const DialogContext = createContext<IDialogContext>({
    showDialog: () => {}
});

export const useDialog = () => useContext(DialogContext);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogText, setDialogText] = useState('');

    const showDialog = (text: string) => {
        setDialogText(text);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {children}
            <SimpleDialog open={dialogOpen} text={dialogText} onClose={handleClose} />
        </DialogContext.Provider>
    );
};
