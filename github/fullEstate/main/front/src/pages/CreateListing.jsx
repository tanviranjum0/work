import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImages } from "../lib/cloudinary";
export default function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({

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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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



  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageUploadError("");
    setLoading(true);
    setError("");

    try {
      const files = Array.from(e.currentTarget.elements.namedItem("images")?.files || []);
      const imageUrls = await uploadImages(files);
      const response = await fetch("/api/listing/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrls }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create this listing.");
      navigate("/listing/" + data._id);
    } catch (submitError) {
      if (/image|jpg|png|webp|avif/i.test(submitError.message)) {
        setImageUploadError(submitError.message);
      } else {
        setError(submitError.message || "Unable to create this listing.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="listing-form-page">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form id="main-form" className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <label
            className="pl-1 select-none font-mono font-bold"
            htmlFor="name"
          >
            Listing Name :{" "}
          </label>
          <input
            name="name"
            type="text"
            className="border p-3  rounded-lg"
            id="name"
            minLength="3"
            maxLength="100"
            required

            onChange={(e) => handleChange(e)}
            value={formData.name}
          />
          <label
            className="pl-1 select-none font-mono font-bold"
            htmlFor="description"
          >
            Description :{" "}
          </label>
          <textarea
            name="description"
            className="border p-3 rounded-lg"
            id="description"
            maxLength="5000"
            required

            onChange={(e) => handleChange(e)}
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
            maxLength="200"
            required

            onChange={(e) => handleChange(e)}
            value={formData.address}
          />
          <div className="flex my-5 text-xl px-5 md:text-2xl  gap-6 mx-auto flex-wrap">
            <div className="flex gap-2">
              <input
                type="radio"
                id="sale"
                name="type"
                className="w-5"

                onChange={(e) => handleChange(e)}
                checked={formData.type === "sale"}
              />
              <label htmlFor="sale">Sell</label>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="rent"
                name="type"
                className="w-5"

                onChange={(e) => handleChange(e)}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                name="parking"
                className="w-5"

                onChange={(e) => handleChange(e)}
                checked={formData.parking}
              />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className="w-5"

                onChange={(e) => handleChange(e)}
                checked={formData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                name="offer"
                className="w-5"

                onChange={(e) => handleChange(e)}
                checked={formData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex mx-auto flex-wrap gap-6">
            <div className="flex  items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                min="1"
                max="20"
                required
                aria-label="Bedrooms"
                className="p-3 border border-gray-300 rounded-lg"

                onChange={(e) => handleChange(e)}
                value={formData.bedrooms}
              />
                <span aria-hidden="true">Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                min="1"
                max="20"
                required
                aria-label="Bathrooms"
                className="p-3 border border-gray-300 rounded-lg"
                onChange={(e) => handleChange(e)}
                value={formData.bathrooms}
              />
              <span aria-hidden="true">Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                name="regularPrice"
                min="50"
                max="100000000"
                required
                aria-label="Regular price"
                className="p-3 border border-gray-300 rounded-lg"
                onChange={(e) => handleChange(e)}
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
                  max="100000000"
                  required
                  aria-label="Discounted price"
                  className="p-3 border border-gray-300 rounded-lg"

                  onChange={(e) => handleChange(e)}
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
          <label htmlFor="image-input" className="pl-2 font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (up to 6, 2 MB each)
            </span>
          </label>
          <div className="flex gap-4">
            <div className="flex w-full">
              <input
                id="image-input"
                name="images"
                className="p-3 file:bg-red-200 border bg-violet-100  border-slate-900 rounded-xl w-full"
                type="file"
                accept="image/avif,image/jpeg,image/png,image/webp"
                multiple
                required
              />

            </div>
          </div>
          <p className="pl-2 text-red-700 text-sm" role="alert">
            {imageUploadError && imageUploadError}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="transition-all disabled:bg-slate-600 active:scale-95  hover:scale-[1.01] hover:shadow-xl duration-300 p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Uploading..." : "Upload New Listing"}
          </button>
          {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}
        </div>
      </form>
    </main>
  );
}
