import React, { useState, useCallback, useEffect, useRef } from 'react'
import { GoogleMapProvider, useAutocomplete, useGoogleMap } from "@ubilabs/google-maps-react-hooks"
const mapOptions = {
    zoom: 10,
    center: {
        lat: 40,
        lng: -88
    },
    mapId: import.meta.env.VITE_MAP_ID,
}

const Test3 = () => {
    const [mapContainer, setMapContainer] = useState(null);
    return (
        <GoogleMapProvider options={mapOptions} mapContainer={mapContainer} googleMapsAPIKey={import.meta.env.VITE_MAP_API}>
            <div style={{ height: "100vh" }} ref={(node) => setMapContainer(node)}></div>
        </GoogleMapProvider>
    )
}

export default Test3
