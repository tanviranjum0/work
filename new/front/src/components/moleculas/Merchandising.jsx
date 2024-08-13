import ProductCard from "../atoms/ProductCard";
import ProductCard2 from "../atoms/ProductCard2";

const Merchandising = () => {
  return (
    <div className="grid mx-auto w-[90%] overflow-hidden grid-cols-1 md:grid-cols-3 md:gap-5 justify-center items-center">
      <div className="text-4xl col-span-12 mt-32 text-center text-yellow-400">
        Merchandising
      </div>
      <div className="flex flex-col md:flex-row mx-auto justify-center">
        {" "}
        <div className="mx-auto">
          {" "}
          <ProductCard />
        </div>
        <div className="mx-auto">
          {" "}
          <ProductCard2 />
        </div>
      </div>
    </div>
  );
};

export default Merchandising;
