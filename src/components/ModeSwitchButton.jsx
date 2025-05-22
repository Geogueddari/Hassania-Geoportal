import React, { useState, useEffect } from 'react';
import { Button, Box, Paper } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';

const MODES = {
  TWO_D: '2D',
  THREE_D: '3D'
};

const ANIMATION_CONFIG = {
  DURATION: 1.2,
  ZOOM_OUT_FACTOR: 2.0 // Facteur d'élévation pour l'animation
};

const ModeSwitchButton = ({ 
  ol3d, 
  is3DMode, 
  setIs3DMode, 
  olMap, 
  currentMode = MODES.TWO_D 
}) => {
  const [activeMode, setActiveMode] = useState(currentMode);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setActiveMode(currentMode);
  }, [currentMode]);

  // Animation simple : élévation puis retour à l'altitude d'origine, caméra perpendiculaire à la terre
  const animateTo3DMode = () => {
    try {
      const scene = ol3d.getCesiumScene();
      if (!scene?.camera) return;

      // Configuration des éléments de la scène
      if (scene.skyBox) scene.skyBox.show = true;
      if (scene.sun) scene.sun.show = true;
      if (scene.moon) scene.moon.show = true;
      if (scene.skyAtmosphere) scene.skyAtmosphere.show = true;

      // Activation des contrôles
      if (scene.screenSpaceCameraController) {
        scene.screenSpaceCameraController.enableInputs = true;
      }

      // Sauvegarde de la position d'origine (2D)
      const originalCartographic = scene.camera.positionCartographic.clone();
      const originalHeading = scene.camera.heading;
      
      // FORCER une vue verticale (perpendiculaire à la terre)
      const verticalPitch = window.Cesium.Math.toRadians(-25); // -90° = vue directe vers le bas
      const verticalRoll = 0; // Pas de rotation latérale

      console.log('Position d\'origine sauvegardée:', {
        longitude: window.Cesium.Math.toDegrees(originalCartographic.longitude),
        latitude: window.Cesium.Math.toDegrees(originalCartographic.latitude),
        height: originalCartographic.height,
        heading: window.Cesium.Math.toDegrees(originalHeading)
      });

      setIsAnimating(true);

      // ÉTAPE 1: Élévation verticale avec vue perpendiculaire à la terre
      const elevatedHeight = originalCartographic.height * ANIMATION_CONFIG.ZOOM_OUT_FACTOR;
      const elevatedPosition = window.Cesium.Cartesian3.fromRadians(
        originalCartographic.longitude,
        originalCartographic.latitude,
        elevatedHeight
      );

      scene.camera.flyTo({
        destination: elevatedPosition,
        orientation: {
          heading: originalHeading,    // Conserver l'orientation Nord/Sud
          pitch: verticalPitch,        // VUE VERTICALE vers la terre
          roll: verticalRoll          // Pas d'inclinaison latérale
        },
        duration: ANIMATION_CONFIG.DURATION * 0.5,
        easingFunction: window.Cesium.EasingFunction.CUBIC_OUT,
        complete: () => {
          // ÉTAPE 2: Retour à l'altitude d'origine, toujours vue verticale
          const originalPosition = window.Cesium.Cartesian3.fromRadians(
            originalCartographic.longitude,
            originalCartographic.latitude,
            originalCartographic.height
          );

          scene.camera.flyTo({
            destination: originalPosition,
            orientation: {
              heading: originalHeading,    // Conserver l'orientation Nord/Sud
              pitch: verticalPitch,        // MAINTENIR la vue verticale
              roll: verticalRoll          // Pas d'inclinaison latérale
            },
            duration: ANIMATION_CONFIG.DURATION * 0.5,
            easingFunction: window.Cesium.EasingFunction.CUBIC_IN,
            complete: () => {
              setIsAnimating(false);
              console.log('Animation 3D terminée - caméra verticale maintenue');
            },
            cancel: () => {
              setIsAnimating(false);
              console.warn('Animation 3D étape 2 annulée');
            }
          });
        },
        cancel: () => {
          setIsAnimating(false);
          console.warn('Animation 3D étape 1 annulée');
        }
      });

    } catch (error) {
      setIsAnimating(false);
      console.warn('Erreur lors de l\'animation 3D:', error);
    }
  };

  // Animation de retour en mode 2D - Maintient la vue verticale
  const animateTo2DMode = () => {
    if (!ol3d || !is3DMode) return;

    try {
      const scene = ol3d.getCesiumScene();
      
      if (scene?.camera) {
        setIsAnimating(true);
        
        // Sauvegarde de la position actuelle
        const currentCartographic = scene.camera.positionCartographic.clone();
        const currentHeading = scene.camera.heading;
        
        // MAINTENIR la vue verticale pour la transition
        const verticalPitch = window.Cesium.Math.toRadians(-25);
        const verticalRoll = 0;
        
        // Animation d'élévation légère avant retour 2D
        const tempHeight = currentCartographic.height * 1.3;
        const tempPosition = window.Cesium.Cartesian3.fromRadians(
          currentCartographic.longitude,
          currentCartographic.latitude,
          tempHeight
        );

        scene.camera.flyTo({
          destination: tempPosition,
          orientation: {
            heading: currentHeading,     // Conserver l'orientation Nord/Sud
            pitch: verticalPitch,        // MAINTENIR la vue verticale
            roll: verticalRoll          // Pas d'inclinaison latérale
          },
          duration: 0.6,
          easingFunction: window.Cesium.EasingFunction.CUBIC_OUT,
          complete: () => {
            // Désactivation du mode 3D après l'animation
            ol3d.setEnabled(false);
            setIs3DMode(false);
            setActiveMode(MODES.TWO_D);
            setIsAnimating(false);
            console.log('Retour au mode 2D avec vue verticale maintenue');
          },
          cancel: () => {
            ol3d.setEnabled(false);
            setIs3DMode(false);
            setActiveMode(MODES.TWO_D);
            setIsAnimating(false);
          }
        });
      } else {
        ol3d.setEnabled(false);
        setIs3DMode(false);
        setActiveMode(MODES.TWO_D);
      }

    } catch (error) {
      console.error('Erreur lors du retour au mode 2D:', error);
      try {
        ol3d.setEnabled(false);
      } catch {}
      setIs3DMode(false);
      setActiveMode(MODES.TWO_D);
      setIsAnimating(false);
    }
  };

  // Activation du mode 3D avec animation
  const handle3DMode = () => {
    if (!ol3d || is3DMode || isAnimating) return;

    try {
      ol3d.setEnabled(true);
      setIs3DMode(true);
      setActiveMode(MODES.THREE_D);
      console.log('Activation du mode 3D - caméra maintenue verticale à la terre');

      // Lancement de l'animation après initialisation
      setTimeout(animateTo3DMode, 150);

    } catch (error) {
      console.error('Erreur lors de l\'activation du mode 3D:', error);
      setIs3DMode(false);
      setActiveMode(MODES.TWO_D);
      setIsAnimating(false);
    }
  };

  // Styles avec animations CSS
  const getButtonStyle = (mode) => ({
    height: '35px',
    minWidth: '40px',
    px: 1,
    bgcolor: activeMode === mode ? '#2196f3' : '#ffffff',
    color: activeMode === mode ? 'white' : '#555555',
    opacity: isAnimating ? 0.7 : 1,
    '&:hover': {
      bgcolor: activeMode === mode ? '#1976d2' : '#f0f0f0',
      transform: !isAnimating ? 'translateY(-1px)' : 'none',
    },
    '&:disabled': {
      bgcolor: '#2196f3',
      color: 'white',
    },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: 0,
    position: 'relative',
    overflow: 'hidden',
    ...(mode === MODES.TWO_D && {
      borderRight: '1px solid rgba(0,0,0,0.08)'
    }),
    // Effet de shimmer pendant l'animation
    ...(isAnimating && activeMode === mode && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        animation: 'shimmer 1.5s infinite',
      },
      '@keyframes shimmer': {
        '0%': { left: '-100%' },
        '100%': { left: '100%' },
      }
    })
  });

  return (
    <Paper
      elevation={isAnimating ? 8 : 4}
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        transform: isAnimating ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isAnimating ? '0 8px 30px rgba(33, 150, 243, 0.3)' : undefined,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Button
          onClick={animateTo2DMode}
          disabled={activeMode === MODES.TWO_D || isAnimating}
          sx={getButtonStyle(MODES.TWO_D)}
        >
          <MapIcon sx={{ 
            fontSize: '1rem', 
            mr: 0.5,
            transform: isAnimating && activeMode === MODES.TWO_D ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
          {MODES.TWO_D}
        </Button>
        
        <Button
          onClick={handle3DMode}
          disabled={activeMode === MODES.THREE_D || isAnimating}
          sx={getButtonStyle(MODES.THREE_D)}
        >
          <ViewInArOutlinedIcon sx={{ 
            fontSize: '1rem', 
            mr: 0.5,
            transform: isAnimating && activeMode === MODES.THREE_D ? 'rotateY(360deg) scale(1.2)' : 'rotateY(0deg)',
            transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
          {MODES.THREE_D}
          {isAnimating && activeMode === MODES.THREE_D && (
            <Box
              component="span"
              sx={{
                ml: 0.5,
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'currentColor',
                animation: 'bounce 0.6s infinite alternate',
                '@keyframes bounce': {
                  '0%': { transform: 'scale(0.8) translateY(0px)' },
                  '100%': { transform: 'scale(1.2) translateY(-3px)' },
                }
              }}
            />
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default ModeSwitchButton;