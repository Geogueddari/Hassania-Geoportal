import React, { useState } from 'react';
import { Box, Popover, Typography } from '@mui/material';

import RoadMap from "../assets/RoadMap.png"
import Terrain from "../assets/Terrain.jpeg"
import Satellite from "../assets/Satellite.jpeg"
import OSM from "../assets/osm.jpg"

const basemaps = [
  { id: 'osm', backgroundImage: OSM},
  { id: 'Terrain', backgroundImage: Terrain },
  { id: 'Satellite', backgroundImage: Satellite },
  { id: 'Terrain', backgroundImage: RoadMap },
  { id: 'Hybrid', backgroundImage: Satellite },
];

const BasemapSwitcher = ({onMapChange , selectedBasemap}) => {
  const [anchorEl, setAnchorEl] = useState(null);
    const [fond , setFond] = useState(OSM)
  //const current = basemaps.find((b) => b.id === selectedBasemap);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (id) => {
    onMapChange(id);
    handleClose();

    basemaps.forEach(map =>{
        if(map.id === id){
            setFond(map.backgroundImage)
        }
    })
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          width: 85,
          height: 85,
          padding: "5px",
          border: '3px solid white',
          borderRadius: 1,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: "absolute",
          margin: "10px",
          bottom: "0px",
          zIndex: 1000,
          backgroundImage: `url(${fond})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant="caption"  sx={{
                    color: "black",
                    position: "absolute",
                    top: "0px",
                    backgroundColor: "white",
                    width: "100%",
                    opacity: "0.8",
                    textAlign: "center"
              }}>
                {selectedBasemap}
              </Typography>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        sx={{
            ml:1
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          {basemaps.map((b) => (
            <Box
              key={b.id}
              onClick={() => handleSelect(b.id)}
              sx={{
                width: 85,
                height: 85,
                backgroundImage: `url(${b.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '3px solid white',
                borderRadius: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'transform 0.2s, border 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  border: '5px solid #1976d2', // ou une autre couleur d’accent
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                },
                overflowY: "hidden"
              }}
              
            >
              <Typography variant="caption"  sx={{
                    color: "black",
                    position: "absolute",
                    top: "0px",
                    backgroundColor: "white",
                    width: "100%",
                    opacity: "0.8",
                    textAlign: "center"
              }}>
                {b.id}
              </Typography>
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default BasemapSwitcher;
