"use client";
import React from "react";
const Test3 = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const handleChange = () => {
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      setSelectedFile(fileInput.files[0]);
    }
  };
  const handleClick = async () => {
    const formData = new FormData();
    formData.append("username", "exampleUser");
    formData.append("email", "tanvir@gmail.com");
    formData.append("image", selectedFile as Blob);
    const res = await fetch("/api/test", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log(data);
  };
  return (
    <div className="bg-amber-400 h-[100vh] flex justify-center items-center">
      <input onChange={handleChange} type="file" name="image" id="image" />
      <div
        className="p-3 bg-gray-500 rounded cursor-pointer"
        onClick={handleClick}
      >
        Click Me
      </div>
    </div>
  );
};

export default Test3;
