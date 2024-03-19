import { useState, useEffect } from "react";
let CurrentTime = () => {
  const [time, setTime] = useState(new Date());
  // let time = new Date();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
      // console.log("Cancelled");
    };
  }, []);

  return (
    <p className="lead">
      This is Current Times : {time.toLocaleDateString()} -{" "}
      {time.toLocaleTimeString()}
    </p>
  );
};
export default CurrentTime;
