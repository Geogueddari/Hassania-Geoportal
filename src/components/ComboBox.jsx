import React, { useState } from 'react';
import { FormControl, Select, MenuItem, Typography, Box, Fade } from '@mui/material';
import { ExpandMore, Public, Map } from '@mui/icons-material';

export default function ComboBox({ selectedProjection, onChange }) {
  const [open, setOpen] = useState(false);
  
  // Options avec plus d'informations et icônes
  const projections = [
    { 
      value: "EPSG:4326", 
      name: "WGS 84", 
      code: "EPSG:4326",
      description: "Système de coordonnées standard mondial",
      icon: <Public />
    },
    { 
      value: "EPSG:26191", 
      name: "Merchich Nord Maroc", 
      code: "EPSG:26191",
      description: "Projection locale pour le Maroc",
      icon: <Map />
    }
  ];

  return (
    <FormControl
      sx={{
        width: 320,
        position: "absolute",
        bottom: "-50px",
        zIndex: 1000,
        transition: "all 0.3s ease",
        transform: open ? "translateY(-8px)" : "translateY(0)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: open 
            ? "0 10px 25px rgba(0,0,0,0.2)" 
            : "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        <Select
          labelId="projection-label"
          value={selectedProjection}
          onChange={(e) => onChange(e.target.value)}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          IconComponent={ExpandMore}
          sx={{
            height: "50px",
            width: "100%",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
            },
            "& .MuiSvgIcon-root": {
              color: "#1976d2",
              transition: "transform 0.3s ease",
              transform: open ? "rotate(180deg)" : "none",
              right: "10px",
            },
            "&:before, &:after": {
              display: "none"
            },
            "& fieldset": {
              border: "none",
            }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: "10px",
                marginTop: "8px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                "& .MuiMenuItem-root": {
                  transition: "all 0.2s ease",
                }
              }
            },
            TransitionComponent: Fade
          }}
          renderValue={(selected) => {
            const projection = projections.find(p => p.value === selected);
            return (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box 
                  sx={{ 
                    color: "#1976d2", 
                    display: "flex", 
                    marginRight: 2,
                    animation: open ? "pulse 1.5s infinite" : "none",
                    "@keyframes pulse": {
                      "0%": { opacity: 0.7 },
                      "50%": { opacity: 1 },
                      "100%": { opacity: 0.7 }
                    }
                  }}
                >
                  {projection?.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {projection?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666", fontSize: 11 }}>
                    {projection?.code}
                  </Typography>
                </Box>
              </Box>
            );
          }}
        >
          {projections.map((projection) => (
            <MenuItem 
              key={projection.value} 
              value={projection.value}
              sx={{
                padding: "12px 16px",
                borderLeft: "3px solid transparent",
                display: "block",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  borderLeft: "3px solid #1976d2",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(25, 118, 210, 0.12)",
                  borderLeft: "3px solid #1976d2",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.16)",
                  }
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ color: "#1976d2", display: "flex", marginRight: 2 }}>
                  {projection.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {projection.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666", fontSize: 11 }}>
                    {projection.code}
                  </Typography>
                  <Typography variant="caption" sx={{ display: "block", fontSize: 10, marginTop: 0.5 }}>
                    {projection.description}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </Box>
    </FormControl>
  );
}