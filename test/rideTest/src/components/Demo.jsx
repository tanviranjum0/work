import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';


const App = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <APIProvider apiKey={import.meta.env.VITE_MAP_API} >
            <div style={{ width: '100vw', height: '100vh' }}>
                <Map
                    // mapId={import.meta.env.VITE_MAP_ID}
                    zoom={8}
                    center={{ lat: 37.7749, lng: -122.4194 }} // San Francisco
                ><AdvancedMarker onClick={() => setOpen(true)} position={{ lat: 37.7749, lng: -122.4194 }}><Pin background={"gray"} borderColor={"green"} glyphColor={"purple"} /></AdvancedMarker>
                    {open && <InfoWindow onCloseClick={() => setOpen(false)} position={{ lat: 37.7749, lng: -122.4194 }}><div>I am in san fransisco</div></InfoWindow>}
                </Map>
            </div>
        </APIProvider>
    );
}
export default App;