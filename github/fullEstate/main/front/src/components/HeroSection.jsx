/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { StoreContext } from "../context/StoreContext";
import Item from "./Item";

const ListingGroup = ({ title, description, type, listings, loading }) => (
  <section className="listing-section" aria-labelledby={`section-${type}`}>
    <div className="section-heading">
      <div>
        <p className="eyebrow"><span className="eyebrow-line" /> Curated for your next move</p>
        <h2 id={`section-${type}`}>{title}</h2>
        <p className="section-description">{description}</p>
      </div>
      <Link className="text-link section-link" to={`/search?type=${type}`}>
        View all <FaArrowRight aria-hidden="true" />
      </Link>
    </div>

    {loading ? (
      <div className="listing-grid" aria-label="Loading listings" aria-busy="true">
        {[0, 1, 2].map((item) => <div className="listing-skeleton" key={item} />)}
      </div>
    ) : listings.length ? (
      <div className="listing-grid">
        {listings.slice(0, 3).map((listing) => <Item listing={listing} key={listing._id} />)}
      </div>
    ) : (
      <div className="listing-empty">
        <span className="empty-mark" aria-hidden="true">⌂</span>
        <p>No {type === "sale" ? "homes for sale" : "rental homes"} are listed yet.</p>
        <Link to={`/search?type=${type}`} className="text-link">Browse all properties <FaArrowRight aria-hidden="true" /></Link>
      </div>
    )}
  </section>
);

const HeroSection = () => {
  const { initialListings, initialListingsLoading } = useContext(StoreContext);
  const saleItems = initialListings.filter((listing) => listing.type === "sale");
  const rentItems = initialListings.filter((listing) => listing.type === "rent");

  return (
    <div className="home-listings">
      <ListingGroup
        title="Homes for sale"
        description="Spaces with room for whatever comes next."
        type="sale"
        listings={saleItems}
        loading={initialListingsLoading}
      />
      <ListingGroup
        title="Places to rent"
        description="A comfortable next step, at your own pace."
        type="rent"
        listings={rentItems}
        loading={initialListingsLoading}
      />
    </div>
  );
};

export default HeroSection;
