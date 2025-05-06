import React, { useEffect } from 'react';
import { APIProvider, useMap, Map } from '@vis.gl/react-google-maps';


const App = () => {
    return (
        <APIProvider apiKey={import.meta.env.VITE_MAP_API} >
            <div style={{ width: '100vw', height: '100vh' }}>
                <Map
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    defaultZoom={8}
                    defaultCenter={{ lat: 37.7749, lng: -122.4194 }} // San Francisco
                    options={{
                        zoomControl: true,
                        streetViewControl: false,
                        fullscreenControl: false,
                        mapTypeControl: false,
                    }}
                ></Map>
            </div>
        </APIProvider>
    );
}
export default App;