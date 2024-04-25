import Quote from "./components/query/Quote";
import { QueryClientProvider, QueryClient } from "react-query";
export default function App() {
  const client = new QueryClient();

  return (
    <div>
      {/* <Suspense fallback={<h1 className="text-center mt-3">Loading...</h1>}> */}
      <QueryClientProvider client={client}>
        <Quote />
        <Quote />
      </QueryClientProvider>
      {/* </Suspense> */}
    </div>
  );
}
