import TodoItem from "./TodoItem";
const TodoItems = ({ todoItems }) => {
  return (
    <div>
      {todoItems.map((item) => (
        <TodoItem key={item.name} name={item.name} date={item.date} />
      ))}
      {/* <TodoItem name="Tanvir" date="12/3/24" />
      <TodoItem name="Anujum" date="23/2/24" /> */}
    </div>
  );
};
export default TodoItems;
// this.prop = props;
