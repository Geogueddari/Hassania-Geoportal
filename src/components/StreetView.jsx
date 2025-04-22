import React, { useState, useEffect, useRef } from 'react';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style.js';
import { fromLonLat } from 'ol/proj.js';
import Overlay from 'ol/Overlay.js';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Tooltip from '@mui/material/Tooltip';
import StreetviewIcon from '@mui/icons-material/Streetview';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Zoom from '@mui/material/Zoom';

const pointsData = [
  {
    id: 1,
    name: "École Hassania",
    coordinates: [-7.65418, 33.54833], 
    images: ["/images/ecole_hassania_1.jpg", "/images/ecole_hassania_2.jpg"]
  },
  {
    id: 2,
    name: "Restaurant EHTP",
    coordinates: [-7.65145, 33.54861],
    images: ["/images/restaurant_ehtp.jpg"]
  },
  {
    id: 3, 
    name: "Terrain de Tennis",
    coordinates: [-7.65002, 33.54935],
    images: ["/images/tennis_1.jpg", "/images/tennis_2.jpg"]
  },
  {
    id: 4,
    name: "Internat EHTP",
    coordinates: [-7.64961, 33.54782],
    images: ["/images/internat_ehtp.jpg"]
  },
  {
    id: 5,
    name: "Centre de Conférence EHTP",
    coordinates: [-7.65124, 33.54777],
    images: ["/images/conference_1.jpg", "/images/conference_2.jpg"]
  }
];

const PhotoPoints = ({ map }) => {
  const [active, setActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const vectorLayerRef = useRef(null);
  const featuresRef = useRef([]);
  
  useEffect(() => {
    if (!map) return;
    
    const vectorSource = new VectorSource();
    
    vectorLayerRef.current = new VectorLayer({
      source: vectorSource,
      visible: active,
      zIndex: 10, 
    });
    
    map.addLayer(vectorLayerRef.current);
    
    featuresRef.current = pointsData.map(point => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(point.coordinates)),
        name: point.name,
        id: point.id,
        images: point.images
      });
      
      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({
            color: '#4285F4' 
          }),
          stroke: new Stroke({
            color: '#FFFFFF',
            width: 2
          })
        })
      }));
      
      return feature;
    });
    
    vectorSource.addFeatures(featuresRef.current);
    
    const clickHandler = function(evt) {
      if (!active) return;
      
      const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
      });
      
      if (feature && feature.get('images')) {
        setCurrentPoint({
          name: feature.get('name'),
          images: feature.get('images')
        });
        setCurrentImageIndex(0);
        setDialogOpen(true);
      }
    };
    
    map.on('click', clickHandler);
    
    return () => {
      map.removeLayer(vectorLayerRef.current);
      map.un('click', clickHandler);
    };
  }, [map, active]);
  
  useEffect(() => {
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setVisible(active);
    }
  }, [active]);
  
  const handleNext = () => {
    if (!currentPoint) return;
    setCurrentImageIndex((prev) => 
      prev < currentPoint.images.length - 1 ? prev + 1 : 0
    );
  };
  
  const handlePrevious = () => {
    if (!currentPoint) return;
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : currentPoint.images.length - 1
    );
  };
  
  return (
    <>
      <div
        onClick={() => setActive(!active)}
        style={{
          position: 'absolute',
          right: '10px',
          bottom: '110px',
          width: '40px',
          height: '40px',
          backgroundColor: active ? '#1A73E8' : 'white',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease',
          zIndex: 1000,
        }}
      >
        <Tooltip
          title={active ? "Désactiver les photos" : "Afficher les photos"}
          placement="left"
          TransitionComponent={Zoom}
        >
          <StreetviewIcon
            style={{
              color: active ? 'white' : '#666',
              fontSize: '20px',
            }}
          />
        </Tooltip>
      </div>
      
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: '#000',
            overflow: 'hidden',
          }
        }}
      >
        {currentPoint && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: '#000',
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setDialogOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 10,
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
            
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                zIndex: 10,
              }}
            >
              {currentPoint.name}
            </Box>

            <img 
              src={currentPoint.images[currentImageIndex]} 
              alt={`${currentPoint.name} - image ${currentImageIndex + 1}`}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            
            {currentPoint.images.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  <NavigateBeforeIcon sx={{ color: 'white', fontSize: 40 }} />
                </IconButton>
                
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.7)',
                    },
                  }}
                >
                  <NavigateNextIcon sx={{ color: 'white', fontSize: 40 }} />
                </IconButton>
                
                <Box
                  sx={{ 
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    p: 1, 
                    bgcolor: 'rgba(0,0,0,0.5)',
                    borderRadius: '8px',
                    width: 'auto',
                    maxWidth: '80%',
                  }}
                >
                  <ImageList 
                    sx={{ 
                      m: 0,
                      display: 'flex',
                      flexWrap: 'nowrap',
                      gap: 1,
                      overflow: 'auto',
                    }} 
                    cols={currentPoint.images.length} 
                    rowHeight={60}
                  >
                    {currentPoint.images.map((img, index) => (
                      <ImageListItem 
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        sx={{ 
                          width: 60, 
                          height: 60,
                          cursor: 'pointer',
                          border: index === currentImageIndex ? '3px solid #1A73E8' : '3px solid transparent',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                          '&:hover': {
                            opacity: 0.8,
                          }
                        }}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          style={{ 
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              </>
            )}
          </Box>
        )}
      </Dialog>
    </>
  );
};

export default PhotoPoints;