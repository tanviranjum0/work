import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa";
import Contact from "../components/Contact";
import heroHome from "../assets/re/re7-optimized.jpg";
import { optimizeCloudinaryImage } from "../lib/cloudinary";

const Listing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const images = useMemo(
    () => listing?.imageUrls?.filter((image) => image?.secure_url) || [],
    [listing]
  );

  useEffect(() => {
    const controller = new AbortController();
    const fetchListing = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/listing/get/" + id, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "This property could not be found.");
        setListing(data);
        setActiveImage(0);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") setError(fetchError.message || "Unable to load this property.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchListing();
    return () => controller.abort();
  }, [id]);

  const changeImage = (step) => {
    setActiveImage((index) => (index + step + images.length) % images.length);
  };

  if (loading) return <main className="listing-detail"><p className="profile-status">Loading property...</p></main>;
  if (error || !listing) {
    return (
      <main className="listing-detail">
        <p className="form-message form-error" role="alert">{error || "This property could not be found."}</p>
        <Link className="text-link" to="/search">Back to properties <FaArrowRight aria-hidden="true" /></Link>
      </main>
    );
  }

  const price = Number(listing.offer ? listing.discountPrice : listing.regularPrice);
  const formattedPrice = Number.isFinite(price) ? price.toLocaleString("en-US") : "Contact for price";
  const currentImage = optimizeCloudinaryImage(images[activeImage]?.secure_url || heroHome, 1800);

  return (
    <main className="listing-detail">
      <div className="listing-detail-topline">
        <Link className="detail-back-link" to="/search"><FaArrowLeft aria-hidden="true" /> All properties</Link>
        <span>{listing.type === "rent" ? "For rent" : "For sale"}</span>
      </div>
      <section className="listing-gallery" aria-label="Property photographs">
        <img className="listing-gallery-image" src={currentImage} alt={listing.name + " property"} />
        {images.length > 1 && (
          <>
            <button type="button" className="gallery-control gallery-prev" onClick={() => changeImage(-1)} aria-label="Previous photo"><FaArrowLeft aria-hidden="true" /></button>
            <button type="button" className="gallery-control gallery-next" onClick={() => changeImage(1)} aria-label="Next photo"><FaArrowRight aria-hidden="true" /></button>
            <span className="gallery-count">{activeImage + 1} / {images.length}</span>
          </>
        )}
      </section>
      {images.length > 1 && (
        <div className="listing-thumbnails" aria-label="Choose a property photograph">
          {images.map((image, index) => (
            <button
              key={image.public_id || image.secure_url}
              type="button"
              className={index === activeImage ? "listing-thumbnail is-active" : "listing-thumbnail"}
              onClick={() => setActiveImage(index)}
              aria-label={"Show photo " + (index + 1)}
              aria-pressed={index === activeImage}
            >
              <img src={optimizeCloudinaryImage(image.secure_url, 240)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className="listing-detail-grid">
        <section className="listing-detail-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> FullEstate property</p>
          <h1>{listing.name}</h1>
          <p className="listing-detail-address"><FaMapMarkerAlt aria-hidden="true" />{listing.address}</p>
          <div className="listing-detail-price">
            <strong>${formattedPrice}</strong>
            {listing.type === "rent" && <span> / month</span>}
            {listing.offer && <span className="detail-offer">Offer</span>}
          </div>
          <p className="listing-detail-description">{listing.description}</p>
          <div className="listing-amenities">
            <div><FaBed aria-hidden="true" /><strong>{listing.bedrooms}</strong><span>{listing.bedrooms === 1 ? "bedroom" : "bedrooms"}</span></div>
            <div><FaBath aria-hidden="true" /><strong>{listing.bathrooms}</strong><span>{listing.bathrooms === 1 ? "bathroom" : "bathrooms"}</span></div>
            <div><FaParking aria-hidden="true" /><strong>{listing.parking ? "Yes" : "No"}</strong><span>parking</span></div>
            <div><FaChair aria-hidden="true" /><strong>{listing.furnished ? "Yes" : "No"}</strong><span>furnished</span></div>
          </div>
        </section>
        <aside className="listing-contact-card">
          <p className="eyebrow"><span className="eyebrow-line" /> Interested?</p>
          <h2>Ask about this place.</h2>
          <p>Send a note to the property owner to learn more.</p>
          <Contact listing={listing} />
        </aside>
      </div>
    </main>
  );
};

export default Listing;
