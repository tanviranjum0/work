import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';


const App = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <APIProvider apiKey={import.meta.env.VITE_MAP_API} >
            <div style={{ width: '100vw', height: '100vh' }}>
                <Map
                    zoom={8}
                    mapId={import.meta.env.VITE_MAP_ID}
                    center={{ lat: 37.7749, lng: -122.4194 }} // San Francisco
                >
                    <AdvancedMarker onClick={() => setOpen(true)} position={{ lat: 37.7749, lng: -122.4194 }}><Pin background={"violet"} borderColor={"green"} glyphColor={"purple"} />
                    </AdvancedMarker>
                    {open && <InfoWindow onCloseClick={() => setOpen(false)} position={{ lat: 37.7749, lng: -122.4194 }}><div className='bg-gray-200 font-bold text-xl border-2 p-5'> I am in san fransisco</div></InfoWindow>}
                </Map>
            </div>
        </APIProvider>
    );
}
export default App;

