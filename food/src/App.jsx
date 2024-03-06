import FoodItems from "./components/FoodItems";
import ErrorMessage from "./components/ErrorMessage";
import Container from "./components/Container";
import FoodInput from "./components/FoodInput";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";

function App() {
  // let fooditems = ["Apple", "Lichi", "Mango", "Guava"];
  // let fooditems = [];
  // if (fooditems.length === 0) {
  //   return <h1>I am still hungry</h1>;
  // }
  // let emptyMessage =
  //   fooditems.length === 0 ? <h1>I am still hungry </h1> : null;
  // let textStateArr = useState("hello world");
  // let textToShow = textStateArr[0];
  // let setTextState = textStateArr[1];
  // [1];
  let [textToShow, setTextState] = useState("Enter Something");
  let [fooditems, setfooditems] = useState([]);
  // console.log(`Current Value of TextState:${textToShow}`);
  // let textToShow = "Enter some text";
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      let newFoodItem = event.target.value;
      let newItems = [...fooditems, newFoodItem];
      setfooditems(newItems);

      console.log(`Food Item : ` + newFoodItem);
    }

    setTextState(event.target.value);
  };
  return (
    <>
      <Container>
        <h1 className="food-heading">Healthy Foods</h1>
        <FoodInput handleKeyDown={handleKeyDown} />
        {/* {emptyMessage} */}
        {/* {fooditems.length === 0 ? <h1>I am still hungry </h1> : null} */}
        <p>{textToShow}</p>
        <ErrorMessage items={fooditems} />
        <FoodItems items={fooditems} />
      </Container>
      {/* <Container>Hey There! How Are You?</Container> */}
    </>
  );
}
export default App;
