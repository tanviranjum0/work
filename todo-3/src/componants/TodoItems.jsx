/* eslint-disable react/prop-types */
// import TodoItem from "./TodoItem";
const TodoItems = ({ todoItems, onDeleteClick }) => {
  return (
    <div>
      {todoItems.map((item) => (
        <div key={item.name} className=" row text-center td-row">
          <div className="col-6">{item.name}</div>
          <div className="col-4">{item.date}</div>
          <div className="col-2">
            <button
              className="btn btn-danger td-button m-1"
              onClick={() => onDeleteClick(item.name)}
            >
              Delete
            </button>
          </div>
        </div>
        // <TodoItem key={item.name} name={item.name} date={item.date} />
      ))}
      {/* <TodoItem name="Tanvir" date="12/3/24" />
      <TodoItem name="Anujum" date="23/2/24" /> */}
    </div>
  );
};
export default TodoItems;
// this.prop = props;
