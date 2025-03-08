import "bootstrap/dist/css/bootstrap.css";
import { Suspence } from "react";

import Quote from "./components/swr/Quote";
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
const App = () => {
  return (
    <div>
      <Suspence fallback={<h1>Loading....</h1>}>
        <Quote />
      </Suspence>
    </div>
  );
};

export default App;
