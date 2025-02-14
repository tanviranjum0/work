import React from "react";
import "./main.css";
const page = () => {
  return (
    <div>
      <header>
        <nav>
          <div class="logo">Pathao</div>
          <ul class="nav-links">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>
      </header>

      <section class="hero">
        <h1>Ride with Pathao Bike</h1>
        <p>Fast, affordable, and reliable bike rides.</p>
        <button class="cta-button">Get Started</button>
      </section>

      <section class="features">
        <div class="feature">
          <h2>Safe Rides</h2>
          <p>Our riders are trained for your safety.</p>
        </div>
        <div class="feature">
          <h2>Affordable</h2>
          <p>Enjoy budget-friendly rides anytime.</p>
        </div>
        <div class="feature">
          <h2>Fast & Reliable</h2>
          <p>Get to your destination without delays.</p>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 Pathao. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default page;
