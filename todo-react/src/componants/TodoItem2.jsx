import { MdDelete } from "react-icons/md";

function TodoItem2() {
  let jinis = "Buy Milk";
  let lathi = "25/02/24";
  return (
    <div className=" row text-center td-row">
      <div className="col-6">{jinis}</div>
      <div className="col-4">{lathi}</div>
      <div className="col-2">
        <button className="btn btn-danger td-button m-1">
          <MdDelete />
        </button>
      </div>
    </div>
  );
}
export default TodoItem2;
