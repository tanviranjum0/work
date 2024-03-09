/* eslint-disable react/prop-types */
import { useRef } from "react";

function AddTodo({ onNewItem }) {
  const nameElement = useRef();
  const dateElement = useRef();

  const handleAddButtonClicked = (e) => {
    e.preventDefault();
    const todoName = nameElement.current.value;
    const dueDate = dateElement.current.value;
    nameElement.current.value = "";
    dateElement.current.value = "";
    // console.log(todoName, dueDate);
    onNewItem(todoName, dueDate);
    // console.log(e);
  };

  return (
    <div className="container text-center">
      <form className="row kg-row" onSubmit={handleAddButtonClicked}>
        <div className="col-6">
          <input type="text" ref={nameElement} placeholder="Enter Todo Here" />
        </div>
        <div className="col-4">
          <input type="date" ref={dateElement} />{" "}
        </div>

        <div className="col-2">
          <button type="submit" className="btn btn-success kg-button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTodo;
