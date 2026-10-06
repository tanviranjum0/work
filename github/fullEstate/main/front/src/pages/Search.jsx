import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowDown, FaArrowRight, FaArrowUp, FaSearch } from "react-icons/fa";
import Item from "../components/Item";
import "../assets/css/home.css";

const defaultFilters = {
  searchTerm: "",
  type: "all",
  parking: false,
  furnished: false,
  offer: false,
  sort: "createdAt",
  order: "desc",
};

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const nextFilters = {
      searchTerm: urlParams.get("searchTerm") || "",
      type: ["sale", "rent"].includes(urlParams.get("type")) ? urlParams.get("type") : "all",
      parking: urlParams.get("parking") === "true",
      furnished: urlParams.get("furnished") === "true",
      offer: urlParams.get("offer") === "true",
      sort: ["createdAt", "regularPrice"].includes(urlParams.get("sort")) ? urlParams.get("sort") : "createdAt",
      order: urlParams.get("order") === "asc" ? "asc" : "desc",
    };
    setFilters(nextFilters);

    const controller = new AbortController();
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/listing/get" + location.search, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load properties.");
        const results = Array.isArray(data) ? data : [];
        setListings(results);
        setShowMore(results.length === 9);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError(fetchError.message || "Unable to load properties.");
          setListings([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchListings();
    return () => controller.abort();
  }, [location.search]);

  const handleChange = (event) => {
    const { id, value, checked, type } = event.target;
    setFilters((previous) => ({
      ...previous,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = new URLSearchParams();
    if (filters.searchTerm.trim()) query.set("searchTerm", filters.searchTerm.trim());
    query.set("type", filters.type);
    if (filters.parking) query.set("parking", "true");
    if (filters.furnished) query.set("furnished", "true");
    if (filters.offer) query.set("offer", "true");
    query.set("sort", filters.sort);
    query.set("order", filters.order);
    navigate("/search?" + query.toString());
  };

  const loadMore = async () => {
    setLoadingMore(true);
    setError("");
    try {
      const query = new URLSearchParams(location.search);
      query.set("startIndex", String(listings.length));
      const response = await fetch("/api/listing/get?" + query.toString());
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load more properties.");
      const results = Array.isArray(data) ? data : [];
      setListings((previous) => [...previous, ...results]);
      setShowMore(results.length === 9);
    } catch (fetchError) {
      setError(fetchError.message || "Unable to load more properties.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="search-page">
      <header className="search-heading">
        <p className="eyebrow"><span className="eyebrow-line" /> Explore FullEstate</p>
        <h1>Find your next place.</h1>
        <p>Bring the details that matter into focus.</p>
      </header>
      <form className="search-filter-panel" onSubmit={handleSubmit}>
        <div className="search-term-field">
          <label htmlFor="searchTerm">Location or property name</label>
          <div className="search-term-control">
            <FaSearch aria-hidden="true" />
            <input
              id="searchTerm"
              type="search"
              maxLength="80"
              placeholder="Try a neighborhood or home"
              value={filters.searchTerm}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="search-filter-row">
          <div className="search-type-field">
            <label htmlFor="type">I’m looking to</label>
            <select id="type" value={filters.type} onChange={handleChange}>
              <option value="all">Buy or rent</option>
              <option value="sale">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <fieldset className="search-checkboxes">
            <legend>Preferences</legend>
            <label><input id="offer" type="checkbox" checked={filters.offer} onChange={handleChange} /> Offers</label>
            <label><input id="parking" type="checkbox" checked={filters.parking} onChange={handleChange} /> Parking</label>
            <label><input id="furnished" type="checkbox" checked={filters.furnished} onChange={handleChange} /> Furnished</label>
          </fieldset>
          <div className="search-type-field search-sort-field">
            <label htmlFor="sort">Sort by</label>
            <select id="sort" value={filters.sort} onChange={handleChange}>
              <option value="createdAt">Recently added</option>
              <option value="regularPrice">Price</option>
            </select>
            <button type="button" className="sort-direction" aria-label={"Order " + (filters.order === "desc" ? "ascending" : "descending")} onClick={() => setFilters((previous) => ({ ...previous, order: previous.order === "desc" ? "asc" : "desc" }))}>
              {filters.order === "desc" ? <FaArrowDown aria-hidden="true" /> : <FaArrowUp aria-hidden="true" />}
            </button>
          </div>
          <button className="button search-submit" type="submit">Show properties <FaArrowRight aria-hidden="true" /></button>
        </div>
      </form>

      <section id="allListingContainer" className="search-results" aria-labelledby="search-results-title">
        <div className="search-results-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" /> Your shortlist starts here</p><h2 id="search-results-title">Available properties</h2></div>
          {!loading && <span>{listings.length} {listings.length === 1 ? "property" : "properties"}</span>}
        </div>
        {error && <p className="form-message form-error" role="alert">{error}</p>}
        {loading ? (
          <div className="listing-grid" aria-label="Loading properties" aria-busy="true">
            {[0, 1, 2].map((item) => <div className="listing-skeleton" key={item} />)}
          </div>
        ) : listings.length ? (
          <div className="listing-grid">
            {listings.map((listing) => <Item key={listing._id} listing={listing} />)}
          </div>
        ) : !error ? (
          <div className="listing-empty"><span className="empty-mark" aria-hidden="true">⌂</span><p>No properties match those filters yet.</p></div>
        ) : null}
        {showMore && (
          <div className="profile-more">
            <button type="button" className="profile-secondary-button" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Show more properties"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
