"use client";
import { useEffect } from "react";

const ApiAuth = () => {
  useEffect(() => {
    async function kaka() {
      const data = fetch(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET}`,
        }
      );
      const result = await data;
      const main = await result.json();
      console.log(main.access_token);
      localStorage.setItem("access_token", main.access_token);
    }
    kaka();
  }, []);
  return <div></div>;
};

export default ApiAuth;
