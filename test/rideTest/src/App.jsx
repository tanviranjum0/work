// import React from 'react';
// import { APIProvider, Map, useMap, useMapsLibrary, APIProviderContext, useMarkerRef, Marker } from '@vis.gl/react-google-maps';

// const App = () => {
//   const MyComponent1 = () => {
//     const map = useMap();

//     // triggers loading the places library and returns the API Object once complete (the
//     // component calling the hook gets automatically re-rendered when this is
//     // the case)
//     const placesLibrary = useMapsLibrary('places');

//     const [placesService, setPlacesService] = React.useState(null);

//     React.useEffect(() => {
//       if (!placesLibrary || !map) return;
//       console.log('placesLibrary', placesLibrary);
//       console.log('map', map);
//       // when placesLibrary is loaded, the library can be accessed via the
//       // placesLibrary API object
//       setPlacesService(new placesLibrary.PlacesService(map));
//     }, [placesLibrary, map]);

//     React.useEffect(() => {
//       if (!placesService) return;
//       console.log('placesService', placesService);
//       // ...use placesService...
//     }, [placesService]);

//     return <></>;
//   };
//   const [markerRef, marker] = useMarkerRef();

//   React.useEffect(() => {
//     if (!marker) {
//       return;
//     }
//     // console.log('marker', marker);
//     // do something with marker instance here
//   }, [marker]);

//   const MyComponent = () => {
//     const map = useMap();

//     React.useEffect(() => {
//       if (!map) return;
//       // console.log('map', map);
//       // here you can interact with the imperative maps API
//     }, [map]);
//   };
//   return (
//     <APIProvider apiKey={import.meta.env.VITE_MAP_API}>
//       <Map
//         style={{ width: '100vw', height: '100vh' }}
//         mapOptions={{
//           zoomControl: true,
//           streetViewControl: false,
//           fullscreenControl: false,
//           mapTypeControl: false,
//         }}
//         defaultZoom={8}
//         defaultCenter={{ lat: 22.3752, lng: 91.8349 }}
//       >
//         <Marker
//           ref={markerRef}
//           position={{ lat: 22.3752, lng: 91.8349 }} />
//       </Map>
//       <MyComponent />
//       <MyComponent1 />
//     </APIProvider>
//   )
// }



// export default App;


// import { useEffect, useMemo } from 'react';
// import { useMap, APIProvider } from '@vis.gl/react-google-maps';
// import { GoogleMapsOverlay } from '@deck.gl/google-maps';

// const DeckGlOverlay = ({ layers }) => {
//   const deck = useMemo(() => new GoogleMapsOverlay({ interleaved: true }), []);

//   const map = useMap();
//   useEffect(() => {
//     deck.setMap(map);

//     return () => deck.setMap(null);
//   }, [map]);
//   useEffect(() => deck.setProps({ layers }), [layers]);

//   // no dom rendered by this component
//   return null;
// };
// const mapProps = {
//   zoomControl: true,
//   streetViewControl: false,
//   fullscreenControl: false,
//   mapTypeControl: false,
// }
// const App = () => {
//   const deckGlLayers = useMemo(() => {
//     // Define your layers here
//     return [];
//   }, []);

//   return (
//     <APIProvider apiKey={import.meta.env.VITE_MAP_API}>
//       <Map {...mapProps}>
//         <DeckGlOverlay layers={deckGlLayers} />
//       </Map>
//     </APIProvider>
//   );
// };
// export default DeckGlOverlay


import React from 'react'
import Test from './components/Test'

const App = () => {
  return (
    <div>
      <Test />
    </div>
  )
}

export default App
