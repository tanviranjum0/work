import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  CarFront,
  Lock,
  MapPin,
  MessageCircle,
  Navigation,
  Search,
  Share2,
  ShieldCheck,
  Tag,
  Wallet,
} from "lucide-react";
import api, { getApiErrorMessage, getStoredAccount, getToken } from "../utils/api";
import usePlaceSuggestions from "../hooks/usePlaceSuggestions";
import { Banner, Brand, Button } from "../components/ui";
import { VEHICLES, formatDistance, formatDuration, money } from "../utils/format";
import { ROLES } from "../utils/roles";
import "../components/ride/ride.css";
import "./Landing.css";

const FEATURES = [
  { icon: Navigation, title: "Live tracking", text: "Watch your driver approach and follow the route to your destination, second by second." },
  { icon: Tag, title: "Upfront pricing", text: "See the exact fare before you book. It does not change if traffic does." },
  { icon: Lock, title: "Two-factor protection", text: "Every rider and driver account is secured with an authenticator app, not just a password." },
  { icon: Share2, title: "Share your trip", text: "Send a private link so friends and family can follow your ride in real time." },
  { icon: ShieldCheck, title: "Safety toolkit", text: "One-tap emergency call, a safety alert to the other person, and emergency contacts." },
  { icon: MessageCircle, title: "Chat and call", text: "Message or call your driver in the app, with quick replies for busy moments." },
];

const STEPS = [
  { title: "Set your trip", text: "Enter where you are going. We find your pickup and price it instantly." },
  { title: "Meet your driver", text: "Get matched with a nearby driver and share the pickup code to start safely." },
  { title: "Ride and arrive", text: "Track the whole journey, pay in cash, and rate your trip when you arrive." },
];

function FareEstimator() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [active, setActive] = useState("pickup");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { items, clear } = usePlaceSuggestions(active === "pickup" ? pickup : destination, { visitor: true });

  const choose = (text) => {
    (active === "pickup" ? setPickup : setDestination)(text);
    if (active === "pickup") setActive("destination");
    clear();
  };

  const estimate = async (event) => {
    event.preventDefault();
    if (!pickup.trim() || !destination.trim()) return setError("Enter a pickup and a destination.");
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/ride/get-visitor-fare", { params: { pickup: pickup.trim(), destination: destination.trim() } });
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(getApiErrorMessage(err, "We could not estimate that trip."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="landing-estimator" onSubmit={estimate} aria-label="Fare estimate">
      <h2>Estimate your fare</h2>
      <div className="place-fields" style={{ paddingLeft: 28 }}>
        <span className="place-dot place-dot--pickup" aria-hidden="true" />
        <span className="place-dot place-dot--destination" aria-hidden="true" />
        <input className="place-input" aria-label="Pickup" placeholder="Pickup location" autoComplete="off" value={pickup}
          onFocus={() => setActive("pickup")} onChange={(event) => setPickup(event.target.value)} />
        <input className="place-input" aria-label="Destination" placeholder="Where to?" autoComplete="off" value={destination}
          onFocus={() => setActive("destination")} onChange={(event) => setDestination(event.target.value)} />
      </div>
      {items.length > 0 && (
        <div className="suggestions" role="listbox" aria-label="Suggestions">
          {items.slice(0, 4).map((text) => (
            <button key={text} type="button" className="suggestion" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(text)}>
              <span className="suggestion-icon"><MapPin size={16} /></span>
              <span className="suggestion-text"><strong>{text.split(", ")[0]}</strong><span>{text.split(", ").slice(1).join(", ")}</span></span>
            </button>
          ))}
        </div>
      )}
      {error && <Banner tone="danger">{error}</Banner>}
      {result && (
        <div className="landing-fares" aria-live="polite">
          <p className="qr-hint">
            {formatDistance(result.distanceTime.distance.value)} · about {formatDuration(result.distanceTime.duration.value)}
          </p>
          {Object.entries(VEHICLES).map(([type, vehicle]) => (
            <div key={type} className="landing-fare">
              <img src={vehicle.image} alt="" width="56" height="40" loading="lazy" decoding="async" />
              <span>{vehicle.name}</span>
              <strong>{money(result.fare[type])}</strong>
            </div>
          ))}
          <Button to="/signup" iconRight={<ArrowRight size={18} />}>Sign up to book</Button>
        </div>
      )}
      {!result && (
        <Button type="submit" loading={loading} loadingText="Estimating" icon={<Search size={18} />}>
          Get estimate
        </Button>
      )}
    </form>
  );
}

export default function Landing() {
  // Signed-in people go straight to their home screen.
  const stored = getStoredAccount();
  if (getToken() && stored?.type) return <Navigate to={ROLES[stored.type].home} replace />;

  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <nav aria-label="Primary" className="landing-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#drive">Drive</a>
        </nav>
        <div className="landing-nav-cta">
          <Button variant="ghost" size="sm" auto to="/login">Sign in</Button>
          <Button size="sm" auto to="/signup">Get started</Button>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-copy">
            <span className="qr-badge">Live tracking on every ride</span>
            <h1>Rides you can see, share and trust.</h1>
            <p>
              Book a car, auto or bike in seconds. Watch your driver arrive on a live map, share your trip with someone you
              trust, and know the price before you go.
            </p>
            <div className="landing-cta">
              <Button auto to="/signup" iconRight={<ArrowRight size={18} />}>Book a ride</Button>
              <Button auto variant="secondary" to="/captain/signup" icon={<CarFront size={18} />}>Drive with QuickRide</Button>
            </div>
          </div>
          <FareEstimator />
        </section>

        <section id="features" className="landing-section" aria-labelledby="features-title">
          <h2 id="features-title">Built for getting there safely</h2>
          <div className="landing-grid">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="landing-feature">
                <span className="qr-list-item-icon"><Icon size={20} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="landing-section landing-section--tint" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className="landing-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="landing-step-num">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="drive" className="landing-section landing-drive" aria-labelledby="drive-title">
          <div>
            <h2 id="drive-title">Drive when it suits you</h2>
            <p>
              Go online whenever you like, see each request&apos;s fare and distance before you accept, and track your earnings
              in your own dashboard. Passengers pay you in cash.
            </p>
            <div className="landing-cta">
              <Button auto to="/captain/signup" iconRight={<ArrowRight size={18} />}>Become a driver</Button>
              <Button auto variant="secondary" to="/captain/login">Driver sign in</Button>
            </div>
          </div>
          <div className="landing-drive-card" aria-hidden="true">
            <Wallet size={26} />
            <strong>Your earnings, in one place</strong>
            <span>Today, this week and every completed trip.</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <Brand />
        <nav aria-label="Footer">
          <Link to="/login">Rider sign in</Link>
          <Link to="/captain/login">Driver sign in</Link>
          <Link to="/signup">Create account</Link>
        </nav>
        <small>© {new Date().getFullYear()} QuickRide</small>
      </footer>
    </div>
  );
}
