import AppName from "./componants/AppName";
import AddTodo from "./componants/AddTodo";
import TodoItems from "./componants/TodoItems";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
function App() {
  // let initialtodoItem = [
  //   {
  //     name: "Tanvir",
  //     date: "12/3/24",
  //   },
  //   {
  //     name: "Anjum",
  //     date: "22/5/24",
  //   },
  //   {
  //     name: "Rahim",
  //     date: "19/1/24",
  //   },
  // ];
  const [todoItem, setTodoItem] = useState([]);
  const handleNewItem = (itemName, itemDueDate) => {
    // console.log(`New Item Added : ${itemName} Date : ${itemDueDate}`);
    const newTodoItems = [
      ...todoItem,
      { name: itemName, dueDate: itemDueDate },
    ];
    setTodoItem(newTodoItems);
  };
  const handleDeleteItem = (todoItemName) => {
    const newTodoItems = todoItem.filter((item) => item.name !== todoItemName);
    setTodoItem(newTodoItems);
  };
  return (
    <div className="container">
      <AppName />
      <AddTodo onNewItem={handleNewItem} />
      <TodoItems onDeleteClick={handleDeleteItem} todoItems={todoItem} />
    </div>
  );
}
export default App;
