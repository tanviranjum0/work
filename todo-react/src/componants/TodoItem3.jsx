import { MdDelete } from "react-icons/md";

function TodoItem3() {
  return (
    <div className=" row text-center td-row">
      <div className="col-6">Go To College</div>
      <div className="col-4">25/02/2024</div>
      <div className="col-2">
        <button className="btn btn-danger td-button m-1">
          <MdDelete />
        </button>
      </div>
    </div>
  );
}
export default TodoItem3;
