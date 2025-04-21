import React, { useState, useEffect } from 'react';
import { Box, Popover, Typography, Fade, Paper, Tooltip } from '@mui/material';
import { LayersOutlined, Check } from '@mui/icons-material';
import RoadMap from "../assets/RoadMap.png";
import Terrain from "../assets/Terrain.png";
import Satellite from "../assets/Satellite.png";
import OSM from "../assets/osm.png";
import Hybrid from "../assets/Hybrid.png";

// Configuration des fonds de carte avec descriptions
const basemaps = [
  { 
    id: 'osm', 
    backgroundImage: OSM,
    description: "OpenStreetMap - Carte collaborative libre"
  },
  { 
    id: 'Terrain', 
    backgroundImage: Terrain,
    description: "Relief et topographie"
  },
  { 
    id: 'Satellite', 
    backgroundImage: Satellite,
    description: "Imagerie satellitaire"
  },
  { 
    id: 'RoadMap', 
    backgroundImage: RoadMap,
    description: "Carte routière standard"
  },
  { 
    id: 'Hybrid', 
    backgroundImage: Hybrid,
    description: "Satellite avec étiquettes"
  },
];

const BasemapSwitcher = ({ onBaseMapChange, selectedBasemap }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [baseMap, setBaseMap] = useState(null);
  const [hoveredMap, setHoveredMap] = useState(null);
  
  // Trouver la carte actuelle à l'initialisation et quand selectedBasemap change
  useEffect(() => {
    const currentMap = basemaps.find(map => map.id === selectedBasemap);
    if (currentMap) {
      setBaseMap(currentMap.backgroundImage);
    }
  }, [selectedBasemap]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoveredMap(null);
  };

  const handleSelect = (id) => {
    onBaseMapChange(id);
    const selectedMap = basemaps.find(map => map.id === id);
    if (selectedMap) {
      setBaseMap(selectedMap.backgroundImage);
    }
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Paper
        elevation={3}
        onClick={handleClick}
        sx={{
          width: 90,
          height: 90,
          border: (theme) => `2px solid ${theme.palette.primary.main}`,
          borderRadius: '8px',
          cursor: 'pointer',
          position: "absolute",
          margin: "8px",
          bottom: "0px",
          left: "0px",
          zIndex: 800,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: (theme) => theme.palette.mode === 'dark' 
              ? '0 8px 16px rgba(0, 0, 0, 0.5)' 
              : '0 8px 16px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        {/* Aperçu du fond de carte actuel */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${baseMap})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* Étiquette du fond de carte avec effet de transparence adapté au thème */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              width: "100%",
              padding: "4px 0",
              backgroundColor: (theme) => 
                theme.palette.mode === 'dark' 
                  ? 'rgba(0, 0, 0, 0.7)'
                  : 'rgba(255, 255, 255, 0.8)',
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LayersOutlined 
              fontSize="small" 
              sx={{ 
                mr: 0.5, 
                color: (theme) => theme.palette.primary.main,
                fontSize: '14px'
              }} 
            />
            <Typography 
              variant="caption"
              sx={{
                fontWeight: 600,
                color: (theme) => theme.palette.text.primary,
                textAlign: "center",
                fontSize: '11px'
              }}
            >
              {selectedBasemap}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        TransitionComponent={Fade}
        transitionDuration={250}
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
          }
        }}
      >
        <Paper
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1.5,
            p: 2,
            backgroundColor: (theme) => theme.palette.background.paper,
            width: 'fit-content',
            maxWidth: '350px',
          }}
        >
          {basemaps.map((b) => (
            <Tooltip 
              key={b.id}
              title={b.description}
              placement="top"
              arrow
            >
              <Box
                onClick={() => handleSelect(b.id)}
                onMouseEnter={() => setHoveredMap(b.id)}
                onMouseLeave={() => setHoveredMap(null)}
                sx={{
                  width: 90,
                  height: 90,
                  backgroundImage: `url(${b.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: (theme) => 
                    b.id === selectedBasemap 
                      ? `3px solid ${theme.palette.primary.main}`
                      : `2px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  overflow: 'hidden',
                  boxShadow: (theme) => 
                    b.id === selectedBasemap 
                      ? `0 0 0 2px ${theme.palette.primary.main}, 0 8px 16px rgba(0, 0, 0, 0.15)`
                      : 'none',
                  filter: (theme) => 
                    theme.palette.mode === 'dark' && b.id !== hoveredMap && b.id !== selectedBasemap 
                      ? 'brightness(0.8)'
                      : 'none',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    zIndex: 1,
                    boxShadow: (theme) => `0 8px 16px ${
                      theme.palette.mode === 'dark' 
                        ? 'rgba(0, 0, 0, 0.5)' 
                        : 'rgba(0, 0, 0, 0.2)'
                    }`,
                    filter: 'brightness(1.1)',
                  },
                }}
              >
                {/* Indicateur de sélection */}
                {b.id === selectedBasemap && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: (theme) => theme.palette.primary.main,
                      borderRadius: '50%',
                      width: 22,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      zIndex: 2,
                    }}
                  >
                    <Check sx={{ color: '#fff', fontSize: 16 }} />
                  </Box>
                )}

                {/* Étiquette du fond de carte */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    padding: "4px 0",
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'rgba(0, 0, 0, 0.75)'
                        : 'rgba(255, 255, 255, 0.85)',
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: (theme) => theme.palette.text.primary,
                      textAlign: "center",
                      fontWeight: 'medium',
                      fontSize: '11px',
                    }}
                  >
                    {b.id}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          ))}
        </Paper>
      </Popover>
    </>
  );
};

export default BasemapSwitcher;