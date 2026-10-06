import { useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { optimizeCloudinaryImage } from "../lib/cloudinary";

const Navbar = () => {
  const { currentUser, isAlreadyLoggedIn } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const userId = currentUser?.userObject?.id;

  const closeMenu = () => setNavOpen(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set("searchTerm", searchTerm.trim());
    const queryString = query.toString();
    navigate("/search" + (queryString ? "?" + queryString : ""));
    closeMenu();
  };

  return (
    <header className="site-header">
      <div className="navbar-shell">
        <Link to="/" className="brand" aria-label="FullEstate home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">⌂</span>
          <span className="brand-name">Full<span>Estate</span></span>
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={navOpen}
          aria-controls="primary-navigation"
          onClick={() => setNavOpen((open) => !open)}
        >
          {navOpen ? "×" : "☰"}
        </button>

        <nav id="primary-navigation" className={"primary-nav" + (navOpen ? " is-open" : "")} aria-label="Main navigation">
          <NavLink to="/" end className="nav-link" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/search?type=sale" className="nav-link" onClick={closeMenu}>Buy</NavLink>
          <NavLink to="/search?type=rent" className="nav-link" onClick={closeMenu}>Rent</NavLink>
          <NavLink to="/about" className="nav-link" onClick={closeMenu}>About</NavLink>
          {!isAlreadyLoggedIn && <NavLink to="/login" className="nav-link mobile-nav-link" onClick={closeMenu}>Sign in</NavLink>}
          <form className="mobile-search" onSubmit={handleSubmit} role="search">
            <label className="sr-only" htmlFor="mobile-search-term">Search properties</label>
            <input
              id="mobile-search-term"
              type="search"
              placeholder="Search properties"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" aria-label="Search properties"><FaSearch aria-hidden="true" /></button>
          </form>
        </nav>

        <form className="navbar-search" onSubmit={handleSubmit} role="search">
          <label className="sr-only" htmlFor="navbar-search-term">Search properties</label>
          <FaSearch aria-hidden="true" />
          <input
            id="navbar-search-term"
            type="search"
            placeholder="Search homes"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="submit" aria-label="Search properties"><FaSearch aria-hidden="true" /></button>
        </form>

        <div className="nav-actions">
          {isAlreadyLoggedIn ? (
            <>
              <Link to="/create-listing" className="nav-cta" onClick={closeMenu}>List a property</Link>
              <Link to={userId ? "/profile/" + userId : "/login"} className="nav-user" aria-label="Your profile" onClick={closeMenu}>
                {currentUser?.avatar?.secure_url
                  ? <img src={optimizeCloudinaryImage(currentUser.avatar.secure_url, 96)} alt="" />
                  : <span aria-hidden="true">{currentUser?.userObject?.name?.slice(0, 1) || "U"}</span>}
              </Link>
            </>
          ) : (
            <Link to="/login" className="nav-cta" onClick={closeMenu}>Sign in <span aria-hidden="true">↗</span></Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
