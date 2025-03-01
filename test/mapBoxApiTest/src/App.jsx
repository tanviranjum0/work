import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

let App = () => {
  let INITIAL_CENTER = [-74.006, 40.7128];
  let INITIAL_ZOOM = 10;
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((showPosition) => {
  //       let latitude = showPosition.coords.latitude;
  //       let longitude = showPosition.coords.longitude;
  //       INITIAL_CENTER = [longitude, latitude];
  //     });
  //   }
  // }, []);
  let [center, setCenter] = useState(INITIAL_CENTER);
  let [zoom, setZoom] = useState(INITIAL_ZOOM);

  let mapRef = useRef();
  let mapContainerRef = useRef();
  // navigator.geolocation.getCurrentPosition((showPosition) => {
  //   let latitude = showPosition.coords.latitude;
  //   let longitude = showPosition.coords.longitude;
  //   setCenter([latitude, longitude]);
  // });

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoidGFudmlyYW5qdW0iLCJhIjoiY203bm82YjVuMDFzbjJxcHNjYmU2NzFieCJ9.HQ3wry_A2fszUOnKcV3F0A";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
    });

    mapRef.current.on("move", () => {
      // get the current center coordinates and zoom level from the map
      let mapCenter = mapRef.current.getCenter();
      let mapZoom = mapRef.current.getZoom();

      // update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <div id="map-container" style={{ height: "80%" }} ref={mapContainerRef} />
    </>
  );
};

export default App;
