import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { keyframes } from '@mui/system';
import Box from '@mui/material/Box';
 
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;
 
const StyledResetButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(to right, #1565c0, #0d47a1)',
  color: 'white',
  borderRadius: '30px',
  padding: '10px 20px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  width: '100%',
  maxWidth: '240px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  zIndex: 1000,
 
  '&:hover': {
    background: 'linear-gradient(to right, #0d47a1, #1565c0)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
 
  '&:active': {
    transform: 'translateY(1px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
 
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    fontSize: '18px',
  },
 
  '&:hover .MuiSvgIcon-root': {
    animation: `${pulse} 0.8s ease infinite`,
  },
}));
 
export default function ResetButton({ margin }) {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      ...margin,
      zIndex:3000,
      marginTop:"8px"
    }}>
      <StyledResetButton
        variant="contained"
        startIcon={<FilterAltOffIcon />}
        disableElevation
      >
        Réinitialiser les filtres
      </StyledResetButton>
    </Box>
  );
}
 