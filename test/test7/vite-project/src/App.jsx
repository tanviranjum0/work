import React from "react";

const App = () => {
  const handleSubmit = async () => {
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];
    const data = fetch("http://localhost:3000/image", {
      method: "POST",
      body: new FormData().append("image", file),
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });

    console.log(data);
  };
  return (
    <div>
      <input type="file" id="file" />
      <button onClick={() => handleSubmit()}>upload</button>
    </div>
  );
};

export default App;
