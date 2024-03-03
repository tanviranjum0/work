import { useState } from "react";

function Textarea(props) {
  const prop = props;
  const handleUpClick = () => {
    console.log(text);
    let newText = text.toUpperCase();
    setText(newText);
  };
  const handleDownClick = () => {
    console.log(text);
    let newText = text.toLowerCase();
    setText(newText);
  };
  const handleChange = (event) => {
    console.log("OnChnage");
    setText(event.target.value);
  };
  const [text, setText] = useState("");

  return (
    <div className="text-center container">
      <h2 className="my-3">{prop.heading}</h2>

      <textarea
        className="w-100"
        value={text}
        cols="30"
        rows="5"
        onChange={handleChange}
      ></textarea>

      <button className="btn btn-primary m-2" onClick={handleUpClick}>
        Convert To Uppercase
      </button>
      <button className="btn btn-primary m-2" onClick={handleDownClick}>
        Convert To Lowercase
      </button>
      <div className="container my-3">
        <h2>Text</h2>
        <p>
          Words : {text.split(" ").length} - Word-length : {text.length}
        </p>
      </div>
      <div className="container border border-danger ">
        <b>{text}</b>
      </div>
    </div>
  );
}
export default Textarea;
