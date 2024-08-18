import React, { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
// import { toast } from "react-toastify";
import { AdvancedImage } from "@cloudinary/react";

const App = () => {
  // Use this sample image or upload your own via the Media Explorer
  const cld = new Cloudinary({ cloud: { cloudName: "tanviranjum" } });
  const img = cld
    .image("z4qi8wvyuegwdqfhgnhv")
    .format("png") // Optimize delivery by resizing and applying auto-format and auto-quality
    .quality(50)
    .resize(auto().gravity(autoGravity()).width(100).height(100)); // Transform the image: auto-crop to square aspect_ratio

  const [image, setImage] = useState(null);

  // console.log(image);
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "xubbr2hv");
    formData.append("cloud_name", "tanviranjum");
    fetch("https://api.cloudinary.com/v1_1/tanviranjum/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((e) => console.log(e));
  };
  return (
    <div className="p-20">
      <div>
        <input
          type="file"
          name=""
          multiple
          id=""
          onChange={(e) => {
            setImage(e.target.files);
            // console.log(e.target.files);
            // const images = [];
            // for (let i = 0; i < e.target.files.length; i++) {
            //   images.push(e.target.files[i]);
            //   setImage(images);
            // }
            // console.log(image);
          }}
        />
        <button
          onClick={() => {
            handleSubmit();
            // console.log(image[0]);
          }}
        >
          Upload
        </button>
      </div>
      <div className="mt-10">
        <AdvancedImage cldImg={img} />
      </div>
    </div>
  );
};

export default App;
