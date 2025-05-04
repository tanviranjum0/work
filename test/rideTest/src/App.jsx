import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const App = () => {
  console.log(import.meta.env.VITE_MAP_API);
  return (
    < APIProvider apiKey={import.meta.env.VITE_MAP_API} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        mapOptions={{
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        }}
        onLoad={() => console.log('Map has loaded.')}
        onUnmount={() => console.log('Map has unmounted.')}
        onClick={() => console.log('Map has been clicked.')}
        onZoomChanged={() => console.log('Map zoom has changed.')}
        onBoundsChanged={() => console.log('Map bounds have changed.')}
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
      >
      </Map>
    </APIProvider >
  )
}



export default App;