import React, { useState } from 'react';
import { Button, Box, Paper } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';

const ModeSwitchButton = ({ on2DClick, on3DClick }) => {
  const [activeMode, setActiveMode] = useState('2D');

  const handle2DClick = () => {
    setActiveMode('2D');
    if (on2DClick) on2DClick();
  };

  const handle3DClick = () => {
    setActiveMode('3D');
    if (on3DClick) on3DClick();
  };

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        top: 10, // Above the full screen button
        right: 10,
        zIndex: 1000,
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Button
          onClick={handle2DClick}
          sx={{
            height: '35px',
            minWidth: '40px',
            px: 1,
            bgcolor: activeMode === '2D' ? '#2196f3' : '#ffffff',
            color: activeMode === '2D' ? 'white' : '#555555',
            '&:hover': {
              bgcolor: activeMode === '2D' ? '#1976d2' : '#f0f0f0',
            },
            borderRight: '1px solid rgba(0,0,0,0.08)',
            transition: 'all 0.2s ease',
            borderRadius: 0,
          }}
        >
          <MapIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
          2D
        </Button>
        <Button
          onClick={handle3DClick}
          sx={{
            height: '35px',
            minWidth: '40px',
            px: 1,
            bgcolor: activeMode === '3D' ? '#2196f3' : '#ffffff',
            color: activeMode === '3D' ? 'white' : '#555555',
            '&:hover': {
              bgcolor: activeMode === '3D' ? '#1976d2' : '#f0f0f0',
            },
            transition: 'all 0.2s ease',
            borderRadius: 0,
          }}
        >
          <ViewInArOutlinedIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
          3D
        </Button>
      </Box>
    </Paper>
  );
};

export default ModeSwitchButton;