import React, { useState } from 'react';
import { Box, Popover, Typography } from '@mui/material';

import RoadMap from "../assets/RoadMap.png"
import Terrain from "../assets/Terrain.png"
import Satellite from "../assets/Satellite.png"
import OSM from "../assets/osm.png"
import Hybrid from "../assets/Hybrid.png"

const basemaps = [
  { id: 'osm', backgroundImage: OSM},
  { id: 'Terrain', backgroundImage: Terrain },
  { id: 'Satellite', backgroundImage: Satellite },
  { id: 'RoadMap', backgroundImage: RoadMap },
  { id: 'Hybrid', backgroundImage: Hybrid },
];

const BasemapSwitcher = ({onBaseMapChange , selectedBasemap}) => {
  const currentMap = basemaps.find(map => map.id === selectedBasemap);
  console.log(currentMap)
  const [anchorEl, setAnchorEl] = useState(null);
  const [baseMap , setBaseMap] = useState(currentMap.backgroundImage)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (id) => {
    onBaseMapChange(id);

    basemaps.forEach(map =>{
        if(map.id === id){
          setBaseMap(map.backgroundImage)
        }
    })
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          width: 90,
          height: 90,
          p:1,
          border: '3px solid rgb(144, 202, 249)',
          borderRadius: 1,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: "absolute",
          margin: "5px",
          bottom: "0px",
          zIndex: 800,
          backgroundImage: `url(${baseMap})`,
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
        <Box sx={{ display: 'flex', gap: 1 , p: 1 ,backgroundColor: "rgb(144, 202, 249)"}}>
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
                transition: 'transform 0.2s linear, border 0.2s linear' ,
                '&:hover': {
                  transform: 'scale(1.1)',
                  border: '3px solid rgb(144, 202, 249)',
                  boxShadow: '5px 10px 20px rgba(0, 0, 0, 0.2)',
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
