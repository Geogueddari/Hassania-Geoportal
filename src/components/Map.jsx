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


import FullScreen from 'ol/control/FullScreen.js';
import OverviewMap from 'ol/control/OverviewMap.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import ZoomSlider from 'ol/control/ZoomSlider.js';
import ZoomToExtent from 'ol/control/ZoomToExtent.js';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom.js';
import MousePosition from 'ol/control/MousePosition.js';
import { createStringXY } from 'ol/coordinate';

import ModeSwitchButton from "./ModeSwitchButton";
import BaseMapSelector from "./BaseMapSelector";
import ComboBox from './ComboBox';


import './Map.css'


export default function MapComponent({ mousePositionRef }) {
    const mapRef = useRef(null);
    const olMapRef = useRef(null);
    const [selectedBasemap, setSelectedBasemap] = useState("Hybrid")
    const [selectedProjection, setSelectedProjection] = useState("EPSG:4326");
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
                    }),
                    new MousePosition({
                        coordinateFormat: createStringXY(5),
                        projection: 'EPSG:4326',
                        target: mousePositionRef.current,
                        className: 'custom-mouse-position',
                        undefinedHTML: 'Coordonnées: N/A',
                    })
                ]
            });
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
                console.warn("Unknown basemap ID:", id);
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

    }, [selectedBasemap])

    useEffect(() => {
      const newMouseControl = new MousePosition({
        coordinateFormat: createStringXY(5),
        projection: selectedProjection,
        target: mousePositionRef.current,
        className: 'custom-mouse-position',
        undefinedHTML: 'Coordonnées: N/A',
      });
  
      olMapRef.current.addControl(newMouseControl);
    }, [selectedProjection]);


    function onBaseMapChange(id) {
        const layers = olMapRef.current.getLayers();

        if (layers.getLength() > 0) {
            layers.removeAt(0); // remove actual base map
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
        setSelectedBasemap(id)
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
      <Typography
        variant="caption"
        component="div"
        ref={mousePositionRef}
        sx={{
          position: "absolute",
          bottom: "-40px",
          left: "255px",
          padding: "5px 10px",
          borderRadius: "0px 0px 4px 4px",
          fontSize: "18px",
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "rgb(25, 118, 210)",
          color: "white",
        }}
      />
    </div>
  );
}

