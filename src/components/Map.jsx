import React, { useEffect, useRef, useState } from 'react';

import Typography from '@mui/material/Typography';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';

import './Map.css';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';

import FullScreen from 'ol/control/FullScreen.js';
import OverviewMap from 'ol/control/OverviewMap.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import ZoomSlider from 'ol/control/ZoomSlider.js';
import ZoomToExtent from 'ol/control/ZoomToExtent.js';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom.js';
import MousePosition from 'ol/control/MousePosition.js';
import { createStringXY } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';

import ModeSwitchButton from "./ModeSwitchButton";
import BaseMapSelector from "./BaseMapSelector";
import ComboBox from './ComboBox';
import Tools from './Tools.jsx';
import PhotoPoints from './StreetView.jsx';

import './Map.css';

export default function MapComponent({ mousePositionRef }) {
  const mapRef = useRef(null);
  const [olMap, setOlMap] = useState(null); // État pour stocker l'instance de la carte
  const [selectedBasemap, setSelectedBasemap] = useState("Hybrid");
  const [selectedProjection, setSelectedProjection] = useState("EPSG:4326");
  const mouseControlRef = useRef(null);
  
  const measureSourceRef = useRef(new VectorSource());
  const measureLayerRef = useRef(null);
  const helpTooltipElementRef = useRef(null);
  const helpTooltipRef = useRef(null);
  const measureTooltipElementRef = useRef(null);
  const measureTooltipRef = useRef(null);
  
  proj4.defs("EPSG:26191", "+proj=utm +zone=30 +ellps=clrk80 +towgs84=-146.43,112.74,-292.66,0,0,0,0 +units=m +no_defs");
  register(proj4);

  function createHelpTooltip() {
    if (helpTooltipElementRef.current) {
      helpTooltipElementRef.current.parentNode.removeChild(helpTooltipElementRef.current);
    }
    helpTooltipElementRef.current = document.createElement('div');
    helpTooltipElementRef.current.className = 'ol-tooltip hidden';
    helpTooltipRef.current = new Overlay({
      element: helpTooltipElementRef.current,
      offset: [15, 0],
      positioning: 'center-left',
    });
    if (olMap) {
      olMap.addOverlay(helpTooltipRef.current);
    }
  }

  function createMeasureTooltip() {
    if (measureTooltipElementRef.current) {
      measureTooltipElementRef.current.parentNode.removeChild(measureTooltipElementRef.current);
    }
    measureTooltipElementRef.current = document.createElement('div');
    measureTooltipElementRef.current.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltipRef.current = new Overlay({
      element: measureTooltipElementRef.current,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false,
    });
    if (olMap) {
      olMap.addOverlay(measureTooltipRef.current);
    }
  }

  // Initialisation de la carte
  useEffect(() => {
    if (!mapRef.current || olMap) return;
    
    measureLayerRef.current = new VectorLayer({
      source: measureSourceRef.current,
      style: new Style({
        fill: new Fill({
          color: 'rgba(65, 122, 197, 0.2)',
        }),
        stroke: new Stroke({
          color: 'rgba(25, 118, 210, 0.7)',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(25, 118, 210, 0.9)',
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.4)',
          }),
        }),
      }),
    });

    const newMap = new Map({
      target: mapRef.current,
      view: new View({
        center: fromLonLat([-7.650399, 33.547345]),
        zoom: 17,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
            attributions: '© Google',
            maxZoom: 20,
          }),
        }),
        measureLayerRef.current
      ],
      controls: [
        new Zoom(),
        new Attribution({
          collapsible: true,
          collapsed: false
        }),
        new FullScreen({ source: mapRef.current }),
        new ScaleLine(),
        new ZoomSlider(),
        new ZoomToExtent({
          extent: fromLonLat([-7.65641, 33.54505]).concat(fromLonLat([-7.64433, 33.54986])),
        })
      ]
    });
    
    setOlMap(newMap);
  }, []);

  // Créer les tooltips après l'initialisation de la carte
  useEffect(() => {
    if (!olMap) return;
    
    createHelpTooltip();
    createMeasureTooltip();
  }, [olMap]);

  // Mise à jour du basemap
  useEffect(() => {
    if (!olMap) return;
    
    let newBaseMap;
    switch (selectedBasemap) {
      case "osm":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          }),
        });
        break;
      case "Satellite":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          }),
        });
        break;
      case "Hybrid":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          }),
        });
        break;
      case "Terrain":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          }),
        });
        break;
      case "RoadMap":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          }),
        });
        break;
      default:
        console.warn("Unknown basemap ID:", selectedBasemap);
        return;
    }
    
    const controls = olMap.getControls();
    let oldOverviewControl = null;
    controls.forEach((control) => {
      if (control instanceof OverviewMap) {
        oldOverviewControl = control;
      }
    });

    if (oldOverviewControl) {
      olMap.removeControl(oldOverviewControl);
    }

    const newOverview = new OverviewMap({
      layers: [newBaseMap],
    });

    olMap.addControl(newOverview);

  }, [selectedBasemap, olMap]);

  // Mise à jour de la projection
  useEffect(() => {
    if (!olMap) return;
    
    if (mouseControlRef.current) {
      olMap.removeControl(mouseControlRef.current);
    }

    const newMouseControl = new MousePosition({
      coordinateFormat: createStringXY(5),
      projection: selectedProjection,
      target: mousePositionRef.current,
      className: 'custom-mouse-position',
      undefinedHTML: 'Coordonnées: N/A',
    });

    olMap.addControl(newMouseControl);
    mouseControlRef.current = newMouseControl;
  }, [selectedProjection, olMap]);

  function onBaseMapChange(id) {
    if (!olMap) return;
    
    const layers = olMap.getLayers();

    if (layers.getLength() > 0) {
      layers.removeAt(0); 
    }

    let newBaseMap;
    switch (id) {
      case "osm":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: '© OpenStreetMap contributors',
            maxZoom: 19,
          }),
        });
        break;
      case "Satellite":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            attributions: '© Google',
            maxZoom: 20,
          }),
        });
        break;
      case "Hybrid":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
            attributions: '© Google',
            maxZoom: 20,
          }),
        });
        break;
      case "Terrain":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
            attributions: '© Google',
            maxZoom: 20,
          }),
        });
        break;
      case "RoadMap":
        newBaseMap = new TileLayer({
          source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            attributions: '© Google',
            maxZoom: 20,
          }),
        });
        break;
      default:
        console.warn("Unknown basemap ID:", id);
        return;
    }

    layers.insertAt(0, newBaseMap);
    setSelectedBasemap(id);
  }

  function clearMeasurements() {
    if (measureSourceRef.current) {
      measureSourceRef.current.clear();
    }
    
    if (!olMap) return;
    
    const overlays = olMap.getOverlays().getArray();
    const overlaysToRemove = [];
    
    overlays.forEach(overlay => {
      const element = overlay.getElement();
      if (element && (element.className.includes('ol-tooltip-measure') || element.className.includes('ol-tooltip-static'))) {
        overlaysToRemove.push(overlay);
      }
    });
    
    overlaysToRemove.forEach(overlay => {
      olMap.removeOverlay(overlay);
    });
    
    createMeasureTooltip();
    createHelpTooltip();
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: 'calc(100% - 40px)',
        height: '90%',
        margin: '20px',
        boxShadow: "0 10px 20px rgba(16, 16, 16, 0.1)",
        position: "relative"
      }}
    >
      <ModeSwitchButton />
      <BaseMapSelector onBaseMapChange={onBaseMapChange} selectedBasemap={selectedBasemap} />
      <ComboBox 
        selectedProjection={selectedProjection} 
        onChange={setSelectedProjection}
      />
   
      {/* Rendre les composants dès que olMap est disponible */}
      {olMap && (
        <>
          <Tools 
            map={olMap} 
            measureSourceRef={measureSourceRef} 
            clearMeasurements={clearMeasurements}
            helpTooltipElementRef={helpTooltipElementRef}
            helpTooltipRef={helpTooltipRef}
            measureTooltipElementRef={measureTooltipElementRef}
            measureTooltipRef={measureTooltipRef}
            createHelpTooltip={createHelpTooltip}
            createMeasureTooltip={createMeasureTooltip}
          />
          <PhotoPoints map={olMap} />
        </>
      )}

      <Typography
        variant="caption"
        component="div"
        ref={mousePositionRef}
        sx={{
          position: "absolute",
          bottom: "-45px",
          left: "330px", 
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          letterSpacing: "0.3px",
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "primary",
          color: 'primary',
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "1px solid rgba(25, 118, 210, 0.2)",
          fontFamily: "monospace",
          zIndex: 1000,
          "&::before": {
            content: "'XY:'",
            marginRight: "6px",
            color: "rgb(25, 118, 210)",
            fontWeight: "600",
            fontSize: "12px"
          }
        }}
      />
    </div>
  );
}