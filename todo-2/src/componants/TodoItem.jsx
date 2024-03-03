function TodoItem2({ name, date }) {
  // this.prop = props;
  // const props = props;
  return (
    <div className=" row text-center td-row">
      <div className="col-6">{name}</div>
      <div className="col-4">{date}</div>
      <div className="col-2">
        <button className="btn btn-danger td-button m-1">Delete</button>
      </div>
    </div>
  );
}
export default TodoItem2;
