/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import heroHome from "../assets/re/re7-optimized.jpg";
import { optimizeCloudinaryImage } from "../lib/cloudinary";

function Item({ listing }) {
  const cover = listing.imageUrls?.[0]?.secure_url || heroHome;
  const price = Number(listing.offer ? listing.discountPrice : listing.regularPrice);
  const priceLabel = Number.isFinite(price) ? price.toLocaleString("en-US") : "Contact for price";

  return (
    <article className="property-card">
      <Link to={`/listing/${listing._id}`} className="property-card-link" aria-label={`View ${listing.name}`}>
        <div className="property-card-image-wrap">
          <img
            src={optimizeCloudinaryImage(cover, 720)}
            alt={listing.name ? `${listing.name} property` : "Property listing"}
            className="property-card-image"
            loading="lazy"
            decoding="async"
          />
          <span className="property-type">{listing.type === "rent" ? "For rent" : "For sale"}</span>
          {listing.offer && <span className="property-offer">Special offer</span>}
        </div>
        <div className="property-card-body">
          <div className="property-card-topline">
            <p className="property-card-price">${priceLabel}<small>{listing.type === "rent" ? " / month" : ""}</small></p>
            <span className="property-arrow" aria-hidden="true">↗</span>
          </div>
          <h3 className="property-card-title">{listing.name || "Untitled property"}</h3>
          <p className="property-card-address"><MdLocationOn aria-hidden="true" />{listing.address || "Location not specified"}</p>
          <p className="property-card-description">{listing.description}</p>
          <div className="property-card-details">
            <span>{listing.bedrooms} {listing.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
            <i aria-hidden="true" />
            <span>{listing.bathrooms} {listing.bathrooms === 1 ? "bath" : "baths"}</span>
            {listing.parking && <><i aria-hidden="true" /><span>Parking</span></>}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default Item;
