import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';

const ModeSwitchButton = ({ on2DClick, on3DClick }) => {
  return (
    <ButtonGroup variant="contained" color="primary" style={{
      position: "absolute",
      zIndex: 1000,
      right: "0px"
    }}>
      <Button startIcon={<MapIcon />} onClick={on2DClick}>
        2D
      </Button>
      <Button startIcon={<ViewInArOutlinedIcon />} onClick={on3DClick}>
        3D
      </Button>
    </ButtonGroup>
  );
};

export default ModeSwitchButton;
