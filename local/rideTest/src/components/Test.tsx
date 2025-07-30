import React, { useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import trees from "../data/trees";

const Test = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <APIProvider apiKey={import.meta.env.VITE_MAP_API}>
        <Map
          mapId={import.meta.env.VITE_MAP_ID}
          defaultCenter={{ lat: 43.64, lng: -79.41 }}
          defaultZoom={10}
        >
          <Markers
            points={trees.map((tree) => ({
              ...tree,
              lat: Number(tree.lat),
              lng: Number(tree.lng),
            }))}
          />
        </Map>
      </APIProvider>
    </div>
  );
};

export default Test;

type Point = google.maps.LatLngLiteral & { key: string };
type Props = { points: Point[] };

const Markers = ({ points }: Props) => {
  const map = useMap();
  const [markers, setMarkers] = React.useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };
  return (
    <>
      {points.map((point) => (
        <AdvancedMarker
          position={point}
          key={point.key}
          ref={(marker) => setMarkerRef(marker, point.key)}
        >
          <span>🌳</span>
        </AdvancedMarker>
      ))}
    </>
  );
};
