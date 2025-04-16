import React, { useEffect, useRef, useState } from 'react';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ';
import 'ol/ol.css';


import ModeSwitchButton from "./ModeSwitchButton";
import BaseMapSelector from "./BaseMapSelector"

export default function MapComponent() {
    const mapRef = useRef(null); // pour le DOM
    const olMapRef = useRef(null); // pour stocker l'objet Map
    const [selectedBasemap , setSelectedBasemap] = useState()

    useEffect(() => {
        if (!olMapRef.current) {
            olMapRef.current = new Map({
                target: mapRef.current,
                layers: [],
                view: new View({
                    center: fromLonLat([-7.589843, 33.573110]), // coordonnées de casablanca
                    zoom: 11,
                }),
            });
            olMapRef.current.getLayers().push(new TileLayer({
                source: new OSM(),
            }))
            setSelectedBasemap("osm")
        }
    }, []);



    function onMapChange(id) {
        const layers = olMapRef.current.getLayers();
        
        // Supprimer le layer précédent (si présent)
        if (layers.getLength() > 0) {
            layers.removeAt(0);
        }
    
        // Créer la nouvelle source selon l’ID
        let newLayer;
        switch (id) {
            case "osm":
                newLayer = new TileLayer({
                    source: new OSM(),
                });
                break;
            case "Satellite":
                newLayer = new TileLayer({
                    source: new XYZ({
                        url: 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                        attributions: '© Google',
                        maxZoom: 20,
                    }),
                });
                break;
            default:
                console.warn("Unknown basemap ID:", id);
                return;
        }
    
        // Ajouter le nouveau layer à l’index 0
        layers.insertAt(0, newLayer);
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
    <ModeSwitchButton/>
    <BaseMapSelector onMapChange={onMapChange} selectedBasemap={selectedBasemap}/>
            </div>

    );
} 
