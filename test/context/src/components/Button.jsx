import Component1 from "./Component1";
const Button = () => {
  return (
    <div>
      <span>
        <Component1></Component1>
      </span>
      <button className="btn btn-primary">Hello Button</button>
    </div>
  );
};

export default Button;
