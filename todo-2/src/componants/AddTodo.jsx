import TodoItems from "./TodoItems";
// import TodoItem from "./TodoItem";

function AddTodo({ todoItems }) {
  return (
    <div>
      <TodoItems todoItems={todoItems} />
      {/* <TodoItem name="Tanvir" date="25/5/24" />
      <TodoItem name="Rahim" date="16/2/24" />
      <TodoItem name="Nothin" date="11/2/24" /> */}
    </div>
  );
}
export default AddTodo;
