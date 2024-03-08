/* eslint-disable react/prop-types */
// import TodoItems from "./TodoItems";
// import TodoItem from "./TodoItem";
import { FaBeer } from "@react-icons/all-files/fa/FaBeer";
import { useState } from "react";

function AddTodo({ onNewItem }) {
  const [todoName, setTodoName] = useState();
  const [dueDate, setDueDate] = useState();
  const handleNameChange = (event) => {
    setTodoName(event.target.value);
  };
  const handleDateChange = (event) => {
    setDueDate(event.target.value);
  };
  const handleAddButtonClicked = () => {
    onNewItem(todoName, dueDate);
    setDueDate();
    setTodoName();
  };
  return (
    <div className=" row form-group">
      <div className="col-6">
        <input
          type="text"
          className="m-1 col form-control"
          cols="1"
          rows="1"
          onChange={handleNameChange}
          placeholder="Enter Text Here"
        ></input>
      </div>
      <div className="col-4">
        <input
          onChange={handleDateChange}
          className="m-1 col form-control"
          type="date"
        />
      </div>
      <div className="col-2">
        {" "}
        <button
          onClick={handleAddButtonClicked}
          className="col m-1 btn btn-primary form-control "
        >
          Add <FaBeer />
        </button>
      </div>
    </div>
  );
}
export default AddTodo;
