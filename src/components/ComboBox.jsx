import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function ComboBox({ selectedProjection, onChange }) {
  return (
    <FormControl
      sx={{
        width: 250,
        backgroundColor: "white",
        position: "absolute",
        bottom: "-40px",
        zIndex: 1000,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        borderRadius: "8px",
        padding: "5px",
        height: "40px",
      }}
    >
      <Select
        labelId="projection-label"
        value={selectedProjection}
        label="Système de Coordonnées"
        onChange={(e) => onChange(e.target.value)}
        sx={{height: "30px",fontSize:12}}
      >
        <MenuItem value="EPSG:4326" sx={{height: "30px",width: 250,fontSize:12}}>WGS 84 (EPSG:4326) </MenuItem>
        <MenuItem value="EPSG:26191" sx={{height: "30px",width: 250,fontSize:12}}>Merchich Nord Maroc (EPSG:26191) </MenuItem>

      </Select>
    </FormControl>
  );
}
