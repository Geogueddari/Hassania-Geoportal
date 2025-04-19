import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function ControlledCheckbox() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked((_) => !_);
  };

  return (
    <Checkbox
      checked={checked }
      onClick={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
      sx={{height:"30px"}}
    />
  );
}