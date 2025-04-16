import React, { useEffect, useRef, useState } from 'react';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';

import './Map.css'

import FullScreen from 'ol/control/FullScreen.js';
import OverviewMap from 'ol/control/OverviewMap.js';
import ScaleLine from 'ol/control/ScaleLine.js';
import ZoomSlider from 'ol/control/ZoomSlider.js';
import ZoomToExtent from 'ol/control/ZoomToExtent.js';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom.js';


import ModeSwitchButton from "./ModeSwitchButton";
import BaseMapSelector from "./BaseMapSelector";

export default function MapComponent() {
    const mapRef = useRef(null); // pour le DOM
    const olMapRef = useRef(null); // pour stocker l'objet Map
    const [selectedBasemap, setSelectedBasemap] = useState("Hybrid")

    useEffect(() => {
        if (!olMapRef.current) {
            olMapRef.current = new Map({
                target: mapRef.current,
                view: new View({
                    center: fromLonLat([-7.650399, 33.547345]), // coordonnées de casablanca
                    zoom: 18,
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
                    new OverviewMap({
                        layers: [
                            new TileLayer({
                                source: new OSM(),
                            }),
                        ],
                    }),
                    new ScaleLine(),
                    new ZoomSlider(),
                    new ZoomToExtent({
                        extent: fromLonLat([-7.660399, 33.540345]).concat(fromLonLat([-7.640399, 33.555345])),
                    })
                ]
            });

        }
    }, []);



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

        // add the new base map
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
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 10px 20px rgba(16, 16, 16, 0.1)",
                position: "relative"
            }}
        >
            <ModeSwitchButton />
            <BaseMapSelector onBaseMapChange={onBaseMapChange} selectedBasemap={selectedBasemap} />
        </div>

    );
} 
