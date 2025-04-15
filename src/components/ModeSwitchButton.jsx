import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { ThreeDRotation, Layers } from '@mui/icons-material';

const ModeSwitchButton = ({ on2DClick, on3DClick }) => {
  return (
    <ButtonGroup variant="contained" color="primary"  style={{
      position: "absolute",
      zIndex: 1000,
      right: "20px"
    }}>
      <Button startIcon={<Layers />} onClick={on2DClick}>
        2D
      </Button>
      <Button startIcon={<ThreeDRotation />} onClick={on3DClick}>
        3D
      </Button>
    </ButtonGroup>
  );
};

export default ModeSwitchButton;
