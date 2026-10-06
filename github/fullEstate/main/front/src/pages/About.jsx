import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const About = () => (
  <main className="about-page">
    <section className="about-intro">
      <p className="eyebrow"><span className="eyebrow-line" /> About FullEstate</p>
      <h1>A home is more than an address.</h1>
      <p>It is where everyday life takes shape. FullEstate brings property search and sharing into one clear, thoughtful experience.</p>
      <Link to="/search" className="button">Explore properties <FaArrowRight aria-hidden="true" /></Link>
    </section>
    <section className="about-principles" aria-label="How FullEstate works">
      <article><span>01</span><h2>Find what fits</h2><p>Explore homes for sale and rent, then narrow your search by the things that matter to you.</p></article>
      <article><span>02</span><h2>See the details</h2><p>Compare pricing, rooms, features, and photos before you decide what to explore next.</p></article>
      <article><span>03</span><h2>Start a conversation</h2><p>Contact the listing owner directly when you are ready to learn more about a property.</p></article>
    </section>
    <section className="about-closing">
      <p>Whether you are searching or sharing, make your next move with FullEstate.</p>
      <Link className="text-link" to="/create-listing">Share a property <FaArrowRight aria-hidden="true" /></Link>
    </section>
  </main>
);

export default About;
