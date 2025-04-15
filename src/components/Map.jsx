import React, { useEffect, useRef } from 'react';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import 'ol/ol.css';


import ModeSwitchButton from "./ModeSwitchButton";

export default function MapComponent() {
    const mapRef = useRef(null); // pour le DOM
    const olMapRef = useRef(null); // pour stocker l'objet Map

        useEffect(() => {
        if (!olMapRef.current) {
            olMapRef.current = new Map({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: fromLonLat([-7.589843, 33.573110]), // coordonnées de casablanca
                    zoom: 11,
                }),
            });
        }
    }, []);

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
            }}
        >
    <ModeSwitchButton/>
            </div>

    );
} 
