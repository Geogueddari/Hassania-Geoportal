import * as React from 'react';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Box from '@mui/material/Box';



export default function ResetButton() {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
    }}>
       <FilterAltOffIcon />
    </Box>
  );
}
