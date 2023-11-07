
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

// Acesta este un exemplu de array. Înlocuiți cu datele reale.
const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  // ...alte filme
];

const FilmAutocomplete = () => {
  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={top100Films.map((option) => option.title)}
      defaultValue={[top100Films[1].title]}
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
            label="Filme"
            placeholder="Filme"
            InputLabelProps={{contentEditable: false}}
        />
      )}
    />
  );
};

export default FilmAutocomplete;
