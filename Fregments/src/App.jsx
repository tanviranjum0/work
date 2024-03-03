import "./App.css";
import FoodItems from "./components/FoodItems";
import ErrorMessege from "./components/ErrorMessege";
// import Item from "./components/Item";
function App() {
  let foodItems = ["Mango", "pineapple", "Dal", "Salad", "Milk"];

  return (
    <>
      <h1 className="text-center meow header">Healthy Foods</h1>
      <ErrorMessege items={foodItems} />
      <FoodItems items={foodItems} />
    </>
  );
}
export default App;
