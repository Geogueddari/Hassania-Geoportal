import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';


import ResetFilterButton from "./ResetFilterButton.jsx"

export default function CustomizedInputBase(props) {

  return (
    <Paper
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 34,
        width: 285,
        backgroundColor:
          props.demoTheme.defaultColorScheme === 'light'
            ? '#f5f5f5'
            : 'rgb(18, 18, 18)',
        marginTop: "5px"
      }}
    >
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <ResetFilterButton />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, color: props.demoTheme.palette.text.primary }}
        placeholder="Search Places"
        inputProps={{ 'aria-label': 'search places' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );
}



