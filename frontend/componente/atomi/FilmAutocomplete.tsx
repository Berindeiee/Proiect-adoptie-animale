
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

// Acesta este un exemplu de array. Înlocuiți cu datele reale.
const top100Films = [
  { label: 'Câine' },
  { label: 'Pisică' },
  { label: 'Iepure' },
  { label: 'Hamster' },
  { label: 'Papagal' },
  { label: 'Pește' },
  { label: 'Șarpe' },
  { label: 'Broască Țestoasă' },
  { label: 'Broască' },
  { label: 'Porcușor de Guineea' },
  { label: 'Lemur' },
  { label: 'Cangur' },
  { label: 'Capră' },
  { label: 'Cal' },
  { label: 'Ponei' },
  { label: 'Veveriță' },
  { label: 'Leopard' },
  { label: 'Urs' },
  { label: 'Elefant' },
  { label: 'Girafă' },
  { label: 'Zebra' },
  { label: 'Rinocer' },
  { label: 'Leu' },
  { label: 'Tigru' },
  { label: 'Cocor' },
  { label: 'Flamingo' },
  { label: 'Vacă' },
  {label: 'Pinuin'},
];

const FilmAutocomplete = ({ onChange }) => {

  return (
    <Autocomplete
      onChange={onChange}
      multiple
      fullWidth
      id="tags-filled"
      options={top100Films.map((option) => option.label)}
      //defaultValue={[top100Films[1].title]}
      freeSolo
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="Search and filter"
          placeholder="Search and filter"
          InputLabelProps={{ contentEditable: false }}
        />
      )}
    />
  );
};

export default FilmAutocomplete;
