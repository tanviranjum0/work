import { useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import Header from "../../components/Header/Header";
import "./Home.css";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
const Home = () => {
  const [catagory, setCatagory] = useState("All");
  // console.log(catagory);
  return (
    <div>
      <Header />
      <ExploreMenu catagory={catagory} setCatagory={setCatagory} />
      <FoodDisplay catagory={catagory} />
      <AppDownload />
    </div>
  );
};

export default Home;
