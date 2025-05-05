import React from 'react';
import { APIProvider, Map, useMap, APIProviderContext, useMarkerRef, Marker } from '@vis.gl/react-google-maps';

const App = () => {
  const [markerRef, marker] = useMarkerRef();

  React.useEffect(() => {
    if (!marker) {
      return;
    }
    console.log('marker', marker);
    // do something with marker instance here
  }, [marker]);

  const MyComponent = () => {
    const map = useMap();

    React.useEffect(() => {
      if (!map) return;
      console.log('map', map);
      // here you can interact with the imperative maps API
    }, [map]);
  };
  return (
    <APIProvider apiKey={import.meta.env.VITE_MAP_API}>
      <Map
        style={{ width: '100vw', height: '100vh' }}
        mapOptions={{
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        }}
        defaultZoom={8}
        defaultCenter={{ lat: 22.3752, lng: 91.8349 }}
      >

        <Marker ref={markerRef} position={{ lat: 22.3752, lng: 91.8349 }} />
      </Map>
      <MyComponent />
    </APIProvider>
  )
}



export default App;
