import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl variant="outlined" style={{ minWidth: 120 }}>
      <InputLabel id="language-switcher-label">Language</InputLabel>
      <Select
        labelId="language-switcher-label"
        id="language-switcher"
        value={i18n.language}
        onChange={handleChange}
        label="Language"
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="de">Deutsch</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="ri">Romanian</MenuItem>
        {/* Adăugați aici alte opțiuni de limbă */}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
