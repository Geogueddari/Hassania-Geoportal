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
import { LineString, Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay';
import { getArea, getLength } from 'ol/sphere';

import RulerIcon from '@mui/icons-material/Straighten';
import AreaIcon from '@mui/icons-material/SquareFoot';

import ModeSwitchButton from "./ModeSwitchButton";
import BaseMapSelector from "./BaseMapSelector";
import ComboBox from './ComboBox';

import './Map.css';

export default function MapComponent(props) {
  const localMousePositionRef = useRef(null);
  const mousePositionRef = props.mousePositionRef ;
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  
  const mapRef = useRef(null);
  const olMapRef = useRef(null);
  const [selectedBasemap, setSelectedBasemap] = useState("Hybrid");
  const [selectedProjection, setSelectedProjection] = useState("EPSG:4326");
  const mouseControlRef = useRef(null);
  
  const measureSourceRef = useRef(null);
  const measureLayerRef = useRef(null);
  const drawRef = useRef(null);
  const helpTooltipRef = useRef(null);
  const measureTooltipRef = useRef(null);
  const measureTooltipElementRef = useRef(null);
  const helpTooltipElementRef = useRef(null);
  const sketchRef = useRef(null);
  const listenerKeyRef = useRef(null);
  
  const [measureType, setMeasureType] = useState(null); 
const ToolsIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
  
  proj4.defs("EPSG:26191", "+proj=utm +zone=30 +ellps=clrk80 +towgs84=-146.43,112.74,-292.66,0,0,0,0 +units=m +no_defs");
  register(proj4);

  useEffect(() => {
    if (!olMapRef.current) {
      olMapRef.current = new Map({
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
          })
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
      
      measureSourceRef.current = new VectorSource();
      measureLayerRef.current = new VectorLayer({
        source: measureSourceRef.current,
        style: new Style({
          fill: new Fill({
            color: 'rgba(65, 122, 197, 0.2)', // Bleu clair semi-transparent
          }),
          stroke: new Stroke({
            color: '#1976d2', 
            width: 3,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#1976d2',
            }),
          }),
        }),
      });
      
      olMapRef.current.addLayer(measureLayerRef.current);
      
      createMeasureTooltip();
      createHelpTooltip();
      
      olMapRef.current.on('pointermove', pointerMoveHandler);
    }
  }, []);

  useEffect(() => {
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
    
    const controls = olMapRef.current.getControls();
    let oldOverviewControl = null;
    controls.forEach((control) => {
      if (control instanceof OverviewMap) {
        oldOverviewControl = control;
      }
    });

    if (oldOverviewControl) {
      olMapRef.current.removeControl(oldOverviewControl);
    }

    const newOverview = new OverviewMap({
      layers: [newBaseMap],
    });

    olMapRef.current.addControl(newOverview);

  }, [selectedBasemap]);

  useEffect(() => {
    if (mouseControlRef.current) {
      olMapRef.current.removeControl(mouseControlRef.current);
    }

    const newMouseControl = new MousePosition({
      coordinateFormat: createStringXY(5),
      projection: selectedProjection,
      target: mousePositionRef.current,
      className: 'custom-mouse-position',
      undefinedHTML: 'Coordonnées: N/A',
    });

    olMapRef.current.addControl(newMouseControl);
    mouseControlRef.current = newMouseControl;
  }, [selectedProjection]);

  // Effet pour gérer le changement de type de mesure
  useEffect(() => {
    clearMeasurements();
    
    if (drawRef.current) {
      olMapRef.current.removeInteraction(drawRef.current);
      drawRef.current = null;
    }
    
    if (measureType) {
      addMeasureInteraction();
    }
    
    return () => {
      if (drawRef.current) {
        olMapRef.current.removeInteraction(drawRef.current);
      }
    };
  }, [measureType]);

  function onBaseMapChange(id) {
    const layers = olMapRef.current.getLayers();

    if (layers.getLength() > 0) {
      const baseMapLayer = layers.item(0);
      layers.remove(baseMapLayer);
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

  function formatLength(line) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' km';
    } else {
      output = Math.round(length * 100) / 100 + ' m';
    }
    return output;
  }

  function formatArea(polygon) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' km²';
    } else {
      output = Math.round(area * 100) / 100 + ' m²';
    }
    return output;
  }

  function addMeasureInteraction() {
    const type = measureType === 'area' ? 'Polygon' : 'LineString';
    
    drawRef.current = new Draw({
      source: measureSourceRef.current,
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(65, 122, 197, 0.2)',
        }),
        stroke: new Stroke({
          color: 'rgba(25, 118, 210, 0.7)',
          lineDash: [10, 10],
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
    
    olMapRef.current.addInteraction(drawRef.current);

    createMeasureTooltip();
    createHelpTooltip();

    let listener;
    drawRef.current.on('drawstart', function (evt) {
      sketchRef.current = evt.feature;

      /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
      let tooltipCoord = evt.coordinate;

      listener = sketchRef.current.getGeometry().on('change', function (evt) {
        const geom = evt.target;
        let output;
        if (geom instanceof Polygon) {
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElementRef.current.innerHTML = output;
        measureTooltipRef.current.setPosition(tooltipCoord);
      });
    });

    drawRef.current.on('drawend', function () {
      measureTooltipElementRef.current.className = 'ol-tooltip ol-tooltip-static';
      measureTooltipRef.current.setOffset([0, -7]);
      sketchRef.current = null;
      measureTooltipElementRef.current = null;
      createMeasureTooltip();
      unByKey(listener);
    });
  }

  function pointerMoveHandler(evt) {
    if (evt.dragging || !measureType) {
      return;
    }
    
    let helpMsg = measureType === 'area' ? 'Cliquez pour commencer à dessiner la surface' : 'Cliquez pour commencer à mesurer la distance';

    if (sketchRef.current) {
      const geom = sketchRef.current.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = 'Cliquez pour continuer à dessiner le polygone';
      } else if (geom instanceof LineString) {
        helpMsg = 'Cliquez pour continuer à dessiner la ligne';
      }
    }

    helpTooltipElementRef.current.innerHTML = helpMsg;
    helpTooltipRef.current.setPosition(evt.coordinate);
    helpTooltipElementRef.current.classList.remove('hidden');
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
    olMapRef.current.addOverlay(measureTooltipRef.current);
  }

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
    olMapRef.current.addOverlay(helpTooltipRef.current);
  }

  function clearMeasurements() {
    measureSourceRef.current.clear();
    
    const overlays = olMapRef.current.getOverlays().getArray();
    const overlaysToRemove = [];
    
    overlays.forEach(overlay => {
      const element = overlay.getElement();
      if (element && (element.className.includes('ol-tooltip-measure') || element.className.includes('ol-tooltip-static'))) {
        overlaysToRemove.push(overlay);
      }
    });
    
    overlaysToRemove.forEach(overlay => {
      olMapRef.current.removeOverlay(overlay);
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
      <ComboBox selectedProjection={selectedProjection} onChange={setSelectedProjection} />
     
      {/* Menu Tools avec outils de mesure */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          right: '0px',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}
      >
        <div className="tools-menu">
          <button
            className="tools-menu-button"
            onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
            title="Outils"
          >
            <ToolsIcon /> {}
            <span>Tools</span>
          </button>
          
          {toolsMenuOpen && (
            <div className="tools-dropdown">
              <button
                onClick={() => {
                  setMeasureType(measureType === 'distance' ? null : 'distance');
                  setToolsMenuOpen(false);
                }}
                className={`measure-button ${measureType === 'distance' ? 'active' : ''}`}
                title="Mesurer une distance"
              >
                <RulerIcon /> Distance
              </button>
             
              <button
                onClick={() => {
                  setMeasureType(measureType === 'area' ? null : 'area');
                  setToolsMenuOpen(false);
                }}
                className={`measure-button ${measureType === 'area' ? 'active' : ''}`}
                title="Mesurer une surface"
              >
                <AreaIcon /> Surface
              </button>
            </div>
          )}
        </div>
      </div>
     
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
        color:'primary',
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
     
      {}
     
    </div>
  );
}