// import React from 'react'

function AppName() {
  return (
    <>
      <h1 className="text-center">Todo App</h1>
      <div className="row d-flex">
        <textarea
          className="col text-area"
          cols="1"
          rows="1"
          placeholder="Enter Text Here"
        ></textarea>
        <input className="m-2 col" type="date" />
        <button className="col btn btn-primary">Add</button>
      </div>
    </>
  );
}
export default AppName;
