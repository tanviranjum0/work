let CurrentTime = () => {
  let time = new Date();
  return (
    <p className="lead">
      This is Current Times : {time.toLocaleDateString()} -{" "}
      {time.toLocaleTimeString()}
    </p>
  );
};
export default CurrentTime;
