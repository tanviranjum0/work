import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="brand" aria-label="FullEstate home">
            <span className="brand-mark" aria-hidden="true">⌂</span>
            <span className="brand-name">Full<span>Estate</span></span>
          </Link>
          <p>A thoughtful place to find a home, discover a new neighborhood, or share a property with the right people.</p>
        </div>
        <div className="footer-links">
          <div className="footer-link-group">
            <strong>Explore</strong>
            <Link to="/search?type=sale">Homes for sale</Link>
            <Link to="/search?type=rent">Places to rent</Link>
            <Link to="/create-listing">List a property</Link>
          </div>
          <div className="footer-link-group">
            <strong>FullEstate</strong>
            <Link to="/about">About us</Link>
            <Link to="/login">Your account</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} FullEstate</span>
        <span>Find a place for what comes next.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
