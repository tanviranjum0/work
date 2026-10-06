import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import HeroSection from "../components/HeroSection";
import heroHome from "../assets/re/re7-optimized.jpg";
import "../assets/css/home.css";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set("searchTerm", searchTerm.trim());
    navigate(`/search${query.size ? `?${query.toString()}` : ""}`);
  };

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> A more considered way home</p>
          <h1 id="home-title">Find the place<br />that feels like <em>yours.</em></h1>
          <p className="home-intro">
            Browse homes to buy or rent, compare the details that matter, and
            make your next move with confidence.
          </p>
          <form className="home-search" onSubmit={handleSearch} role="search">
            <FaSearch aria-hidden="true" />
            <label className="sr-only" htmlFor="home-search-term">Search properties</label>
            <input
              id="home-search-term"
              type="search"
              placeholder="Try a home or neighborhood"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit" aria-label="Search properties"><FaArrowRight aria-hidden="true" /></button>
          </form>
          <div className="home-hero-links">
            <Link className="text-link" to="/search?type=sale">Explore homes for sale <FaArrowRight aria-hidden="true" /></Link>
            <Link className="text-link muted-link" to="/search?type=rent">Find a place to rent</Link>
          </div>
        </div>

        <div className="home-hero-visual">
          <img
            src={heroHome}
            alt="Modern stone home overlooking a quiet bay at sunset"
            fetchPriority="high"
          />
          <div className="hero-image-note">
            <span className="note-mark" aria-hidden="true">⌂</span>
            <span><strong>Your next chapter</strong><small>Starts with a place to call home</small></span>
          </div>
          <span className="hero-image-index">01 <i /> 04</span>
        </div>
      </section>

      <section className="home-benefits" aria-label="Ways to find your next home">
        <div><span className="benefit-number">01</span><span><strong>Browse with purpose</strong><small>See sale and rental homes in one place.</small></span></div>
        <div><span className="benefit-number">02</span><span><strong>Focus on the details</strong><small>Filter by price, rooms, parking, and more.</small></span></div>
        <div><span className="benefit-number">03</span><span><strong>Make your move</strong><small>Connect with the listing owner directly.</small></span></div>
      </section>

      <HeroSection />

      <section className="home-cta">
        <div>
          <p className="eyebrow"><span className="eyebrow-line" /> Have a place to share?</p>
          <h2>Good homes deserve<br />to be <em>found.</em></h2>
        </div>
        <div className="home-cta-action">
          <p>Reach people looking for their next home. Create a clear listing in just a few steps.</p>
          <Link to="/create-listing" className="button button-light">List your property <FaArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
