import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";

const Test1 = () => {
  const position = { lat: 43.6532, lng: -79.3832 };
  return (
    <div className="h-[100vh] w-[100%]">
      <APIProvider apiKey={import.meta.env.VITE_MAP_API}>
        <Map
          defaultCenter={position}
          defaultZoom={8}
          mapId={import.meta.env.VITE_MAP_ID}
          fullscreenControl={false}
        >
          <Directions />
        </Map>
      </APIProvider>
    </div>
  );
};

export default Test1;

const Directions = () => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    React.useState<google.maps.DirectionsService | null>(null);

  const [directionRenderer, setDirectionRenderer] =
    React.useState<google.maps.DirectionsRenderer | null>(null);

  const [routes, setRoutes] = React.useState<google.maps.DirectionsRoute[]>([]);

  const [routeIndex, setRouteIndex] = React.useState<number>(0);

  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  useEffect(() => {
    if (!directionRenderer) return;

    directionRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionRenderer]);
  useEffect(() => {
    if (!map || !routesLibrary) return;

    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionRenderer) return;

    directionsService
      .route({
        origin: "100 Front St, Toronto ON",
        destination: "500 College St, Toronto ON",
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((res) => {
        directionRenderer.setDirections(res);
        setRoutes(res.routes);
      });
  }, [directionsService, directionRenderer]);

  console.log("Routes:", routes);
  console.log("Selected Route:", selected);

  if (!leg) return <div className="directions">No way found</div>;

  return (
    <div className="directions">
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
      </p>
      <p>Distance : {leg.distance?.text}</p>
      <p>Duration : {leg.duration?.text}</p>
      <h1>Other routes</h1>
      <ul>
        {routes.map((route, index) => (
          <li key={route.summary}>
            <button onClick={() => setRouteIndex(index)}>
              {route.summary}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
