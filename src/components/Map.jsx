import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { createStringXY } from 'ol/coordinate';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';

// Controls
import FullScreen from 'ol/control/FullScreen.js';
import OverviewMap from 'ol/control/OverviewMap.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import ZoomSlider from 'ol/control/ZoomSlider.js';
import ZoomToExtent from 'ol/control/ZoomToExtent.js';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom.js';
import MousePosition from 'ol/control/MousePosition.js';

// ol-cesium
import OLCesium from 'olcs';

// Components
import ModeSwitchButton from "./ModeSwitchButton";
import BaseMapSelector from "./BaseMapSelector";
import ComboBox from './ComboBox';
import Tools from './Tools.jsx';
import PhotoPoints from './StreetView.jsx';

import './Map.css';

// Constants
const PROJECTIONS = {
  EPSG4326: "EPSG:4326",
  EPSG26191: "EPSG:26191"
};

const BASEMAPS = {
  OSM: "osm",
  SATELLITE: "Satellite",
  HYBRID: "Hybrid",
  TERRAIN: "Terrain",
  ROADMAP: "RoadMap"
};

const MAP_CONFIG = {
  defaultCenter: [-7.650399, 33.547345],
  defaultZoom: 17,
  extent: fromLonLat([-7.65641, 33.54505]).concat(fromLonLat([-7.64433, 33.54986]))
};

export default function MapComponent({ mousePositionRef }) {
  // Map state
  const mapRef = useRef(null);
  const [olMap, setOlMap] = useState(null);
  const [selectedBasemap, setSelectedBasemap] = useState(BASEMAPS.HYBRID);
  const [selectedProjection, setSelectedProjection] = useState(PROJECTIONS.EPSG4326);
  
  // 3D state
  const [ol3d, setOl3d] = useState(null);
  const [is3DMode, setIs3DMode] = useState(false);
  
  // Controls and overlays
  const mouseControlRef = useRef(null);
  const measureSourceRef = useRef(new VectorSource());
  const measureLayerRef = useRef(null);
  const helpTooltipElementRef = useRef(null);
  const helpTooltipRef = useRef(null);
  const measureTooltipElementRef = useRef(null);
  const measureTooltipRef = useRef(null);

  // Initialize projection
  useEffect(() => {
    proj4.defs(PROJECTIONS.EPSG26191, "+proj=lcc +lat_1=33.3 +lat_2=35.9 +lat_0=32.5 +lon_0=-5 +x_0=500000 +y_0=300000 +ellps=clrk80 +units=m +no_defs");
    register(proj4);
  }, []);

  // Tooltip creation functions
  const createHelpTooltip = () => {
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
  };

  const createMeasureTooltip = () => {
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
  };

  // Basemap creation function
  const createBasemapLayer = (basemapId) => {
    const basemapConfigs = {
      [BASEMAPS.OSM]: {
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attributions: '© OpenStreetMap contributors',
        maxZoom: 19
      },
      [BASEMAPS.SATELLITE]: {
        url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attributions: '© Google',
        maxZoom: 20
      },
      [BASEMAPS.HYBRID]: {
        url: 'http://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        attributions: '© Google',
        maxZoom: 20
      },
      [BASEMAPS.TERRAIN]: {
        url: 'http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        attributions: '© Google',
        maxZoom: 20
      },
      [BASEMAPS.ROADMAP]: {
        url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attributions: '© Google',
        maxZoom: 20
      }
    };

    const config = basemapConfigs[basemapId];
    if (!config) {
      console.warn("Unknown basemap ID:", basemapId);
      return null;
    }

    return new TileLayer({
      source: new XYZ(config)
    });
  };

  // Map initialization
  useEffect(() => {
    if (!mapRef.current || olMap) return;

    // Create measure layer
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
        center: fromLonLat(MAP_CONFIG.defaultCenter),
        zoom: MAP_CONFIG.defaultZoom,
      }),
      layers: [
        createBasemapLayer(BASEMAPS.HYBRID),
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
          extent: MAP_CONFIG.extent,
        })
      ]
    });

    setOlMap(newMap);
    console.log('Map initialized', newMap.getView().getProjection().getCode());
  }, []);

  // Initialize ol-cesium
  useEffect(() => {
    if (!olMap || ol3d) return;

    if (typeof window.Cesium === 'undefined') {
      console.error('Cesium is not loaded. Please include the Cesium script.');
      return;
    }

    try {
      const cesiumInstance = new OLCesium({
        map: olMap
      });

      setOl3d(cesiumInstance);

      // Configure Cesium scene
      setTimeout(() => {
        try {
          const scene = cesiumInstance.getCesiumScene();
          if (scene) {
            // Configure scene properties
            ['skyBox', 'sun', 'moon', 'skyAtmosphere'].forEach(prop => {
              if (scene[prop]) scene[prop].show = true;
            });

            // Configure camera controls
            if (scene.screenSpaceCameraController) {
              scene.screenSpaceCameraController.enableInputs = true;
            }
          }
        } catch (configError) {
          console.warn('Cesium deferred configuration failed:', configError);
        }
      }, 100);

    } catch (error) {
      console.error('Error initializing ol-cesium:', error);
    }
  }, [olMap]);

  // Initialize tooltips
  useEffect(() => {
    if (!olMap) return;
    createHelpTooltip();
    createMeasureTooltip();
  }, [olMap]);

  // Update basemap
  useEffect(() => {
    if (!olMap) return;

    const newBaseMap = createBasemapLayer(selectedBasemap);
    if (!newBaseMap) return;

    // Remove old overview control
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

    // Add new overview control
    const newOverview = new OverviewMap({
      layers: [newBaseMap],
    });

    olMap.addControl(newOverview);
  }, [selectedBasemap, olMap]);

  // Update projection
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

  // Event handlers
  const onBaseMapChange = (id) => {
    if (!olMap) return;

    const layers = olMap.getLayers();
    if (layers.getLength() > 0) {
      layers.removeAt(0);
    }

    const newBaseMap = createBasemapLayer(id);
    if (newBaseMap) {
      layers.insertAt(0, newBaseMap);
      setSelectedBasemap(id);
    }
  };

  const clearMeasurements = () => {
    if (measureSourceRef.current) {
      measureSourceRef.current.clear();
    }

    if (!olMap) return;

    const overlays = olMap.getOverlays().getArray();
    const overlaysToRemove = overlays.filter(overlay => {
      const element = overlay.getElement();
      return element && (
        element.className.includes('ol-tooltip-measure') || 
        element.className.includes('ol-tooltip-static')
      );
    });

    overlaysToRemove.forEach(overlay => {
      olMap.removeOverlay(overlay);
    });

    createMeasureTooltip();
    createHelpTooltip();
  };

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
      <ModeSwitchButton
        ol3d={ol3d}
        is3DMode={is3DMode}
        setIs3DMode={setIs3DMode}
        currentMode={is3DMode ? '3D' : '2D'}
        olMap={olMap}
      />
      
      <BaseMapSelector 
        onBaseMapChange={onBaseMapChange} 
        selectedBasemap={selectedBasemap} 
      />
      
      <ComboBox
        selectedProjection={selectedProjection}
        onChange={setSelectedProjection}
      />

      {/* Tools available only in 2D mode */}
      {olMap && !is3DMode && (
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

      {/* 3D Mode indicator */}
      {is3DMode && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '10px',
          background: 'rgba(33, 150, 243, 0.9)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          Mode 3D actif
        </div>
      )}

      {/* Mouse position display */}
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