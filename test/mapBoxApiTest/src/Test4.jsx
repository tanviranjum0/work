import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
const Test4 = () => {
  const [myCordination, setMyCordination] = useState();
  // const x = document.getElementById("demo");

  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        // x.innerHTML = "Geolocation is not supported by this browser.";
        setMyCordination([-123.069003, 45.395273]);
      }
    }

    function showPosition(position) {
      console.log(position.coords);
      setMyCordination([position.coords.longitude, position.coords.latitude]);

      // x.innerHTML =
      //   "Latitude: " +
      //   position.coords.latitude +
      //   "<br>Longitude: " +
      //   position.coords.longitude;
    }
    getLocation();
  }, []);
  window.addEventListener("load", () => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoidGFudmlyYW5qdW0iLCJhIjoiY203bm82YjVuMDFzbjJxcHNjYmU2NzFieCJ9.HQ3wry_A2fszUOnKcV3F0A";
    const map = new mapboxgl.Map({
      container: "map2",
      style: "mapbox://styles/mapbox/streets-v12",
      center: myCordination, // myCordinationing position
      zoom: 12,
    });
    // set the bounds of the map
    // const bounds = [
    //   [-123.069003, 45.395273],
    //   [-122.303707, 45.612333],
    // ];
    // map.setMaxBounds(bounds);

    // an arbitrary myCordination will always be the same
    // only the end or destination will change
    // const myCordination = [-122.662323, 45.523751];

    // this is where the code for the next step will go
    // create a function to make a directions request
    async function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary myCordination will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${myCordination[0]},${myCordination[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: "GET" }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource("route")) {
        map.getSource("route").setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
      const instructions = document.getElementById("instructions");
      const steps = data.legs[0].steps;
      console.log(data);
      let tripInstructions = "";
      for (const step of steps) {
        tripInstructions += `<li>${step.maneuver.instruction}</li>`;
      }
      instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
        data.duration / 60
      )} min </strong></p><ol>${tripInstructions}</ol>`;
      // add turn instructions here at the end
    }

    map.on("load", () => {
      // make an initial directions request that
      // myCordinations and ends at the same location
      getRoute(myCordination);

      // Add myCordinationing point to the map
      map.addLayer({
        id: "point",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: myCordination,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be",
        },
      });
      // this is where the code from the next step will go
    });
    map.on("click", (event) => {
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
      const end = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: coords,
            },
          },
        ],
      };
      if (map.getLayer("end")) {
        map.getSource("end").setData(end);
      } else {
        map.addLayer({
          id: "end",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: coords,
                  },
                },
              ],
            },
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#f30",
          },
        });
      }

      getRoute(coords);
    });
    // get the sidebar and add the instructions
  });

  return (
    <div>
      {/* <div id="demo" className=""></div> */}
      <div id="map2"></div>
      <div id="instructions"></div>
    </div>
  );
};

export default Test4;
