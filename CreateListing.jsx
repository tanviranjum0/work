import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function CreateListing() {
  const navigate = useNavigate();
  const [file, setFiles] = useState();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      return setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      return setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      return setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const f = document.getElementById("image-input");
    // console.log(f.files);
    // console.log(f.files.length);
    setUploading(true);
    setImageUploadError("");
    setImageUploadError("");
    setUploaded(false);
    if (f.files === undefined) {
      setImageUploadError("You have to select at least 1 image for uploading");
      return;
    }
    if (f.files.length > 0 && f.files.length < 7) {
      for (let i = 0; i < f.files.length; i++) {
        // console.log(f.files[i]);
        if (e.files[i].size > 2000000) {
          setImageUploadError(
            "Maximum 2MB image size is allowed for each image"
          );
          return;
        } else {
          let formData = new FormData();
          formData.append("file", f.files[i]);
          formData.append("upload_preset", "xubbr2hv");
          formData.append("cloud_name", "tanviranjum");
          fetch("https://api.cloudinary.com/v1_1/tanviranjum/image/upload", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((error) => console.log("Error", error));
        }
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }
    setUploading(false);
    setUploaded(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.imageUrls.length === 0 &&
      formData.name == "" &&
      formData.address == "" &&
      formData.description == ""
    ) {
      setError("All fields are required");
      return;
    } else {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          "https://mernestatebackend-production.up.railway.app/api/listing/create",
          // "http://localhost:3000/api/listing/create",
          {
            method: "POST",
            credentials: "include",
            headers: {
              authorization: `${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await res.json();

        setLoading(false);
        if (data == "error logging in") {
          setError("Please login before creating a listing");
        } else if (data.success === false) {
          setError(data.message);
        } else {
          navigate(`/listing/${data._id}`);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
  };
  // const handleImageChange = async (e) => {
  //   setUploaded(false);
  //   const images = [];

  //   if (e.target.files.length > 0 && e.target.files.length < 7) {
  //     for (let i = 0; i < e.target.files.length; i++) {
  //       images.push(e.target.files[i]);
  //       setFiles(images);
  //     }
  //   } else {
  //     setImageUploadError("You can only upload 6 images per listing");
  //   }
  // };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <label
            className="pl-1 select-none font-mono font-bold"
            htmlFor="listingName"
          >
            Listing Name :{" "}
          </label>
          <input
            name="name"
            type="text"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <label
            className="pl-1 select-none font-mono font-bold"
            htmlFor="Description"
          >
            Description :{" "}
          </label>
          <textarea
            type="text"
            name="description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <label
            className="pl-1 select-none font-mono font-bold"
            htmlFor="address"
          >
            Address :{" "}
          </label>
          <input
            type="text"
            name="address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex my-5 text-xl px-5 md:text-2xl  gap-6 mx-auto flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                name="type"
                defaultValue={"rent"}
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                defaultValue={"rent"}
                name="type"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                defaultValue={true}
                name="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                defaultValue={false}
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                defaultValue={false}
                id="offer"
                name="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex mx-auto flex-wrap gap-6">
            <div className="flex  items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                name="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="pl-2 font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 file:bg-red-200 border bg-violet-100  border-slate-900 rounded-xl w-full"
              type="file"
              accept="image/*"
              id="image-input"
              multiple
              placeholder="Select Image"
            />
            <button
              disabled={uploading}
              className="p-3 active:scale-95 hover:scale-[1.01] text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleImageSubmit}
            >
              {uploaded ? "Uploaded" : uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="pl-2 text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          <button
            disabled={loading || uploading}
            type="submit"
            onClick={handleSubmit}
            className="transition-all active:scale-95  hover:scale-[1.01] hover:shadow-xl duration-300 p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Uploading..." : "Upload New Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
