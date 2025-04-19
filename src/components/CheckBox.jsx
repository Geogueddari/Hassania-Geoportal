import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function ControlledCheckbox() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((_) => !_);
  };

  return (
    <Checkbox
      checked={checked}
      onClick={handleChange}
      sx={{ height: "30px" , padding:"0px"}}
    />
  );
}