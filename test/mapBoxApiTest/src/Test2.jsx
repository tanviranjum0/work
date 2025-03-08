import React from "react";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import mapboxgl from "mapbox-gl";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";

const Test2 = () => {
  const [myCordination, setMyCordination] = React.useState([]);
  React.useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        setMyCordination([-123.069003, 45.395273]);
      }
    }

    function showPosition(position) {
      console.log(position.coords);
      setMyCordination([position.coords.longitude, position.coords.latitude]);
    }
    getLocation();
  }, []);
  let map;
  window.addEventListener("load", () => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoidGFudmlyYW5qdW0iLCJhIjoiY203bm82YjVuMDFzbjJxcHNjYmU2NzFieCJ9.HQ3wry_A2fszUOnKcV3F0A";
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: myCordination,
      zoom: 13,
    });

    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
      }),
      "top-right"
    );
  });

  const handleClick = async () => {
    // const data = await fetch(
    //   `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${
    //     map.getBounds()._ne.lng
    //   },${map.getBounds()._ne.lat};${map.getBounds()._sw.lng},${
    //     map.getBounds()._sw.lat
    //   }?destinations=all&access_token=${mapboxgl.accessToken}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     "Access-Control-Allow-Origin": "http://localhost:5173",
    //     mode: "no-cors",
    //   }
    // );
    const data = await fetch(
      "https://api.mapbox.com/directions-matrix/v1/mapbox/driving/-122.42,37.78;-122.45,37.91;-122.48,37.73?approaches=curb;curb;curb&access_token=pk.eyJ1IjoidGFudmlyYW5qdW0iLCJhIjoiY203bm82YjVuMDFzbjJxcHNjYmU2NzFieCJ9.HQ3wry_A2fszUOnKcV3F0A"
    );
    const result = await data.json();
    console.log(result);
    console.log(
      `From : Longitute = ${map.getBounds()._ne.lng},  Latitude = ${
        map.getBounds()._ne.lat
      }`
    );
    console.log(
      `To : Longitute = ${map.getBounds()._sw.lng},  Latitude = ${
        map.getBounds()._sw.lat
      }`
    );
  };
  return (
    <div>
      <div id={"map"}></div>
      <div
        style={{
          height: "100%",
          marginTop: "70%",
        }}
        onClick={handleClick}
      >
        Click Me
      </div>
    </div>
  );
};

export default Test2;
