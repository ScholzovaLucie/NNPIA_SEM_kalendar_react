import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ControllableStates({ options, label, setValueGlobal }) {
  return (
    <Autocomplete
    disablePortal
    id="combo-box-demo"
    options={options}
    getOptionLabel={(option) => option.name} 
    renderInput={(params) => <TextField {...params} label={label} />}
    onChange={(event, value) => setValueGlobal(value)}
    sx={{ width: 300 }}
  />
  );
}