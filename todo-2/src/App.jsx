import AppName from "./componants/AppName";
import AddTodo from "./componants/AddTodo";
import "./App.css";
function App() {
  let todoItem = [
    {
      name: "Tanvir",
      date: "12/3/24",
    },
    {
      name: "Anjum",
      date: "22/5/24",
    },
    {
      name: "Rahim",
      date: "19/1/24",
    },
  ];
  return (
    <div className="container">
      <AppName />
      <AddTodo todoItems={todoItem} />
    </div>
  );
}
export default App;
