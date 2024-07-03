"use client";

import { useState } from "react";

function Page() {
  const [image, setImage] = useState(null);
  const currentDate = new Date().toISOString().split("T")[0];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    if (!image) {
      console.error("No file selected");
      return;
    }
    console.log(image);
    const formData = new FormData();
    formData.set("image", image);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (response.ok) {
        console.log("File uploaded successfully");
      } else {
        console.log("Error uploading file1:", response.statusText);
      }
    } catch (error) {
      console.log("Error uploading file2:", error);
    }
  };

  return (
    <>
      <section className="text-gray-400 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">
              Upload Files
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Upload your image
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label className="custom-file-upload w-full bg-gray-500 bg-opacity-40 rounded border border-gray-700 focus:border-teal-500 focus:bg-gray-700 focus:ring-2 focus:ring-teal-900 h-16 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out">
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png, .mov, .mp4"
                      multiple={false}
                      onChange={handleFileChange}
                      id="image"
                      name="image"
                      className=" hidden w-full bg-opacity-40 rounded border border-gray-700 focus:border-teal-500 focus:bg-gray-700 focus:ring-2 focus:ring-teal-900  text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    ></input>
                    Choose File
                  </label>

                  {image && (
                    <div className="py-2">
                      {image.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Uploaded Image"
                          className="border rounded-lg"
                          style={{ width: "250px", height: "250px" }}
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(image)}
                          controls
                          className="border rounded-lg"
                        ></video>
                      )}
                      <p>Selected file: {image.name}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-2 w-full">
                <button
                  className="mt-6 flex mx-auto text-white bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg"
                  onClick={handleSubmit}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Page;
