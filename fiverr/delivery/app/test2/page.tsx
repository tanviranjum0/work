/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState } from "react";

const page = () => {
  const [mapLocation, setMapLocation] = useState(
    "https://www.google.com/maps/embed/v1/directions?origin=Izaäk Enschedéweg 50, 2031 CS Haarlem, Netherlands&destination=Museumstraat 1, 1071 XX Amsterdam, Netherlands&waypoints=Frankweg 2, 2153 PD Nieuw-Vennep, Netherlands&key=AIzaSyB1aG-PTEi0s9wtwmVlEuH9UmgnTVmPZ1M",
  );
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log(position);
          setMapLocation(
            `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}&output=embed`,
          );
        },

        (error) => {
          console.error("Error fetching position:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            default:
              console.error("An unknown error occurred.");
          }
        },
      );
    }
  };

  // Update Location
  // useEffect(() => {
  //   updateLocation();
  // }, []);

  return (
    <div className="relative w-full overflow-hidden h-dvh">
      {mapLocation && (
        <iframe
          height="700"
          style={{
            border: 0,
          }}
          title="Route map"
          src={mapLocation}
          className="absolute  h-screen w-full"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};

export default page;
