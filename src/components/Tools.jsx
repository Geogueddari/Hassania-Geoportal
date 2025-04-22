import React, { useState, useEffect } from 'react';
import RulerIcon from '@mui/icons-material/Straighten';
import AreaIcon from '@mui/icons-material/SquareFoot';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { Draw } from 'ol/interaction';
import { unByKey } from 'ol/Observable';
import { LineString, Polygon } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere';
import './Tools.css';

export default function Tools({
  map,
  measureSourceRef,
  clearMeasurements,
  helpTooltipElementRef,
  helpTooltipRef,
  measureTooltipElementRef,
  measureTooltipRef,
  createHelpTooltip,
  createMeasureTooltip
}) {
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [measureType, setMeasureType] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const drawRef = React.useRef(null);
  const sketchRef = React.useRef(null);
  const listenerKeyRef = React.useRef(null);

  useEffect(() => {
    if (!map) return;

    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
      drawRef.current = null;
    }
    
    if (measureType) {
      addMeasureInteraction();
      
      map.on('pointermove', pointerMoveHandler);
    } else {
      if (helpTooltipRef.current) {
        map.removeOverlay(helpTooltipRef.current);
        createHelpTooltip();
      }
      map.un('pointermove', pointerMoveHandler);
    }
    
    return () => {
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
      }
      map.un('pointermove', pointerMoveHandler);
    };
  }, [measureType, map]);

  const handleToolSelection = (tool) => {
    if (activeButton === tool) {
      setActiveButton(null);
      setMeasureType(null);
    } else {
      setActiveButton(tool);
      setMeasureType(tool);
    }
    setToolsMenuOpen(false);
  };

  const handleDeleteMeasurements = () => {
    if (clearMeasurements) {
      clearMeasurements();
    }
    setToolsMenuOpen(false);
    setActiveButton(null);
    setMeasureType(null);
  };

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
      style: null 
    });
    
    map.addInteraction(drawRef.current);

    createMeasureTooltip();
    createHelpTooltip();

    let listener;
    drawRef.current.on('drawstart', function (evt) {
      sketchRef.current = evt.feature;

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
      
      createMeasureTooltip();
      
      if (listener) {
        unByKey(listener);
      }
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

  const ToolsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );

  return (
    <div className="tools-container">
      <button
        className={`tools-main-button ${toolsMenuOpen ? 'active' : ''}`}
        onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
        title="Outils de carte"
        aria-label="Outils de carte"
      >
        <ToolsIcon />
        <span>Tools</span>
      </button>
      
      {toolsMenuOpen && (
        <div className="tools-dropdown">
          <div className="tools-dropdown-header">
            <span>Outils de mesure</span>
          </div>
          
          <button
            className={`tool-button ${activeButton === 'distance' ? 'active' : ''}`}
            onClick={() => handleToolSelection('distance')}
            title="Mesurer une distance"
          >
            <RulerIcon className="tool-icon" />
            <span>Distance</span>
          </button>
          
          <button
            className={`tool-button ${activeButton === 'area' ? 'active' : ''}`}
            onClick={() => handleToolSelection('area')}
            title="Mesurer une surface"
          >
            <AreaIcon className="tool-icon" />
            <span>Surface</span>
          </button>
          
          <div className="tools-divider"></div>
          
          <button
            className="tool-button delete-button"
            onClick={handleDeleteMeasurements}
            title="Supprimer toutes les mesures"
          >
            <DeleteIcon className="tool-icon" />
            <span>Supprimer</span>
          </button>
        </div>
      )}
    </div>
  );
}